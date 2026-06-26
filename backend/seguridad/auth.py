import hashlib
import hmac
import secrets

ITERACIONES = 600_000


def crear_hash_password(password: str) -> str:
    salt = secrets.token_hex(16)

    hash_password = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt.encode("utf-8"),
        ITERACIONES
    ).hex()

    return f"pbkdf2_sha256${ITERACIONES}${salt}${hash_password}"


def verificar_password(password_plano: str, password_hash: str) -> bool:
    try:
        algoritmo, iteraciones, salt, hash_guardado = password_hash.split("$")

        if algoritmo != "pbkdf2_sha256":
            return False

        hash_calculado = hashlib.pbkdf2_hmac(
            "sha256",
            password_plano.encode("utf-8"),
            salt.encode("utf-8"),
            int(iteraciones)
        ).hex()

        return hmac.compare_digest(hash_calculado, hash_guardado)

    except ValueError:
        return False
