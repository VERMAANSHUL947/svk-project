@echo off
cd /d "%~dp0"
if not exist "data" mkdir data
echo Starting Local MongoDB (User Mode)...
echo This does NOT require Admin privileges.
echo Keep this window open while using the website.
echo.
"C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe" --dbpath "data" --bind_ip 127.0.0.1
pause
