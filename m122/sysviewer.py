try:
    import os
    import platform
    import socket
    import sys
    import json
    import smtplib
    from datetime import datetime
    from email.mime.text import MIMEText
    from email.mime.multipart import MIMEMultipart
    import psutil

except (ImportError):
    print("You have some missing imports. You need the following python modules: os, platform, socket, sys, json, smtplib, email, psutil")
    exit(1)


class TableFormatter:
    def __init__(self):
        self.table = []
        self.rows = 0
        self.cols = 0
        self.title = None

    def setSize(self, rows: int, cols: int) -> None:
        self.rows = rows
        self.cols = cols
        self.table = [["" for _ in range(cols)] for _ in range(rows)]

    def setTitle(self, title: str) -> None:
        self.title = title

    def set(self, row: int, col: int, value) -> None:
        if 0 <= row < self.rows and 0 <= col < self.cols:
            self.table[row][col] = str(value)
        else:
            raise IndexError("Row or column index out of bounds.")

    def writeToFile(self, target_stream) -> None:
        if self.rows == 0 or self.cols == 0:
            return

        col_widths = [
            max((len(self.table[r][c]) for r in range(self.rows)), default=0)
            for c in range(self.cols)
        ]

        total_width = sum(col_widths) + (3 * (self.cols - 1)) + 4

        if self.title:
            print("=" * total_width, file=target_stream)
            print(self.title, file=target_stream)
            print("=" * total_width, file=target_stream)

        for r in range(self.rows):
            formatted_cells = [
                f"{self.table[r][c]:<{col_widths[c]}}" for c in range(self.cols)
            ]
            row_str = " | ".join(formatted_cells)
            print(f"| {row_str} |", file=target_stream)

        if self.title:
            print("=" * total_width, file=target_stream)


