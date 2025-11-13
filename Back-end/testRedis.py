from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, get_jwt
from datetime import timedelta, datetime
import redis, json, uuid

# -------------------- ИНИЦИАЛИЗАЦИЯ --------------------
app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = "super-secret-key"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=24)
jwt = JWTManager(app)

# Redis подключение
r = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)

# "База" пользователей
USERS = {
    "user@example.com": {"id": 1, "name": "Иван Петров", "password": "password123"}
}

# -------------------- АУТЕНТИФИКАЦИЯ --------------------
@app.route("/auth/token", methods=["POST"])
def login():
    email = request.json.get("email")
    password = request.json.get("password")

    user = USERS.get(email)
    if not user or user["password"] != password:
        return jsonify({"error": "Invalid credentials"}), 401

    # Создаём токен: identity должен быть строкой!
    token = create_access_token(identity=str(user["id"]))

    # Получаем jti напрямую из токена
    from flask_jwt_extended.utils import decode_token
    decoded = decode_token(token)
    jti = decoded["jti"]

    # Сохраняем токен в Redis с TTL 24 часа
    r.setex(f"user:{user['id']}:jwt:{jti}", 86400, token)

    # Кэшируем сессию пользователя на 1 час
    session_data = {
        "name": user["name"],
        "email": email,
        "login_time": str(datetime.now())
    }
    r.setex(f"session:{user['id']}", 3600, json.dumps(session_data))

    return jsonify({"access_token": token, "user": user})



# -------------------- ДИАГНОСТИКА --------------------
# @app.route("/assessment/submit", methods=["POST"])
# @jwt_required()
# def submit_assessment():
#     user_id = get_jwt_identity()
#     data = request.json.get("answers")
#
#     # Простейший расчёт результата (вместо MBI)
#     score = sum(data.values())
#     level = "low" if score < 50 else "medium" if score < 70 else "high"
#
#     diagnosis = {
#         "user_id": user_id,
#         "timestamp": datetime.now().isoformat(),
#         "score": score,
#         "level": level
#     }
#
#     # Сохраняем последнюю диагностику в Redis
#     r.set(f"last_diagnosis:{user_id}", json.dumps(diagnosis))
#
#     # Формируем рекомендацию по уровню
#     recommendation = generate_recommendation(level)
#     r.set(f"recommendation:{user_id}", json.dumps(recommendation))
#
#     return jsonify({"diagnosis": diagnosis, "recommendation": recommendation})
#
#
# # -------------------- ПОСЛЕДНЯЯ ДИАГНОСТИКА --------------------
# @app.route("/assessment/last", methods=["GET"])
# @jwt_required()
# def last_assessment():
#     user_id = get_jwt_identity()
#     data = r.get(f"last_diagnosis:{user_id}")
#     if not data:
#         return jsonify({"message": "Нет данных диагностики"}), 404
#     return jsonify(json.loads(data))
#
#
# -------------------- РЕКОМЕНДАЦИЯ НА ПОСЛЕДНЮЮ ДИАГНОСТИКУ --------------------
@app.route("/recommendations/last", methods=["GET"])
@jwt_required()
def last_recommendation():
    user_id = get_jwt_identity()
    data = r.get(f"recommendation:{user_id}")
    if not data:
        return jsonify({"message": "Рекомендации отсутствуют"}), 404
    return jsonify(json.loads(data))


# -------------------- СПИСОК JWT ЗА 24 ЧАСА --------------------
@app.route("/auth/active-tokens", methods=["GET"])
@jwt_required()
def get_active_tokens():
    user_id = get_jwt_identity()
    keys = r.keys(f"user:{user_id}:jwt:*")
    tokens = [r.get(k) for k in keys]
    return jsonify({"user_id": user_id, "tokens_last_24h": tokens, "total": len(tokens)})


# -------------------- СЕССИЯ --------------------
@app.route("/session", methods=["GET"])
@jwt_required()
def get_session():
    user_id = get_jwt_identity()
    session = r.get(f"session:{user_id}")
    if session:
        return jsonify(json.loads(session))
    return jsonify({"message": "Сессия не найдена"}), 404


# -------------------- УТИЛИТЫ --------------------
def generate_recommendation(level: str):
    recs = {
        "low": "Продолжай соблюдать баланс между работой и отдыхом.",
        "medium": "Рекомендуем добавить ежедневные короткие перерывы и медитацию.",
        "high": "Пора отдохнуть. Обратись к HR или психологу, чтобы обсудить стресс-нагрузку."
    }
    return {"level": level, "advice": recs[level], "created_at": datetime.now().isoformat()}


# -------------------- ЗАПУСК --------------------
if __name__ == "__main__":
    app.run(port=8000, debug=True)
