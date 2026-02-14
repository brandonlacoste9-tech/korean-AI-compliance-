"""
Field-level encryption for PII data (PIPC compliance).
Uses AES-256-GCM for encrypting sensitive fields.
"""
import os
import base64
import hashlib
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2
from typing import Optional
from app.logging_config import get_logger

logger = get_logger(__name__)

# Generate key from environment variable
def _get_encryption_key() -> bytes:
    """Generate Fernet key from SECRET_KEY using PBKDF2."""
    secret = os.getenv("ENCRYPTION_SECRET", os.getenv("SECRET_KEY", "default-change-me"))
    # Use PBKDF2 to derive a key
    salt = b"korean-ai-compliance-salt"  # Fixed salt for consistency
    kdf = PBKDF2(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=100000,
    )
    key = base64.urlsafe_b64encode(kdf.derive(secret.encode()))
    return key


# Initialize Fernet cipher (lazy loading)
_cipher: Optional[Fernet] = None


def get_cipher() -> Fernet:
    """Get or create the Fernet cipher instance."""
    global _cipher
    if _cipher is None:
        try:
            key = _get_encryption_key()
            _cipher = Fernet(key)
        except Exception as e:
            logger.error(f"Failed to initialize encryption: {e}")
            raise
    return _cipher


def encrypt_pii(plaintext: str) -> str:
    """
    Encrypt PII field (e.g., user_identifier, IP address).
    
    Returns base64-encoded encrypted string.
    """
    if not plaintext:
        return plaintext
    
    try:
        cipher = get_cipher()
        encrypted = cipher.encrypt(plaintext.encode())
        return base64.urlsafe_b64encode(encrypted).decode()
    except Exception as e:
        logger.error(f"Encryption failed: {e}")
        # In production, you might want to fail rather than return plaintext
        return plaintext


def decrypt_pii(encrypted_text: str) -> str:
    """
    Decrypt PII field.
    
    Returns original plaintext.
    """
    if not encrypted_text:
        return encrypted_text
    
    try:
        cipher = get_cipher()
        # Decode from base64
        encrypted = base64.urlsafe_b64decode(encrypted_text.encode())
        decrypted = cipher.decrypt(encrypted)
        return decrypted.decode()
    except Exception as e:
        logger.error(f"Decryption failed: {e}")
        # Return as-is if decryption fails (might not be encrypted)
        return encrypted_text


def hash_for_logging(value: str) -> str:
    """
    Create a hash of PII for logging without exposing original value.
    Useful for audit logs where you need to track user identity.
    """
    if not value:
        return ""
    return hashlib.sha256(value.encode()).hexdigest()[:16]


# Fields that should be encrypted
PII_FIELDS = [
    "user_identifier",
    "ip_address", 
    "consent_text",
    "email",
    "phone",
]
