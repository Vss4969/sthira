"""
Main Entry Point for the FastAPI Application for the Project Backend
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from routers.github import router as github_router
from routers.users import router as users_router
from routers.teams import router as teams_router
from config.constants import SESSION_SECRET_KEY
from services.github_api import GitHubAPI

app = FastAPI()
app.add_middleware(SessionMiddleware, secret_key=SESSION_SECRET_KEY)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True
)
app.include_router(github_router, prefix='/github', tags=['GitHub Login'])
app.include_router(users_router, prefix='/users', tags=['User Data'])
app.include_router(teams_router, prefix='/teams', tags=['Team Data'])
github_apis = GitHubAPI()


@app.get("/")
async def home(request: Request):
    """
    Home Route for the FastAPI Application

    Args:
        request (Request): The Request Object
    """
    access_token = request.session.get('access_token')
    if access_token is None:
        return {
            "message": "Welcome to the GitHub Profile Analyzer. Please login to continue.",
            "login": "Not Authenticated",
            "user_data": None,
        }
    user_data = await github_apis.get_user_data(access_token)
    if not user_data:
        request.session.pop('access_token', None)
    return {
        "message": "Welcome to the GitHub Profile Analyzer",
        "login": "Authenticated" if user_data else "Not Authenticated",
        "user_data": user_data,
    }
