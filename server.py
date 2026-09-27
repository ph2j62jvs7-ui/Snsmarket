import os, uuid, requests
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["https://spiffy-lolly-e2598b.netlify.app"])

SHOP_ID = os.environ.get("YOOKASSA_SHOP_ID")
SECRET_KEY = os.environ.get("YOOKASSA_SECRET_KEY")

PRODUCTS = {
    "Claude Pro 1 месяц": "2200.00",
}

@app.get("/")
def home():
    return "SNSMARKET payment server is running", 200

@app.post("/create-payment")
def create_payment():
    data = request.get_json(silent=True) or {}
    product = data.get("product")
    email = data.get("email")

    if product not in PRODUCTS:
        return jsonify({"error": "Неизвестный товар"}), 400
    if not email:
        return jsonify({"error": "Не указан email"}), 400
    if not SHOP_ID or not SECRET_KEY:
        return jsonify({"error": "YooKassa credentials are not configured"}), 500

    payload = {
        "amount": {"value": PRODUCTS[product], "currency": "RUB"},
        "capture": True,
        "confirmation": {
            "type": "redirect",
            "return_url": "https://spiffy-lolly-e2598b.netlify.app/"
        },
        "description": product,
        "metadata": {"product": product, "email": email}
    }

    r = requests.post(
        "https://api.yookassa.ru/v3/payments",
        json=payload,
        auth=(SHOP_ID, SECRET_KEY),
        headers={
            "Idempotence-Key": str(uuid.uuid4()),
            "Content-Type": "application/json"
        },
        timeout=20
    )

    try:
        result = r.json()
    except ValueError:
        result = {"message": r.text}

    if r.status_code not in (200, 201):
        return jsonify({
            "error": "Ошибка YooKassa",
            "details": result
        }), r.status_code

    return jsonify({
        "payment_id": result.get("id"),
        "confirmation_url": result.get("confirmation", {}).get("confirmation_url")
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
