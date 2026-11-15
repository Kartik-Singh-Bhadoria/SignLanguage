"""Authentication request and response schemas."""

import re
from typing import Optional
from pydantic import BaseModel, field_validator

EMAIL_REGEX = r"^[\w\.-]+@[\w\.-]+\.\w+$"


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    email: str
    full_name: str


class TokenPayload(BaseModel):
    sub: str
    user_id: int
    exp: int


class LoginRequest(BaseModel):
    email: str
    password: str

    @field_validator("email")
    @classmethod
    def validate_email_format(cls, v: str) -> str:
        clean = v.strip().lower()
        if not re.match(EMAIL_REGEX, clean):
            raise ValueError("Invalid email format")
        return clean
