import argparse
import os
import json
import sys
import time
from dotenv import load_dotenv
import google.generativeai as genai
import yt_dlp
try:
    from moviepy.editor import VideoFileClip
except ImportError:
    from moviepy import VideoFileClip

# Load environment variables
load_dotenv()

# Load environment variables
load_dotenv()

# Global configuration moved to main() to allow argument override

def get_video_title(url):
    try:
        ydl_opts = {
            'quiet': True,
            'noprogress': True,
            'no_warnings': True,
            'logger': None,
        }
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            return info.get('title', 'Unknown Title')
    except Exception:
        return 'Unknown Title'

def download_video(url, output_path="temp_video.mp4"):
    ydl_opts = {
        'format': 'best[ext=mp4]',
        'outtmpl': output_path,
        'quiet': True,
        'noprogress': True,
        'no_warnings': True,
        'logger': None,
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])
    return output_path

def split_video(file_path, chunk_duration=600): # 10 minutes chunks
    # This acts as a placeholder or simple splitter.
    # For now, Gemini can handle large files up to a limit (2GB/hour).
    # If file is too large, we might need to split it.
    clip = VideoFileClip(file_path)
    duration = clip.duration
    
    if duration <= chunk_duration:
        return [file_path]
    
    chunks = []
    for i in range(0, int(duration), chunk_duration):
        start = i
        end = min(i + chunk_duration, duration)
        chunk_name = f"{file_path}_{i}.mp4"
        subclip = clip.subclip(start, end)
        subclip.write_videofile(chunk_name, codec="libx264", audio_codec="aac", quiet=True)
        chunks.append(chunk_name)
    
    clip.close()
    return chunks

def format_timestamp(seconds):
    return time.strftime('%H:%M:%S', time.gmtime(seconds))

def parse_timestamp(timestamp_str):
    parts = list(map(int, timestamp_str.split(':')))
    if len(parts) == 2:
        return parts[0] * 60 + parts[1]
    elif len(parts) == 3:
        return parts[0] * 3600 + parts[1] * 60 + parts[2]
    return 0

def retry_api_call(func, *args, retries=5, delay=2, **kwargs):
    for i in range(retries):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            if "429" in str(e) or "quoata" in str(e).lower() or "resource" in str(e).lower():
                if i == retries - 1:
                    raise e
                sleep_time = delay * (2 ** i)
                print(f"Rate limit hit. Retrying in {sleep_time}s...", file=sys.stderr)
                time.sleep(sleep_time)
            else:
                raise e
    return None

def analyze_video_content(video_path, model_name="gemini-1.5-flash", offset_seconds=0):
    print(f"Uploading {video_path} to Gemini...", file=sys.stderr)
    video_file = retry_api_call(genai.upload_file, video_path)
    
    while video_file.state.name == "PROCESSING":
        print('.', end='', flush=True, file=sys.stderr)
        time.sleep(2)
        video_file = retry_api_call(genai.get_file, video_file.name)

    if video_file.state.name == "FAILED":
        raise ValueError(f"Video processing failed: {video_file.state.name}")

    print(f"\nAnalysis starting with {model_name}...", file=sys.stderr)
    
    try:
        model = genai.GenerativeModel(model_name)
    except Exception:
        print(f"Model {model_name} not found or not supported. Falling back to gemini-2.0-flash.", file=sys.stderr)
        model = genai.GenerativeModel("gemini-2.0-flash")
    
    prompt = """
    Analyze this video for adult content, violence, and other safety concerns.
    Provide a detailed report in JSON format with the following structure:
    {
        "safety_score": 0-100 (where 100 is safe, 0 is very unsafe),
        "summary": "Brief summary of the video content",
        "flags": [
            {
                "timestamp": "MM:SS or HH:MM:SS",
                "category": "Adult|Violence|Hate|Dangerous",
                "severity": "Low|Medium|High",
                "description": "Description of the flagged content"
            }
        ]
    }
    Ensure the output is strictly valid JSON.
    """
    
    response = retry_api_call(model.generate_content, [video_file, prompt], request_options={"timeout": 600})
    
    # Clean up JSON
    text = response.text
    if text.startswith("```json"):
        text = text[7:]
    if text.endswith("```"):
        text = text[:-3]
        
    result = json.loads(text)
    
    # Adjust timestamps if offset > 0
    if offset_seconds > 0:
        if "flags" in result:
            for flag in result["flags"]:
                ts_sec = parse_timestamp(flag["timestamp"])
                flag["timestamp"] = format_timestamp(ts_sec + offset_seconds)
                
    return result

def main():
    parser = argparse.ArgumentParser(description="Analyze video content with Gemini.")
    parser.add_argument("--url", help="YouTube video URL")
    parser.add_argument("--file", help="Local video file path")
    parser.add_argument("--model", default="gemini-2.0-flash", help="Gemini model name")
    
    parser.add_argument("--api_key", help="Gemini API Key (overrides .env)")
    
    args = parser.parse_args()
    
    # Configure API Key
    api_key = args.api_key or os.getenv("GEMINI_API_KEY")
    if not api_key:
        print(json.dumps({"error": "GEMINI_API_KEY not found in .env and not provided as argument"}))
        sys.exit(1)
        
    genai.configure(api_key=api_key)
    
    created_files = []
    
    try:
        video_path = None
        video_title = None

        if args.url:
            video_title = get_video_title(args.url)
            video_path = download_video(args.url)
            created_files.append(video_path)
        elif args.file:
            video_path = args.file
            video_title = os.path.basename(args.file)
        else:
            print(json.dumps({"error": "No URL or file provided"}))
            sys.exit(1)
            
        # Check duration
        clip = VideoFileClip(video_path)
        duration = clip.duration
        clip.close()
        
        CHUNK_LIMIT = 1200 # 20 minutes
        
        final_result = {
            "title": video_title,
            "safety_score": 100,
            "summary": "",
            "flags": []
        }
        
        if duration > CHUNK_LIMIT:
            print(f"Video is long ({duration}s). Splitting...", file=sys.stderr)
            chunks = split_video(video_path, chunk_duration=600)
            created_files.extend(chunks)
            
            lowest_score = 100
            combined_summary = []
            
            for i, chunk in enumerate(chunks):
                offset = i * 600
                chunk_result = analyze_video_content(chunk, args.model, offset_seconds=offset)
                
                lowest_score = min(lowest_score, chunk_result.get("safety_score", 100))
                combined_summary.append(f"Part {i+1}: " + chunk_result.get("summary", ""))
                final_result["flags"].extend(chunk_result.get("flags", []))
                
            final_result["safety_score"] = lowest_score
            final_result["summary"] = " ".join(combined_summary)
            
        else:
            final_result = analyze_video_content(video_path, args.model)
            
        print(json.dumps(final_result, indent=2))
        
        # Cleanup
        for f in created_files:
            if os.path.exists(f) and f != args.file: # Don't delete user provided file
                try:
                    os.remove(f)
                except:
                    pass

    except Exception as e:
        error_msg = {"error": str(e)}
        print(json.dumps(error_msg))
        sys.exit(1)

if __name__ == "__main__":
    main()
