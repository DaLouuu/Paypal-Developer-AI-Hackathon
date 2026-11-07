"""Tests for SubGuard AP2 Authentication, Session Management, and Profiling."""

import pytest
from fastapi.testclient import TestClient

from subguard.mcp_proxy.server import create_app


@pytest.fixture
def client():
    app = create_app(testing=True)
    return TestClient(app)


def test_auth_registration_and_login_flow(client):
    # 1. Register new user
    reg_payload = {
        "email": "elena.rostova@acme-corp.io",
        "password": "SecurePassword2026!",
        "full_name": "Elena Rostova",
        "organization_name": "Acme Cybernetics",
        "role": "Chief Financial Officer",
        "monthly_budget_ceiling": 1500.0,
        "single_transaction_limit": 150.0
    }
    res = client.post("/v1/auth/register", json=reg_payload)
    assert res.status_code == 201
    data = res.json()
    assert "token" in data
    assert data["user"]["email"] == "elena.rostova@acme-corp.io"
    assert data["user"]["first_name"] == "Elena"
    assert data["user"]["initials"] == "ER"
    assert data["user"]["role"] == "Chief Financial Officer"
    assert "BEGIN PUBLIC KEY" in data["user"]["public_signing_key"]

    token = data["token"]

    # 2. Duplicate registration rejection
    dup_res = client.post("/v1/auth/register", json=reg_payload)
    assert dup_res.status_code == 400

    # 3. Successful Login
    login_res = client.post("/v1/auth/login", json={
        "email": "elena.rostova@acme-corp.io",
        "password": "SecurePassword2026!"
    })
    assert login_res.status_code == 200
    assert "token" in login_res.json()

    # 4. Wrong password rejection
    bad_login = client.post("/v1/auth/login", json={
        "email": "elena.rostova@acme-corp.io",
        "password": "WrongPassword!"
    })
    assert bad_login.status_code == 401

    # 5. Get current profile via /v1/auth/me
    headers = {"Authorization": f"Bearer {token}"}
    me_res = client.get("/v1/auth/me", headers=headers)
    assert me_res.status_code == 200
    me_data = me_res.json()
    assert me_data["full_name"] == "Elena Rostova"
    assert me_data["monthly_budget_ceiling"] == 1500.0

    # 6. Update Profile
    update_res = client.patch("/v1/auth/profile", json={
        "organization_name": "Acme Autonomous AI Labs",
        "monthly_budget_ceiling": 2000.0,
        "single_transaction_limit": 250.0
    }, headers=headers)
    assert update_res.status_code == 200
    updated = update_res.json()
    assert updated["organization_name"] == "Acme Autonomous AI Labs"
    assert updated["monthly_budget_ceiling"] == 2000.0
    assert updated["single_transaction_limit"] == 250.0

    # 7. Rotate Ed25519 Signing Keys
    rotate_res = client.post("/v1/auth/keys/rotate", headers=headers)
    assert rotate_res.status_code == 200
    assert "BEGIN PUBLIC KEY" in rotate_res.json()["public_signing_key"]
    assert rotate_res.json()["public_signing_key"] != data["user"]["public_signing_key"]


def test_auth_demo_personas_listing(client):
    res = client.get("/v1/auth/demo-personas")
    assert res.status_code == 200
    personas = res.json()
    assert len(personas) >= 1
    alex = next((p for p in personas if "Alex" in p["full_name"]), None)
    assert alex is not None
    assert alex["role"] == "Founder Admin"
