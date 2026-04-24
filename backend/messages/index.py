"""API для сохранения и получения сообщений чата по каналам."""
import json
import os
import psycopg2


CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    method = event.get("httpMethod", "GET")

    if method == "GET":
        from urllib.parse import unquote
        raw = (event.get("queryStringParameters") or {}).get("channel", "%D0%BE%D0%B1%D1%89%D0%B8%D0%B9")
        channel = unquote(raw)
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            """
            SELECT id, channel, user_name, avatar, color, text, created_at
            FROM messages
            WHERE channel = %s
            ORDER BY created_at DESC
            LIMIT 50
            """,
            (channel,),
        )
        rows = cur.fetchall()
        cur.close()
        conn.close()

        messages = [
            {
                "id": r[0],
                "channel": r[1],
                "user": r[2],
                "avatar": r[3],
                "color": r[4],
                "text": r[5],
                "time": r[6].strftime("%H:%M") if r[6] else "",
            }
            for r in reversed(rows)
        ]
        return {
            "statusCode": 200,
            "headers": {**CORS_HEADERS, "Content-Type": "application/json"},
            "body": json.dumps(messages, ensure_ascii=False),
        }

    if method == "POST":
        body = json.loads(event.get("body") or "{}")
        channel = body.get("channel", "общий")
        user_name = (body.get("user") or "").strip()[:50]
        avatar = (body.get("avatar") or "?").strip()[:5]
        color = (body.get("color") or "from-[#5865f2] to-[#7c3aed]").strip()[:80]
        text = (body.get("text") or "").strip()[:2000]

        if not user_name or not text:
            return {
                "statusCode": 400,
                "headers": {**CORS_HEADERS, "Content-Type": "application/json"},
                "body": json.dumps({"error": "user and text are required"}),
            }

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            """
            INSERT INTO messages (channel, user_name, avatar, color, text)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id, created_at
            """,
            (channel, user_name, avatar, color, text),
        )
        row = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()

        return {
            "statusCode": 200,
            "headers": {**CORS_HEADERS, "Content-Type": "application/json"},
            "body": json.dumps({
                "id": row[0],
                "channel": channel,
                "user": user_name,
                "avatar": avatar,
                "color": color,
                "text": text,
                "time": row[1].strftime("%H:%M") if row[1] else "",
            }, ensure_ascii=False),
        }

    return {"statusCode": 405, "headers": CORS_HEADERS, "body": "Method not allowed"}