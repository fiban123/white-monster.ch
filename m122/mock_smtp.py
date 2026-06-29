#!/usr/bin/env python

import socket
import threading
import sys


def handle_client(conn, addr):
    print(f"\n[*] New SMTP connection from {addr[0]}:{addr[1]}")
    conn.send(b"220 localhost Mock SMTP Server Ready\r\n")

    in_data_mode = False
    mail_lines = []

    try:
        while True:
            data = conn.recv(4096)
            if not data:
                break

            # SMTP commands are line-based
            lines = data.split(b"\r\n")
            for line in lines:
                if not line and not in_data_mode:
                    continue

                if in_data_mode:
                    if line == b".":
                        in_data_mode = False
                        print("\n--- RECEIVED EMAIL BODY ---")
                        print("\n".join(mail_lines))
                        print("---------------------------\n")
                        mail_lines = []
                        conn.send(
                            b"250 2.0.0 OK: Message accepted for delivery\r\n")
                    else:
                        mail_lines.append(line.decode(
                            'utf-8', errors='ignore'))
                else:
                    cmd_upper = line.upper()
                    if cmd_upper.startswith(b"EHLO") or cmd_upper.startswith(b"HELO"):
                        conn.send(
                            b"250-localhost Hello\r\n250-8BITMIME\r\n250 SIZE 10485760\r\n")
                    elif cmd_upper.startswith(b"MAIL FROM:"):
                        sender = line[10:].decode(
                            'utf-8', errors='ignore').strip()
                        print(f" -> Sender: {sender}")
                        conn.send(b"250 2.1.0 OK\r\n")
                    elif cmd_upper.startswith(b"RCPT TO:"):
                        recipient = line[8:].decode(
                            'utf-8', errors='ignore').strip()
                        print(f" -> Recipient: {recipient}")
                        conn.send(b"250 2.1.5 OK\r\n")
                    elif cmd_upper.startswith(b"DATA"):
                        in_data_mode = True
                        conn.send(
                            b"354 Start mail input; end with <CR><LF>.<CR><LF>\r\n")
                    elif cmd_upper.startswith(b"QUIT"):
                        conn.send(
                            b"221 2.0.0 localhost closing connection\r\n")
                        return
                    elif cmd_upper.startswith(b"RSET"):
                        mail_lines = []
                        in_data_mode = False
                        conn.send(b"250 2.0.0 OK\r\n")
                    elif cmd_upper.startswith(b"NOOP"):
                        conn.send(b"250 2.0.0 OK\r\n")
                    else:
                        conn.send(b"250 OK\r\n")
    except Exception as e:
        print(f"Error handling connection: {e}")
    finally:
        conn.close()


def main():
    host = "127.0.0.1"
    port = 1025

    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)

    try:
        server.bind((host, port))
    except Exception as e:
        print(f"Error: Could not bind to {host}:{port} - {e}")
        sys.exit(1)

    server.listen(5)
    print(f"=== Mock SMTP Server running on {host}:{port} ===")
    print("[*] Waiting for incoming emails... (Press Ctrl+C to stop)")

    try:
        while True:
            conn, addr = server.accept()
            t = threading.Thread(target=handle_client, args=(conn, addr))
            t.daemon = True
            t.start()
    except KeyboardInterrupt:
        print("\n[*] Stopping server...")
    finally:
        server.close()


if __name__ == "__main__":
    main()
