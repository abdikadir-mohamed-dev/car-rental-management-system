import os
import smtplib
from email.mime.text import MIMEText


def send_email(to_address, subject, body_text):
    """
    Send a plain-text email via SMTP.

    If SMTP_HOST isn't configured, the email is logged instead of
    sent. This keeps callers (e.g. the staff invite flow) working in
    local/dev environments with no real mail credentials, while still
    sending for real once SMTP_* is set in the environment.

    Returns True if the email was handed off to the SMTP server,
    False otherwise (including the "logged instead" case) -- callers
    should treat delivery as best-effort and not fail the request
    over it.
    """

    smtp_host = os.environ.get('SMTP_HOST')

    if not smtp_host:
        print(
            f'SMTP not configured (SMTP_HOST unset); logging email '
            f'instead of sending.\nTo: {to_address}\nSubject: {subject}\n\n{body_text}'
        )
        return False

    smtp_port = int(os.environ.get('SMTP_PORT', 587))
    smtp_username = os.environ.get('SMTP_USERNAME')
    smtp_password = os.environ.get('SMTP_PASSWORD')
    use_tls = os.environ.get('SMTP_USE_TLS', 'true').lower() != 'false'
    mail_from = os.environ.get('MAIL_FROM') or smtp_username or 'no-reply@drivego.com'

    message = MIMEText(body_text)
    message['Subject'] = subject
    message['From'] = mail_from
    message['To'] = to_address

    try:
        with smtplib.SMTP(smtp_host, smtp_port, timeout=10) as server:
            if use_tls:
                server.starttls()
            if smtp_username and smtp_password:
                server.login(smtp_username, smtp_password)
            server.sendmail(mail_from, [to_address], message.as_string())
        return True
    except Exception as e:
        print(f'Failed to send email to {to_address}: {e}')
        return False
