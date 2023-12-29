"""
Module to handle All GitHub authentication related Routes
"""

from typing import Optional
from fastapi import APIRouter, Request, HTTPException, status
from fastapi.responses import RedirectResponse
from config.constants import GITHUB_CALLBACK, FRONTEND_HOMEPAGE
from config.github import github_oauth
from services.github_api import GitHubAPI
from services.db_ops import DBOps

router = APIRouter()
github_api = GitHubAPI()
db_ops = DBOps()


@router.get("/login")
async def github_login(request: Request):
    """
    Route to initiate GitHub OAuth Login Flow

    Args:
        request (Request): The Request Object
    """
    redirect_uri = GITHUB_CALLBACK
    return await github_oauth.github.authorize_redirect(request, redirect_uri)


@router.get("/callback")
async def login_callback(request: Request, code: Optional[str] = None):
    """
    Route to handle GitHub OAuth Callback and set session variables

    Args:
        request (Request): The Request Object
        code (Optional[str], optional): The OAuth Code. Defaults to None.

    Raises:
        HTTPException 400: If Code is not provided
        HTTPException 401: If Access Token is not retrieved
        HTTPException 401: If User Details are not retrieved

    Returns:
        RedirectResponse: Redirects to the frontend
    """
    if code is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Code not provided")
    token = await github_oauth.github.authorize_access_token(request)
    if token is None or 'access_token' not in token:
        raise HTTPException(
            status_code=401, detail="Failed to retrieve access token")
    user_details = await github_api.get_user_data(token['access_token'])
    if user_details is None:
        raise HTTPException(
            status_code=401, detail="Failed to retrieve user details")
    username = user_details['login']
    access_token = token['access_token']
    if db_ops.get_user(username) is None:
        github_repositories = await github_api.get_user_repositories(access_token)
        db_ops.add_user(username, github_repositories)
    request.session['access_token'] = access_token
    request.session['username'] = username
    return RedirectResponse(FRONTEND_HOMEPAGE)


@router.get("/logout")
async def logout(request: Request):
    """
    Route to handle GitHub OAuth Logout and clear session variables

    Args:
        request (Request): The Request Object

    Returns:
        RedirectResponse: Redirects to the frontend
    """
    request.session.clear()
    return RedirectResponse(FRONTEND_HOMEPAGE)