class SystemInfo:
    def __init__(self):
        self.config = self.load_config()
        self.thresholds = self.config.get("thresholds", {})
        self.email_config = self.config.get("email", {})
        self.ftp_config = self.config.get("ftp", {})
        self.website_config = self.config.get("website", {})
        self.email_sent = "Not checked"

    def load_config(self) -> dict:
        config_path = "conf.json"
        default_config = {
            "email": {
                "enabled": False,
                "receiver_email": "admin@example.com",
                "smtp_server": "smtp.example.com",
                "smtp_port": 587,
                "smtp_user": "username@example.com",
                "smtp_password": "password123",
                "use_tls": True,
                "send_on_warning": True,
                "send_on_critical": True
            },
            "thresholds": {
                "cpu": {
                    "warning": 70.0,
                    "critical": 90.0
                },
                "ram": {
                    "warning": 80.0,
                    "critical": 90.0
                },
                "disk": {
                    "warning": 80.0,
                    "critical": 90.0
                }
            },
            "ftp": {
                "enabled": False,
                "server": "ftp.example.com",
                "port": 21,
                "user": "ftp_username",
                "password": "ftp_password",
                "remote_path": "/"
            },
            "website": {
                "enabled": True,
                "filename": "index.html",
                "template": "base.html"
            }
        }
        if os.path.exists(config_path):
            try:
                with open(config_path, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception as e:
                print(f"Warning: Could not parse {
                      config_path}. Using default configuration. Error: {e}", file=sys.stderr)
                return default_config
        else:
            try:
                with open(config_path, "w", encoding="utf-8") as f:
                    json.dump(default_config, f, indent=2)
            except Exception as e:
                print(f"Warning: Could not create default {
                      config_path}. Error: {e}", file=sys.stderr)
            return default_config

    def evaluate_status(self, value: float, metric: str) -> str:
        limits = self.thresholds.get(metric, {})
        warning = limits.get("warning", 80.0)
        critical = limits.get("critical", 90.0)
        if value >= critical:
            return "critical"
        elif value >= warning:
            return "warning"
        return "ok"

    def fetch(self) -> None:
        boot_time_timestamp = psutil.boot_time()
        boot_time = datetime.fromtimestamp(boot_time_timestamp)
        self.uptime = datetime.now() - boot_time

        days = self.uptime.days
        hours, remainder = divmod(self.uptime.seconds, 3600)
        minutes, _ = divmod(remainder, 60)
        self.uptime_str = f"{days} days, {hours} hours, {minutes} minutes"

        self.system_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        disk = psutil.disk_usage("/")
        self.disk_free_gb = round(disk.free / (1024**3), 2)
        self.disk_used_gb = round(disk.used / (1024**3), 2)
        self.disk_usage_percent = disk.percent

        self.hostname = socket.gethostname()
        try:
            self.ip_address = socket.gethostbyname(self.hostname)
        except socket.gaierror:
            self.ip_address = "N/A"

        self.os_name = platform.system()
        self.os_version = platform.release()

        self.cpu_model = platform.processor() or "N/A"
        self.cpu_cores_physical = psutil.cpu_count(logical=False)
        self.cpu_cores_logical = psutil.cpu_count(logical=True)
        self.cpu_usage_percent = psutil.cpu_percent(interval=0.5)

        memory = psutil.virtual_memory()
        self.ram_total_gb = round(memory.total / (1024**3), 2)
        self.ram_used_gb = round(memory.used / (1024**3), 2)
        self.ram_usage_percent = memory.percent

        # Evaluate statuses
        self.cpu_status = self.evaluate_status(
            self.cpu_usage_percent, "cpu")
        self.ram_status = self.evaluate_status(
            self.ram_usage_percent, "ram")
        self.disk_status = self.evaluate_status(
            self.disk_usage_percent, "disk")

        # Global status
        statuses = [self.cpu_status, self.ram_status, self.disk_status]
        if "critical" in statuses:
            self.global_status = "critical"
        elif "warning" in statuses:
            self.global_status = "warning"
        else:
            self.global_status = "ok"

    def check_and_send_alerts(self) -> None:
        if not self.email_config.get("enabled", False):
            self.email_sent = "Disabled"
            return

        # Prepare alert details
        alerts = []
        if self.cpu_status in ["warning", "critical"]:
            alerts.append(f"CPU: {self.cpu_usage_percent:.1f}% (Warn: {
                          self.thresholds['cpu']['warning']}%, Crit: {self.thresholds['cpu']['critical']}%)")
        if self.ram_status in ["warning", "critical"]:
            alerts.append(f"RAM: {self.ram_usage_percent:.1f}% (Warn: {
                          self.thresholds['ram']['warning']}%, Crit: {self.thresholds['ram']['critical']}%)")
        if self.disk_status in ["warning", "critical"]:
            alerts.append(f"Disk: {self.disk_usage_percent:.1f}% (Warn: {
                          self.thresholds['disk']['warning']}%, Crit: {self.thresholds['disk']['critical']}%)")

        # Load last state to prevent email spamming
        state_file = ".alert_state.json"
        last_state = {}
        if os.path.exists(state_file):
            try:
                with open(state_file, "r", encoding="utf-8") as f:
                    last_state = json.load(f)
            except Exception:
                pass

        last_global_status = last_state.get("global_status", "ok")

        # Determine if we should send an email
        should_send = False
        subject_prefix = ""

        if self.global_status != last_global_status:
            # State changed!
            if self.global_status in ["warning", "critical"]:
                # State went to warning/critical
                should_send = True
                subject_prefix = f"[{self.global_status.upper()} ALERT]"
            elif self.global_status == "ok" and last_global_status in ["warning", "critical"]:
                # State recovered to OK!
                should_send = True
                subject_prefix = "[RESOLVED]"

        if not should_send:
            self.email_sent = "No change (Skipped)"
            return

        # Build email message
        receiver = self.email_config.get("receiver_email", "admin@example.com")
        sender = self.email_config.get(
            "sender_email", "monitoring@example.com")
        subject = f"{subject_prefix} System Monitoring Alert - {self.hostname}"

        body = f"System Time: {self.system_time}\n"
        body += f"Hostname: {self.hostname}\n"
        body += f"IP Address: {self.ip_address}\n"
        body += f"Status: {self.global_status.upper()}\n\n"

        if self.global_status == "ok":
            body += "All system metrics are back to normal.\n\n"
        else:
            body += "The following thresholds were exceeded:\n"
            for alert in alerts:
                body += f"- {alert}\n"
            body += "\n"

        body += "Current system metrics:\n"
        body += f"- CPU Usage: {self.cpu_usage_percent:.1f}%\n"
        body += f"- RAM Usage: {self.ram_usage_percent:.1f}% ({self.ram_used_gb:.2f} GB / {
            self.ram_total_gb:.2f} GB)\n"
        body += f"- Disk Usage: {
            self.disk_usage_percent:.1f}% ({self.disk_used_gb:.2f} GB used)\n\n"
        body += f"Details can be found in the HTML dashboard in the current directory."

        msg = MIMEMultipart()
        msg["From"] = sender
        msg["To"] = receiver
        msg["Subject"] = subject
        msg.attach(MIMEText(body, "plain", "utf-8"))

        try:
            server_host = self.email_config.get(
                "smtp_server", "smtp.example.com")
            server_port = self.email_config.get("smtp_port", 587)
            user = self.email_config.get("smtp_user", "")
            password = self.email_config.get("smtp_password", "")
            use_tls = self.email_config.get("use_tls", True)

            if use_tls:
                server = smtplib.SMTP(server_host, server_port, timeout=10)
                server.starttls()
            elif server_port == 465:
                server = smtplib.SMTP_SSL(server_host, server_port, timeout=10)
            else:
                server = smtplib.SMTP(server_host, server_port, timeout=10)

            if user and password:
                server.login(user, password)

            server.sendmail(sender, [receiver], msg.as_string())
            server.quit()
            print(f" -> Email successfully sent to {receiver}")
            self.email_sent = f"Sent to {receiver}"

            # Save state
            with open(state_file, "w", encoding="utf-8") as f:
                json.dump({"global_status": self.global_status,
                          "last_sent": self.system_time}, f, indent=2)

        except Exception as e:
            print(f" -> Failed to send alert email: {e}", file=sys.stderr)
            self.email_sent = f"Failed: {e}"

    def generate_index_html(self) -> None:
        if not self.website_config.get("enabled", True):
            return

        template_path = self.website_config.get("template", "base.html")
        filename = self.website_config.get("filename", "index.html")

        def get_ampel_states(status):
            if status == "critical":
                return "active", "", ""
            elif status == "warning":
                return "", "active", ""
            else:
                return "", "", "active"

        cpu_ampel_red, cpu_ampel_yellow, cpu_ampel_green = get_ampel_states(
            self.cpu_status)
        ram_ampel_red, ram_ampel_yellow, ram_ampel_green = get_ampel_states(
            self.ram_status)
        disk_ampel_red, disk_ampel_yellow, disk_ampel_green = get_ampel_states(
            self.disk_status)

        global_status_texts = {
            "ok": "Normal (Green)",
            "warning": "Warning (Yellow)",
            "critical": "Critical (Red)"
        }
        global_status_text = global_status_texts.get(
            self.global_status, "Unknown")

        if not os.path.exists(template_path):
            print(f" -> Error: Template file '{template_path}' not found. Cannot generate {filename}.", file=sys.stderr)
            return

        try:
            with open(template_path, "r", encoding="utf-8") as f:
                content = f.read()
        except Exception as e:
            print(f" -> Error reading '{template_path}': {e}", file=sys.stderr)
            return

        replacements = {
            "{{hostname}}": self.hostname,
            "{{system_time}}": self.system_time,
            "{{global_status_class}}": self.global_status,
            "{{global_status_text}}": global_status_text,
            "{{cpu_usage}}": f"{self.cpu_usage_percent:.1f}",
            "{{cpu_status}}": self.cpu_status,
            "{{cpu_model}}": self.cpu_model,
            "{{cpu_cores}}": f"{self.cpu_cores_physical} physical / {self.cpu_cores_logical} logical",
            "{{cpu_ampel_red}}": cpu_ampel_red,
            "{{cpu_ampel_yellow}}": cpu_ampel_yellow,
            "{{cpu_ampel_green}}": cpu_ampel_green,
            "{{ram_usage}}": f"{self.ram_usage_percent:.1f}",
            "{{ram_status}}": self.ram_status,
            "{{ram_used}}": f"{self.ram_used_gb:.2f}",
            "{{ram_total}}": f"{self.ram_total_gb:.2f}",
            "{{ram_ampel_red}}": ram_ampel_red,
            "{{ram_ampel_yellow}}": ram_ampel_yellow,
            "{{ram_ampel_green}}": ram_ampel_green,
            "{{disk_usage}}": f"{self.disk_usage_percent:.1f}",
            "{{disk_status}}": self.disk_status,
            "{{disk_used}}": f"{self.disk_used_gb:.2f}",
            "{{disk_free}}": f"{self.disk_free_gb:.2f}",
            "{{disk_ampel_red}}": disk_ampel_red,
            "{{disk_ampel_yellow}}": disk_ampel_yellow,
            "{{disk_ampel_green}}": disk_ampel_green,
            "{{os_name}}": self.os_name,
            "{{os_version}}": self.os_version,
            "{{uptime}}": self.uptime_str,
            "{{ip_address}}": self.ip_address
        }

        for placeholder, value in replacements.items():
            content = content.replace(placeholder, str(value))

        try:
            with open(filename, "w", encoding="utf-8") as f:
                f.write(content)
            print(f" -> {filename} successfully generated in the current path.")
        except Exception as e:
            print(f" -> Failed to generate {filename}: {e}", file=sys.stderr)

    def writeToStream(self, target_stream) -> None:
        table = TableFormatter()
        table.setSize(12, 2)
        table.setTitle("System Information")

        table.set(0, 0, "System time")
        table.set(0, 1, self.system_time)

        table.set(1, 0, "Uptime")
        table.set(1, 1, self.uptime_str)

        table.set(2, 0, "OS")
        table.set(2, 1, f"{self.os_name} (Version: {self.os_version})")

        table.set(3, 0, "Hostname")
        table.set(3, 1, self.hostname)

        table.set(4, 0, "IP Address")
        table.set(4, 1, self.ip_address)

        table.set(5, 0, "CPU Model")
        table.set(5, 1, self.cpu_model)

        table.set(6, 0, "CPU Cores")
        table.set(
            6, 1, f"{self.cpu_cores_physical} physical / {self.cpu_cores_logical} logical")

        table.set(7, 0, "CPU Usage")
        table.set(7, 1, f"{self.cpu_usage_percent:.1f}% ({
                  self.cpu_status.upper()})")

        table.set(8, 0, "RAM")
        table.set(8, 1, f"Total: {self.ram_total_gb} GB | Used: {self.ram_used_gb} GB ({
                  self.ram_usage_percent:.1f}% - {self.ram_status.upper()})")

        table.set(9, 0, "Storage")
        table.set(9, 1, f"Free: {self.disk_free_gb} GB | Used: {self.disk_used_gb} GB ({
                  self.disk_usage_percent:.1f}% - {self.disk_status.upper()})")

        table.set(10, 0, "Global Status")
        table.set(10, 1, self.global_status.upper())

        table.set(11, 0, "Alert Email Sent")
        table.set(11, 1, str(self.email_sent))

        table.writeToFile(target_stream)

        print("", file=target_stream)


info = SystemInfo()
info.fetch()
info.check_and_send_alerts()
info.generate_index_html()

info.writeToStream(sys.stdout)

if "-f" in sys.argv:
    year_month = datetime.now().strftime("%Y-%m")
    filename = f"{year_month}-sys-{info.hostname}.log"

    try:
        with open(filename, "a", encoding="utf-8") as file:
            info.writeToStream(file)
        print(f"\n -> Appended to file: {filename}")
    except IOError as e:
        print(
            f"\n -> Failed to write to logfile: {e}",
            file=sys.stderr,
        )

    a = [1, 2, 3.7, "noe"]
    for i, j in enumerate(a):
        print(i, j)
