# SystemViewer

SystemViewer is a python-based System Monitor.

## Features

SystemViewer queries System information, and, depending on your settings,
it can send emails, write it to a log file or generate a HTML website
to visualize the current state.

* Monitors RAM, CPU, uptime, OS, Storage
* Can automatically send emails when thresholds are reached
* Configurable
* Website for viewing current status

## Setup

SystemViewer is meant to be used with a cronjob, but other autostart services can be used.

Whenever it is ran, it will read the config file,
query system information, and if supplied with an `-f` flag,
it will write this to a logfile. Additionally, it can generate an HTML
website (by default `index.html`) that is openable with a browser to see the system stats visually.

## Configuration

You can configure SystemViewer in `conf.json`. For example, you can toggle or customize the HTML website generation:

```json
    "website": {
        "enabled": true,
        "filename": "index.html",
        "template": "base.html"
    }
```

## Test email ability

You can test the email ability without entering your real password first. You will need these
settings for the email and CPU in `conf.json`:

```json
    "email": {
        "enabled": true,
        "receiver_email": "admin@example.com",
        "smtp_server": "127.0.0.1",
        "smtp_port": 1025,
        "smtp_user": "",
        "smtp_password": "",
        "use_tls": false,
        "send_on_warning": true,
        "send_on_critical": true
    },
```

```json
    "thresholds": {
        "cpu": {
            "warning": 0.0,
            "critical": 0.0
        },
```

1. Open 2 terminals
2. Terminal 1: Run `mock_smtp.py`
3. Terminal 2: Run `test.py`

You should now see a "critical" alert on CPU usage in terminal 1.

## AI usage

[Prompts file](prompts.md)

* The code was made by AI for the most part
* The structure and ideas behind the code (e.g. TableFormatter) are not AI
* All docs are not AI
* `mock_smtp.py` was made entirely by AI
* All features were tested without AI
