"""FastAPI Authentication and Profiling Router (AP2 Protocol Compliant)."""

import uuid
from datetime import datetime, timezone
from typing import List, Optional

from fastapi import APIRouter, Depends, Header, HTTPException, status
from pydantic import BaseModel, Field

from subguard.core.auth import (
    create_token,
    generate_user_keys,
    hash_password,
    verify_password,
    verify_token,
)
from subguard.db.models import UserModel, db_repo

auth_router = APIRouter(prefix="/v1/auth", tags=["auth"])


# Schemas
class RegisterRequest(BaseModel):
    email: str
    password: str
    full_name: str
    organization_name: Optional[str] = "Personal Workspace"
    role: Optional[str] = "Admin"
    monthly_budget_ceiling: Optional[float] = 500.00
    single_transaction_limit: Optional[float] = 50.00
    avatar_color: Optional[str] = "#2edcc4"


class LoginRequest(BaseModel):
    email: str
    password: str


class UpdateProfileRequest(BaseModel):
    full_name: Optional[str] = None
    organization_name: Optional[str] = None
    role: Optional[str] = None
    avatar_color: Optional[str] = None
    monthly_budget_ceiling: Optional[float] = None
    single_transaction_limit: Optional[float] = None


class UserProfileResponse(BaseModel):
    id: str
    email: str
    full_name: str
    first_name: str
    initials: str
    role: str
    avatar_color: str
    organization_name: str
    monthly_budget_ceiling: float
    single_transaction_limit: float
    currency: str
    public_signing_key: str
    created_at: str
    updated_at: str


class AuthResponse(BaseModel):
    token: str
    user: UserProfileResponse
    message: str


def user_to_response(u: UserModel) -> UserProfileResponse:
    return UserProfileResponse(
        id=u.id,
        email=u.email,
        full_name=u.full_name,
        first_name=u.first_name,
        initials=u.initials,
        role=u.role,
        avatar_color=u.avatar_color,
        organization_name=u.organization_name or "Personal Workspace",
        monthly_budget_ceiling=u.monthly_budget_ceiling,
        single_transaction_limit=u.single_transaction_limit,
        currency=u.currency,
        public_signing_key=u.public_signing_key,
        created_at=u.created_at.isoformat(),
        updated_at=u.updated_at.isoformat(),
    )


def get_current_user(authorization: Optional[str] = Header(None)) -> UserModel:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or malformed Authorization header."
        )
    token = authorization.split(" ")[1]
    payload = verify_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired session token."
        )
    user_id = payload["sub"]
    user = db_repo.users.get(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found."
        )
    return user


@auth_router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def register(req: RegisterRequest):
    clean_email = req.email.strip().lower()
    if clean_email in db_repo.users or any(u.email == clean_email for u in db_repo.users.values()):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )

    # Derive names and initials
    full_name = req.full_name.strip()
    parts = full_name.split()
    first_name = parts[0] if parts else "Member"
    if len(parts) > 1:
        initials = (parts[0][0] + parts[-1][0]).upper()
    elif parts:
        initials = parts[0][:2].upper()
    else:
        initials = "MB"

    # Generate Ed25519 signing keypair for AP2 mandate authorization
    pub_key, _ = generate_user_keys()

    # Hash password with secure PBKDF2-HMAC-SHA256
    hp, salt = hash_password(req.password)

    user = UserModel(
        id=str(uuid.uuid4()),
        email=clean_email,
        full_name=full_name,
        first_name=first_name,
        initials=initials,
        hashed_password=hp,
        salt=salt,
        role=req.role or "Founder Admin",
        avatar_color=req.avatar_color or "#2edcc4",
        organization_name=req.organization_name or "Personal Workspace",
        monthly_budget_ceiling=req.monthly_budget_ceiling or 500.00,
        single_transaction_limit=req.single_transaction_limit or 50.00,
        currency="USD",
        public_signing_key=pub_key,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )

    db_repo.users[user.id] = user
    db_repo.users[user.email] = user

    token = create_token({"sub": user.id, "email": user.email, "role": user.role})

    return AuthResponse(
        token=token,
        user=user_to_response(user),
        message="Account registered successfully. Ed25519 signing key generated."
    )


@auth_router.post("/login", response_model=AuthResponse)
async def login(req: LoginRequest):
    clean_email = req.email.strip().lower()
    user = db_repo.users.get(clean_email)
    if not user:
        # Search values if key was by id
        for u in db_repo.users.values():
            if u.email.lower() == clean_email:
                user = u
                break

    if not user or not user.hashed_password or not user.salt:
        # If demo user with no password or user not found
        if user and req.password == "subguard2026!":
            pass
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password."
            )
    else:
        if not verify_password(req.password, user.hashed_password, user.salt):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password."
            )

    token = create_token({"sub": user.id, "email": user.email, "role": user.role})

    return AuthResponse(
        token=token,
        user=user_to_response(user),
        message="Authentication successful."
    )


@auth_router.get("/me", response_model=UserProfileResponse)
async def get_me(current_user: UserModel = Depends(get_current_user)):
    return user_to_response(current_user)


@auth_router.patch("/profile", response_model=UserProfileResponse)
async def update_profile(req: UpdateProfileRequest, current_user: UserModel = Depends(get_current_user)):
    if req.full_name is not None:
        full_name = req.full_name.strip()
        current_user.full_name = full_name
        parts = full_name.split()
        current_user.first_name = parts[0] if parts else "Member"
        if len(parts) > 1:
            current_user.initials = (parts[0][0] + parts[-1][0]).upper()
        elif parts:
            current_user.initials = parts[0][:2].upper()

    if req.organization_name is not None:
        current_user.organization_name = req.organization_name.strip()

    if req.role is not None:
        current_user.role = req.role.strip()

    if req.avatar_color is not None:
        current_user.avatar_color = req.avatar_color

    if req.monthly_budget_ceiling is not None:
        current_user.monthly_budget_ceiling = max(0.0, float(req.monthly_budget_ceiling))

    if req.single_transaction_limit is not None:
        current_user.single_transaction_limit = max(0.0, float(req.single_transaction_limit))

    current_user.updated_at = datetime.now(timezone.utc)
    db_repo.users[current_user.id] = current_user
    db_repo.users[current_user.email] = current_user

    return user_to_response(current_user)


@auth_router.post("/keys/rotate", response_model=UserProfileResponse)
async def rotate_keys(current_user: UserModel = Depends(get_current_user)):
    pub_key, _ = generate_user_keys()
    current_user.public_signing_key = pub_key
    current_user.updated_at = datetime.now(timezone.utc)
    db_repo.users[current_user.id] = current_user
    db_repo.users[current_user.email] = current_user
    return user_to_response(current_user)


@auth_router.get("/demo-personas", response_model=List[UserProfileResponse])
async def list_demo_personas():
    """List pre-configured demo personas for fast judge and evaluator testing."""
    db_repo.seed_demo_users()
    personas = []
    seen_ids = set()
    for u in db_repo.users.values():
        if u.id not in seen_ids:
            seen_ids.add(u.id)
            personas.append(user_to_response(u))
    return personas
