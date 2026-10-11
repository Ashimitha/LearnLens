import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["product"] == "LearnLens AI"

def test_demo_login_student():
    response = client.post("/api/auth/login", json={
        "email": "priya@example.com",
        "password": "demo123"
    })
    assert response.status_code == 200
    data = response.json()
    assert "token" in data
    assert data["user"]["email"] == "priya@example.com"
    assert data["user"]["role"] == "student"

def test_invalid_login():
    response = client.post("/api/auth/login", json={
        "email": "priya@example.com",
        "password": "wrongpassword"
    })
    assert response.status_code == 401

def test_unauthorized_access():
    response = client.get("/api/auth/me")
    assert response.status_code == 401

def test_question_submission_and_lesson():
    # Login first
    login_res = client.post("/api/auth/login", json={
        "email": "priya@example.com",
        "password": "demo123"
    })
    token = login_res.json()["token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Submit a doubt
    q_res = client.post("/api/questions", json={
        "text": "Why does a pencil appear bent when placed in a glass of water?",
        "subject": "Physics"
    }, headers=headers)

    assert q_res.status_code == 200
    data = q_res.json()
    assert "question" in data
    assert "lesson" in data
    assert data["lesson"]["subject"] == "Physics"
    assert "steps" in data["lesson"]
    assert len(data["lesson"]["steps"]) > 0

def test_quiz_generation_and_evaluation():
    # Login first
    login_res = client.post("/api/auth/login", json={
        "email": "priya@example.com",
        "password": "demo123"
    })
    token = login_res.json()["token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Generate quiz
    gen_res = client.post("/api/quizzes/generate", json={
        "topic": "Light Refraction & Snell Law",
        "subject": "Physics"
    }, headers=headers)
    assert gen_res.status_code == 200
    quiz = gen_res.json()["quiz"]
    quiz_id = quiz["id"]
    assert len(quiz["questions"]) > 0

    # Submit quiz answers
    sub_res = client.post(f"/api/quizzes/{quiz_id}/submit", json={
        "answers": {
            quiz["questions"][0]["id"]: 1
        }
    }, headers=headers)
    assert sub_res.status_code == 200
    sub_data = sub_res.json()
    assert "score" in sub_data
    assert "percentage" in sub_data
    assert "questionResults" in sub_data
