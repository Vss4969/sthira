from threading import Thread
from fastapi import APIRouter, Request, status, HTTPException
from services.db_ops import DBOps
from services.github_api import GitHubAPI
from services.async_thread import between_callback
from metrics.controller import start_user_analysis
from config.trumio import user_progress

router = APIRouter()
db_ops = DBOps()
github_api = GitHubAPI()


@router.delete('/')
async def delete_user(request: Request):
    if 'access_token' not in request.session or 'username' not in request.session:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Not logged in")
    username = request.session['username']
    if db_ops.get_user(username) is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    db_ops.delete_user(username)
    request.session.clear()


@router.get('/')
async def get_user(request: Request):
    if 'access_token' not in request.session or 'username' not in request.session:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Not logged in")
    username = request.session['username']
    user_data = db_ops.get_user(username)
    if user_data is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return {"user_data": user_data}


@router.patch('/reset')
async def reset_user_data(request: Request):
    if 'access_token' not in request.session or 'username' not in request.session:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Not logged in")
    username = request.session['username']
    if db_ops.get_user(username) is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    if db_ops.get_user(username)['status'] == "In Progress":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot reset while analysis is in progress")
    db_ops.reset_user(username)
    user_progress.delete_key_progress(username)
    return {"message": "User data reset successful"}


@router.get('/user/repositories')
async def get_user_repositories(request: Request):
    if 'access_token' not in request.session or 'username' not in request.session:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Not logged in")
    username = request.session['username']
    user_data = db_ops.get_user(username)
    if user_data is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return {"user_repositories": user_data['repositories']}


@router.get('/github/repositories')
async def get_github_repositories(request: Request):
    if 'access_token' not in request.session or 'username' not in request.session:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Not logged in")
    username = request.session['username']
    user_data = db_ops.get_user(username)
    if user_data is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return {"github_repositories": user_data['github_repos']}


@router.post('/repositories')
async def set_repositories(request: Request, repositories: list[int]):
    repositories = list(set(repositories))
    if len(repositories) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="No repositories provided")
    if len(repositories) > 4:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Maximum 4 repositories allowed")
    if 'access_token' not in request.session or 'username' not in request.session:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Not logged in")
    username = request.session['username']
    if db_ops.get_user(username) is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    repos_data = db_ops.verify_and_get_repo_data(username, repositories)
    if len(repos_data) != len(repositories):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid repositories")
    db_ops.add_repositories(username, repositories)
    return {"message": "Repository added successfully"}


@router.post('/trigger')
async def trigger_metrics(request: Request):
    print(request.session)
    if 'access_token' not in request.session or 'username' not in request.session:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Not logged in")
    username = request.session['username']
    user_data = db_ops.get_user(username)

    if len(user_data['repositories']) == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No Repositories to analyze")
    if user_data is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    if user_data['status'] == "In Progress":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Already Triggered wait for Completion")

    async def async_runner(args):
        await start_user_analysis(*args)
    analysis_thread = Thread(target=between_callback,
                             args=(async_runner, (user_data, request.session['access_token'])))
    analysis_thread.start()
    return {"message": "Triggered Analysis Successfully"}


@router.get('/progress')
async def get_metrics_progress(request: Request):
    if 'access_token' not in request.session or 'username' not in request.session:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Not logged in")
    username = request.session['username']
    if db_ops.get_user(username) is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return {"progress": user_progress.get_key_progress(username)}


@router.get('/status')
async def get_user_status(request: Request):
    if 'access_token' not in request.session or 'username' not in request.session:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Not logged in")
    username = request.session['username']
    user_data = db_ops.get_user(username)
    if user_data is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return {"status": user_data['status']}


@router.patch('/status')
async def update_user_status(request: Request, new_status: str):
    if 'access_token' not in request.session or 'username' not in request.session:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Not logged in")
    username = request.session['username']
    if db_ops.get_user(username) is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    db_ops.update_user_status(username, new_status)
    return {"message": "Status Updated Successfully"}
