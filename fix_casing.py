import os
import shutil

def pascal_case(s):
    if not s: return s
    parts = s.replace('-', '_').split('_')
    return ''.join(p.capitalize() for p in parts if p)

def merge_case_variants(root_dir):
    for root, dirs, files in os.walk(root_dir, topdown=False):
        # Handle directories first (bottom-up)
        for d in dirs:
            current_path = os.path.join(root, d)
            # Standardize directory name to PascalCase UNLESS it's ui or common special names?
            # Actually, let's just merge duplicates of the SAME name but different case.
            
            # Find any siblings with different case
            siblings = os.listdir(root)
            variants = [s for s in siblings if s.lower() == d.lower() and s != d]
            
            for v in variants:
                v_path = os.path.join(root, v)
                if os.path.isdir(v_path):
                    print(f"Merging {v_path} into {current_path}")
                    # Move all contents of v into d
                    for item in os.listdir(v_path):
                        src = os.path.join(v_path, item)
                        dst = os.path.join(current_path, item)
                        if os.path.exists(dst):
                            if os.path.isdir(src):
                                # Recurse? os.walk handles this with topdown=False
                                pass
                            else:
                                os.remove(src) # Prefer d version
                        else:
                            shutil.move(src, dst)
                    os.rmdir(v_path)

def rename_to_pascal(root_dir):
    # Only rename specific folders we want to be PascalCase
    target_folders = ['Components', 'Layouts', 'Pages', 'Hooks', 'Types', 'Actions', 'Routes', 'Lib']
    
    for folder in target_folders:
        path = os.path.join(root_dir, folder)
        if not os.path.exists(path): continue
        
        for root, dirs, files in os.walk(path, topdown=False):
            for d in dirs:
                if d == 'UI': continue # Skip UI folder name itself if already capped
                old_path = os.path.join(root, d)
                new_name = pascal_case(d)
                if new_name == 'Ui': new_name = 'UI' # Special case
                
                new_path = os.path.join(root, new_name)
                if old_path != new_path:
                    if os.path.exists(new_path):
                        # Merge if exists
                        for item in os.listdir(old_path):
                            shutil.move(os.path.join(old_path, item), os.path.join(new_path, item))
                        os.rmdir(old_path)
                    else:
                        os.rename(old_path, new_path)
                    print(f"Renamed dir: {old_path} -> {new_path}")
            
            for f in files:
                if f.endswith(('.tsx', '.ts')):
                    if f == 'index.ts' or f == 'ssr.tsx' or f == 'app.tsx': continue
                    old_path = os.path.join(root, f)
                    name, ext = os.path.splitext(f)
                    new_name = pascal_case(name) + ext
                    new_path = os.path.join(root, new_name)
                    if old_path != new_path:
                        if not os.path.exists(new_path):
                            os.rename(old_path, new_path)
                            print(f"Renamed file: {old_path} -> {new_path}")

root = '/home/badr/Desktop/checkappvid/resources/js'
merge_case_variants(root)
rename_to_pascal(root)
print("Done.")
