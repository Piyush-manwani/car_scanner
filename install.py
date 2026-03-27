#!/usr/bin/env python3
"""
EngineAI Installer
Works on Windows, macOS and Linux.
Run with: python install.py
"""

import os
import sys
import platform
import subprocess
import urllib.request
import json
import shutil
import tempfile

REPO     = "Piyush-manwani/car_scanner"
APP_NAME = "EngineAI"
VERSION  = "v1.0.0"

# Colours
RED    = "\033[91m"
GREEN  = "\033[92m"
YELLOW = "\033[93m"
CYAN   = "\033[96m"
RESET  = "\033[0m"
BOLD   = "\033[1m"

def banner():
    os.system("cls" if platform.system() == "Windows" else "clear")
    print(f"""
{RED}{BOLD}  ███████╗███╗   ██╗ ██████╗ ██╗███╗   ██╗███████╗ █████╗ ██╗
  ██╔════╝████╗  ██║██╔════╝ ██║████╗  ██║██╔════╝██╔══██╗██║
  █████╗  ██╔██╗ ██║██║  ███╗██║██╔██╗ ██║█████╗  ███████║██║
  ██╔══╝  ██║╚██╗██║██║   ██║██║██║╚██╗██║██╔══╝  ██╔══██║██║
  ███████╗██║ ╚████║╚██████╔╝██║██║ ╚████║███████╗██║  ██║██║
  ╚══════╝╚═╝  ╚═══╝ ╚═════╝ ╚═╝╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝╚═╝{RESET}
{RESET}  AI-Powered Car Diagnostic Scanner
  Powered by GPT-4o via GitHub Models (Free)

  ─────────────────────────────────────────────
""")

def step(msg):
    print(f"  {CYAN}>{RESET} {msg}")

def success(msg):
    print(f"  {GREEN}✓{RESET} {msg}")

def warn(msg):
    print(f"  {YELLOW}!{RESET} {msg}")

def error(msg):
    print(f"  {RED}✗{RESET} {msg}")
    sys.exit(1)

def check_python_version():
    if sys.version_info < (3, 6):
        error("Python 3.6 or higher is required.")

def check_node():
    step("Checking Node.js...")
    try:
        result = subprocess.run(["node", "--version"], capture_output=True, text=True)
        if result.returncode == 0:
            success(f"Node.js found: {result.stdout.strip()}")
            return True
    except FileNotFoundError:
        pass
    return False

def install_node():
    system = platform.system()
    step("Node.js not found. Installing...")

    if system == "Windows":
        url = "https://nodejs.org/dist/v20.11.0/node-v20.11.0-x64.msi"
        tmp = os.path.join(tempfile.gettempdir(), "node-installer.msi")
        step("Downloading Node.js...")
        urllib.request.urlretrieve(url, tmp)
        step("Running Node.js installer...")
        subprocess.run(["msiexec", "/i", tmp, "/quiet", "/norestart"], check=True)
        os.remove(tmp)
        success("Node.js installed")

    elif system == "Darwin":
        # Try homebrew first
        if shutil.which("brew"):
            step("Installing Node.js via Homebrew...")
            subprocess.run(["brew", "install", "node"], check=True)
        else:
            url = "https://nodejs.org/dist/v20.11.0/node-v20.11.0.pkg"
            tmp = os.path.join(tempfile.gettempdir(), "node-installer.pkg")
            step("Downloading Node.js...")
            urllib.request.urlretrieve(url, tmp)
            step("Running Node.js installer (may ask for password)...")
            subprocess.run(["sudo", "installer", "-pkg", tmp, "-target", "/"], check=True)
            os.remove(tmp)
        success("Node.js installed")

    elif system == "Linux":
        step("Installing Node.js via package manager...")
        # Try apt first (Ubuntu/Debian)
        if shutil.which("apt"):
            subprocess.run(["sudo", "apt-get", "update", "-qq"], check=True)
            subprocess.run(["sudo", "apt-get", "install", "-y", "nodejs", "npm"], check=True)
        # Try dnf (Fedora)
        elif shutil.which("dnf"):
            subprocess.run(["sudo", "dnf", "install", "-y", "nodejs"], check=True)
        # Try pacman (Arch)
        elif shutil.which("pacman"):
            subprocess.run(["sudo", "pacman", "-Sy", "--noconfirm", "nodejs", "npm"], check=True)
        else:
            error("Could not find a package manager. Please install Node.js manually from nodejs.org")
        success("Node.js installed")

def get_latest_release():
    step("Fetching latest release from GitHub...")
    url = f"https://api.github.com/repos/{REPO}/releases/latest"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "EngineAI-Installer"})
        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read())
            system = platform.system()
            ext = {"Windows": ".msi", "Darwin": ".dmg", "Linux": ".deb"}.get(system)
            if ext:
                for asset in data.get("assets", []):
                    if asset["name"].endswith(ext):
                        return {
                            "version": data["tag_name"],
                            "url": asset["browser_download_url"],
                            "name": asset["name"]
                        }
    except Exception as e:
        warn(f"Could not fetch release: {e}")
    return None

