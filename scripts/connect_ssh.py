import paramiko
import sys

def run_ssh_command(host, user, password, command):
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        # print(f"Connecting to {host}...")
        client.connect(host, username=user, password=password)
        # print("Connected successfully.")
        
        stdin, stdout, stderr = client.exec_command(command)
        
        # Stream output
        while True:
            line = stdout.readline()
            if not line:
                break
            print(line, end="")
            
        # Check for errors after
        error = stderr.read().decode('utf-8')
        if error:
            print("STDERR:", error)
            
    except Exception as e:
        print(f"Connection failed: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    HOST = "5.189.163.157"
    USER = "root"
    PASS = "8hXkdMSdNP8Ljq6m"
    
    cmd = "uname -a"
    if len(sys.argv) > 1:
        cmd = " ".join(sys.argv[1:])
    
    run_ssh_command(HOST, USER, PASS, cmd)
