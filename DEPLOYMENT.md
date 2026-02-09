# CheckAppVid Deployment Guide

This guide details the complete process for deploying **CheckAppVid** to a new Ubuntu/Debian VPS.

## 1. Server Prerequisites
Run these commands as `root` or a user with `sudo`.

```bash
# Update System
sudo apt update && sudo apt upgrade -y

# Install PHP 8.2+ and Extensions
sudo apt install php php-cli php-fpm php-mysql php-xml php-curl php-mbstring php-zip unzip -y

# Install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Install Git & Supervisor
sudo apt install git supervisor -y

# Install Node.js (CRITICAL for yt-dlp)
sudo apt install nodejs npm -y
# Optional: Install nvm if you need specific version, but apt version usually works for yt-dlp
```

## 2. Clone & Setup Project

```bash
# Navigate to web directory
cd /var/www

# Clone Repository
git clone https://github.com/ElkhouliMohamed/checkappvid.git checkmv
cd checkmv

# Install PHP Dependencies
composer install --optimize-autoloader --no-dev

# Set Permissions
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache
```

## 3. Environment Configuration

### A. Create .env File
```bash
cp .env.example .env
nano .env
```
**Critical Settings to Change:**
```ini
APP_ENV=production
APP_DEBUG=false
APP_URL=https://checkmv.com

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=checkmv
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password

# Gemini Configuration
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.0-flash   # Or gemini-1.5-flash

# Node.js Path (If using NVM or custom location)
# Run `which node` to find this path
NODE_PATH=/usr/bin/node

# YouTube Cookies (Optional, but recommended if IP blocked)
# Default locations are checked automatically, but can be forced:
# YOUTUBE_COOKIES_PATH=/var/www/checkmv/storage/app/youtube_cookies.txt
```

### B. Generate Key & Migrate
```bash
php artisan key:generate
php artisan migrate --force
```

## 4. YouTube Authentication (Cookies) [CRITICAL]
YouTube often blocks VPS IP addresses. To fix this, you must "authenticate" your requests using cookies.

### Step 1: Get Cookies from your Browser
1.  **Install Extension**:
    - **Chrome**: [Get cookies.txt LOCALLY](https://chrome.google.com/webstore/detail/get-cookiestxt-locally/cclelndahbckbenkjhflpdbgdldlbecc)
    - **Firefox**: [Get cookies.txt LOCALLY](https://addons.mozilla.org/en-US/firefox/addon/get-cookies-txt-locally/)
2.  **Open YouTube**: Go to `youtube.com`.
    - **Important**: Log out of your main account or use a **dummy/burner account**.
    - Ensure you can watch videos normally.
3.  **Export**:
    - Click the extension icon.
    - Click **"Export"**.
    - Save the file as `youtube_cookies.txt`.

### Step 2: Upload to VPS
You need to put this file on your server at `/var/www/checkmv/storage/app/youtube_cookies.txt`.

**Option A: Copy & Paste (Easiest)**
1.  Open the `youtube_cookies.txt` file on your computer with Notepad/TextEdit.
2.  Copy **ALL** the text.
3.  On your VPS, run:
    ```bash
    nano /var/www/checkmv/storage/app/youtube_cookies.txt
    ```
4.  Standard Paste (Right-click or Ctrl+V).
5.  Save and Exit: Press `Ctrl+O`, `Enter`, then `Ctrl+X`.

**Option B: Upload via SCP**
Run this from your **local computer's terminal**:
```bash
scp path/to/youtube_cookies.txt root@your-vps-ip:/var/www/checkmv/storage/app/youtube_cookies.txt
```

### Step 3: Verify
Run the debug script on the VPS to confirm cookies are found:
```bash
php /var/www/checkmv/test_debug_vps.php
```
It should say: `YOUTUBE_COOKIES_PATH (or default) found and file exists`.

## 5. Supervisor Configuration (Background Queue)
This keeps the video analysis worker running 24/7.

1.  **Create Config**:
    ```bash
    sudo nano /etc/supervisor/conf.d/checkappvid-worker.conf
    ```

2.  **Paste Configuration**:
    ```ini
    [program:checkappvid-worker]
    process_name=%(program_name)s_%(process_num)02d
    command=php /var/www/checkmv/artisan queue:work --sleep=3 --tries=3 --max-time=3600
    autostart=true
    autorestart=true
    stopasgroup=true
    killasgroup=true
    user=www-data
    numprocs=1
    redirect_stderr=true
    stdout_logfile=/var/www/checkmv/storage/logs/worker.log
    stopwaitsecs=3600
    ```
    *Change `user=www-data` to `root` only if necessary permissions are strictly required, but `www-data` is safer.*

3.  **Start Supervisor**:
    ```bash
    sudo supervisorctl reread
    sudo supervisorctl update
    sudo supervisorctl start checkappvid-worker:*
    ```

## 6. Verification
Run the included debug script to verifying everything is ready:
```bash
php test_debug_vps.php
```

If checks pass, your deployment is successful!