def install_from_release(release):
    system = platform.system()
    url    = release["url"]
    name   = release["name"]
    version = release["version"]

    step(f"Downloading {name} ({version})...")
    tmp = os.path.join(tempfile.gettempdir(), name)
    urllib.request.urlretrieve(url, tmp)
    success("Download complete")

    if system == "Windows":
        step("Running Windows installer...")
        subprocess.run(["msiexec", "/i", tmp, "/quiet", "/norestart"], check=True)
        os.remove(tmp)
        success(f"{APP_NAME} installed")

    elif system == "Darwin":
        step("Mounting DMG...")
        mount_point = f"/Volumes/{APP_NAME}"
        subprocess.run(["hdiutil", "attach", tmp, "-mountpoint", mount_point, "-quiet"], check=True)
        app_src = os.path.join(mount_point, f"{APP_NAME}.app")
        app_dst = f"/Applications/{APP_NAME}.app"
        if os.path.exists(app_dst):
            shutil.rmtree(app_dst)
        step("Copying to Applications...")
        shutil.copytree(app_src, app_dst)
        subprocess.run(["hdiutil", "detach", mount_point, "-quiet"], check=True)
        os.remove(tmp)
        success(f"{APP_NAME} installed to /Applications")

    elif system == "Linux":
        step("Installing .deb package...")
        subprocess.run(["sudo", "dpkg", "-i", tmp], check=True)
        os.remove(tmp)
        success(f"{APP_NAME} installed")

def install_from_source():
    step("No release found. Installing from source...")

    install_dir = os.path.join(os.path.expanduser("~"), f".{APP_NAME.lower()}")
    if os.path.exists(install_dir):
        shutil.rmtree(install_dir)
    os.makedirs(install_dir)

    # Clone or download source
    if shutil.which("git"):
        step("Cloning repository...")
        subprocess.run(["git", "clone", f"https://github.com/{REPO}.git", install_dir, "--quiet"], check=True)
    else:
        step("Downloading source code...")
        zip_url  = f"https://github.com/{REPO}/archive/refs/heads/main.zip"
        zip_path = os.path.join(tempfile.gettempdir(), "engineai-src.zip")
        urllib.request.urlretrieve(zip_url, zip_path)
        import zipfile
        with zipfile.ZipFile(zip_path, "r") as z:
            z.extractall(tempfile.gettempdir())
        extracted = os.path.join(tempfile.gettempdir(), f"{REPO.split('/')[1]}-main")
        shutil.copytree(extracted, install_dir, dirs_exist_ok=True)
        os.remove(zip_path)
        shutil.rmtree(extracted)

    step("Installing npm dependencies...")
    subprocess.run(["npm", "install", "--silent"], cwd=install_dir, check=True)
    success("Dependencies installed")

    create_launcher(install_dir)

def create_launcher(install_dir):
    system = platform.system()
    step("Creating launcher command...")

    if system == "Windows":
        bin_dir = os.path.join(os.environ.get("LOCALAPPDATA", ""), "EngineAI", "bin")
        os.makedirs(bin_dir, exist_ok=True)
        cmd = f'@echo off\ncd /d "{install_dir}" && npm start'
        with open(os.path.join(bin_dir, "engineai.cmd"), "w") as f:
            f.write(cmd)
        # Add to PATH
        current = os.environ.get("PATH", "")
        if bin_dir not in current:
            subprocess.run(
                ["setx", "PATH", f"{current};{bin_dir}"],
                capture_output=True
            )
        success("Created 'engineai' command")

    elif system in ("Darwin", "Linux"):
        bin_path = "/usr/local/bin/engineai"
        script = f'#!/bin/bash\ncd "{install_dir}" && npm start'
        tmp_script = os.path.join(tempfile.gettempdir(), "engineai")
        with open(tmp_script, "w") as f:
            f.write(script)
        subprocess.run(["sudo", "mv", tmp_script, bin_path], check=True)
        subprocess.run(["sudo", "chmod", "+x", bin_path], check=True)
        success("Created 'engineai' command")

def main():
    check_python_version()
    banner()

    system = platform.system()
    print(f"  Detected platform: {BOLD}{system}{RESET}")
    print()

    # Step 1: Node.js
    if not check_node():
        install_node()

    # Step 2: Try release installer first
    release = get_latest_release()
    if release:
        install_from_release(release)
    else:
        install_from_source()

    # Done
    print()
    print(f"  {'─' * 45}")
    print()
    print(f"  {GREEN}{BOLD}EngineAI installed successfully!{RESET}")
    print()

    if system == "Windows":
        print(f"  Run it with:")
        print(f"    {YELLOW}engineai{RESET}   (restart terminal first)")
        print()
        print(f"  Or open EngineAI from your Start Menu.")
    elif system == "Darwin":
        print(f"  Run it with:")
        print(f"    {YELLOW}engineai{RESET}")
        print()
        print(f"  Or open EngineAI from your Applications folder.")
    elif system == "Linux":
        print(f"  Run it with:")
        print(f"    {YELLOW}engineai{RESET}")
    print()
    print(f"  {'─' * 45}")
    print()

if __name__ == "__main__":
    main()
