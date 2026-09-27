import os
import uuid

import requests
from flask import Flask, request, jsonify

app = Flask(__name__)

SHOP_ID = os.environ.get("YOOKASSA_SHOP_ID")
SECRET_KEY = os.environ.get("YOOKASSA_SECRET_KEY")

PRODUCTS = {
    "Claude Pro 1 месяц": "2400.00",
}

@app.route("/", methods=["GET"])
def home():
    return "SNSMARKET payment server is running", 200


@app.route("/create-payment", methods=["POST"])
def create_payment():
    data = request.get_json(silent=True) or {}

    product = data.get("product")
    email = data.get("email")

    if not product or product not in PRODUCTS:
        return jsonify({"error": "Неизвестный товар"}), 400

    if not email:
        return jsonify({"error": "Не указан email"}), 400

    if not SHOP_ID or not SECRET_KEY:
        return jsonify({"error": "YooKassa credentials are not configured"}), 500

    payment_data = {
        "amount": {
            "value": PRODUCTS[product],
            "currency": "RUB"
        },
        "capture": True,
        "confirmation": {
            "type": "redirect",
            "return_url": "https://snsmarket.netlify.app/"
        },
        "description": product,
        "metadata": {
            "product": product,
            "email": email
        }
    }

    response = requests.post(
        "https://api.yookassa.ru/v3/payments",
        json=payment_data,
        auth=(SHOP_ID, SECRET_KEY),
        headers={
            "Idempotence-Key": str(uuid.uuid4()),
            "Content-Type": "application/json"
        },
        timeout=20
    )

    result = response.json()

    if response.status_code not in (200, 201):
        return jsonify({
            "error": "Ошибка YooKassa",
            "details": result
        }), response.status_code

    return jsonify({
        "payment_id": result.get("id"),
        "confirmation_url": result.get("confirmation", {}).get("confirmation_url")
    })


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=port)
