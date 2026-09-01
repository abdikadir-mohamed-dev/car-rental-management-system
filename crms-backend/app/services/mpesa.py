import base64
import requests
from datetime import datetime
from flask import current_app


def get_mpesa_base_url():
    """
    Return the correct Safaricom Daraja URL
    depending on the configured environment.
    """

    environment = current_app.config.get(
        'MPESA_ENVIRONMENT',
        'sandbox'
    )

    if environment == 'production':
        return 'https://api.safaricom.co.ke'

    return 'https://sandbox.safaricom.co.ke'


def get_access_token():
    """
    Get an OAuth access token from Safaricom Daraja.
    """

    consumer_key = current_app.config.get(
        'MPESA_CONSUMER_KEY'
    )

    consumer_secret = current_app.config.get(
        'MPESA_CONSUMER_SECRET'
    )

    if not consumer_key or not consumer_secret:
        raise ValueError(
            'M-Pesa consumer credentials are not configured'
        )

    url = (
        f'{get_mpesa_base_url()}'
        '/oauth/v1/generate'
        '?grant_type=client_credentials'
    )

    response = requests.get(
        url,
        auth=(consumer_key, consumer_secret),
        timeout=30
    )

    if not response.ok:
        raise ValueError(
            f'M-Pesa OAuth error '
            f'{response.status_code}: '
            f'{response.text}'
        )

    data = response.json()

    access_token = data.get('access_token')

    if not access_token:
        raise ValueError(
            'M-Pesa access token was not returned'
        )

    return access_token


def generate_password(timestamp):
    """
    Generate the password required by the
    M-Pesa STK Push API.

    Password = Base64(
        BusinessShortCode + Passkey + Timestamp
    )
    """

    shortcode = current_app.config.get(
        'MPESA_SHORTCODE'
    )

    passkey = current_app.config.get(
        'MPESA_PASSKEY'
    )

    if not shortcode:
        raise ValueError(
            'M-Pesa shortcode is not configured'
        )

    if not passkey:
        raise ValueError(
            'M-Pesa passkey is not configured'
        )

    password_string = (
        f'{shortcode}'
        f'{passkey}'
        f'{timestamp}'
    )

    return base64.b64encode(
        password_string.encode('utf-8')
    ).decode('utf-8')


def normalize_phone_number(phone_number):
    """
    Convert Kenyan phone numbers into the format
    required by Safaricom:

        0712345678 -> 254712345678
        0112345678 -> 254112345678
        +254712345678 -> 254712345678
        254712345678 -> 254712345678
    """

    if not phone_number:
        raise ValueError(
            'M-Pesa phone number is required'
        )

    phone = str(phone_number).strip()

    # Remove spaces and common separators
    phone = (
        phone
        .replace(' ', '')
        .replace('-', '')
        .replace('(', '')
        .replace(')', '')
    )

    # +254712345678
    if phone.startswith('+254'):
        phone = phone[1:]

    # 0712345678 / 0112345678
    elif phone.startswith('0'):
        phone = '254' + phone[1:]

    # Already 254...
    elif phone.startswith('254'):
        pass

    else:
        raise ValueError(
            'Invalid Kenyan phone number. '
            'Use a number such as 0712345678'
        )

    # Kenyan mobile numbers should have 12 digits
    if len(phone) != 12 or not phone.isdigit():
        raise ValueError(
            'Invalid M-Pesa phone number. '
            'Use a Kenyan number such as 0712345678'
        )

    # Kenyan mobile numbers normally start with 2547/2541
    if not (
        phone.startswith('2547')
        or phone.startswith('2541')
    ):
        raise ValueError(
            'Invalid Kenyan M-Pesa phone number'
        )

    return phone


def initiate_stk_push(
    phone_number,
    amount,
    account_reference,
    transaction_description
):
    """
    Initiate an M-Pesa STK Push.

    The customer phone number is normalized into
    254XXXXXXXXX format before being sent to Safaricom.
    """

    # -----------------------------------------
    # Get access token
    # -----------------------------------------

    access_token = get_access_token()

    # -----------------------------------------
    # Get shortcode
    # -----------------------------------------

    shortcode = current_app.config.get(
        'MPESA_SHORTCODE'
    )

    if not shortcode:
        raise ValueError(
            'M-Pesa shortcode is not configured'
        )

    # -----------------------------------------
    # Normalize customer phone number
    # -----------------------------------------

    normalized_phone = normalize_phone_number(
        phone_number
    )

    # -----------------------------------------
    # Validate amount
    # -----------------------------------------

    try:
        amount = int(float(amount))
    except (TypeError, ValueError):
        raise ValueError(
            'Invalid M-Pesa payment amount'
        )

    if amount <= 0:
        raise ValueError(
            'M-Pesa payment amount must be greater than zero'
        )

    # -----------------------------------------
    # Timestamp
    # -----------------------------------------

    timestamp = datetime.now().strftime(
        '%Y%m%d%H%M%S'
    )

    # -----------------------------------------
    # Generate password
    # -----------------------------------------

    password = generate_password(timestamp)

    # -----------------------------------------
    # Callback URL
    # -----------------------------------------

    callback_url = current_app.config.get(
        'MPESA_CALLBACK_URL'
    )

    if not callback_url:
        raise ValueError(
            'MPESA_CALLBACK_URL is not configured'
        )

    # Safaricom requires a callback URL that
    # Safaricom can reach.
    if not (
        callback_url.startswith('https://')
        or callback_url.startswith('http://')
    ):
        raise ValueError(
            'MPESA_CALLBACK_URL must be a valid URL'
        )

    # -----------------------------------------
    # STK Push URL
    # -----------------------------------------

    url = (
        f'{get_mpesa_base_url()}'
        '/mpesa/stkpush/v1/processrequest'
    )

    # -----------------------------------------
    # Headers
    # -----------------------------------------

    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json',
    }

    # -----------------------------------------
    # STK Push payload
    # -----------------------------------------

    payload = {
        'BusinessShortCode': str(shortcode),
        'Password': password,
        'Timestamp': timestamp,
        'TransactionType': 'CustomerPayBillOnline',

        'Amount': amount,

        # Customer paying
        'PartyA': normalized_phone,

        # Business receiving payment
        'PartyB': str(shortcode),

        # Customer receiving STK prompt
        'PhoneNumber': normalized_phone,

        'CallBackURL': callback_url,

        'AccountReference': str(
            account_reference
        )[:12],

        'TransactionDesc': str(
            transaction_description
        )[:20],
    }

    # -----------------------------------------
    # Send request
    # -----------------------------------------

    try:
        response = requests.post(
            url,
            json=payload,
            headers=headers,
            timeout=30
        )

    except requests.RequestException as e:
        raise ValueError(
            f'Unable to connect to M-Pesa: {str(e)}'
        )

    # -----------------------------------------
    # Handle Safaricom response
    # -----------------------------------------

    if not response.ok:

        try:
            error_data = response.json()
        except ValueError:
            error_data = response.text

        raise ValueError(
            f'M-Pesa STK Push failed '
            f'({response.status_code}): '
            f'{error_data}'
        )

    try:
        return response.json()

    except ValueError:
        raise ValueError(
            'M-Pesa returned an invalid response'
        )