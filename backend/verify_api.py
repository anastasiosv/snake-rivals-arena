import requests
import sys
import time
import subprocess

BASE_URL = "http://localhost:8000"

def run_server():
    print("Starting server...")
    process = subprocess.Popen(
        ["uv", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    time.sleep(5) # Wait for server to start
    return process

def test_endpoints():
    print("Testing endpoints...")
    
    # Login
    print("Testing Login...")
    login_payload = {"username": "SnakeMaster", "password": "password"}
    response = requests.post(f"{BASE_URL}/auth/login", json=login_payload)
    if response.status_code != 200:
        print(f"Login failed: {response.text}")
        return False
    token = response.json()["token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("Login successful.")

    # Get Me
    print("Testing Get Me...")
    response = requests.get(f"{BASE_URL}/auth/me", headers=headers)
    if response.status_code != 200:
        print(f"Get Me failed: {response.text}")
        return False
    print("Get Me successful.")

    # Leaderboard
    print("Testing Leaderboard...")
    response = requests.get(f"{BASE_URL}/leaderboard")
    if response.status_code != 200:
        print(f"Leaderboard failed: {response.text}")
        return False
    print("Leaderboard successful.")

    # Spectate
    print("Testing Spectate...")
    response = requests.get(f"{BASE_URL}/spectate/live")
    if response.status_code != 200:
        print(f"Spectate failed: {response.text}")
        return False
    print("Spectate successful.")

    return True

if __name__ == "__main__":
    server_process = run_server()
    try:
        success = test_endpoints()
        if success:
            print("All tests passed!")
            sys.exit(0)
        else:
            print("Some tests failed.")
            sys.exit(1)
    finally:
        server_process.terminate()
        server_process.wait()
