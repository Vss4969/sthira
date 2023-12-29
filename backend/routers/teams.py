"""
Module for handling team related APIs
"""

from threading import Thread
from fastapi import APIRouter, Request, status, HTTPException
from metrics.controller import start_team_analysis
from services.db_ops import DBOps
from services.async_thread import between_callback

router = APIRouter()
db_ops = DBOps()


@router.post('/')
async def create_team(request: Request):
    body = await request.json()
    team_name = body['body']['team_name']
    members = body['body']['members']
    print(team_name, members)
    """
    Route to create a new team

    Args:
        request (Request): The Request Object
        members (list[str]): The list of members of the team
        team_name (str): The name of the team

    Raises:
        HTTPException 401: If the user is not logged in
        HTTPException 409: If the team name already exists
        HTTPException 404: If a member of the team is not found
        HTTPException 400: If the team size is less than 2 or greater than 5

    Returns:
        dict: The message of the successful creation of the team
    """
    if 'access_token' not in request.session or 'username' not in request.session:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Not logged in")
    if db_ops.get_team(team_name) is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Team name already exists")
    username = request.session['username']
    if username not in members:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="You must be a member of the team")
    for member in members:
        if db_ops.get_user(member) is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail=member + " not found")
    members = list(set(members))
    if len(members) < 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Team size must be greater than 1")
    if len(members) >= 5:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Team size must be less than 5")
    for member in members:
        db_ops.add_team_to_user(member, team_name)
    db_ops.add_team(team_name, members)
    return {"message": "Team added successfully"}


@router.get('/')
def get_team(request: Request, team_name: str):
    """
    Route to get the details of a team

    Args:
        request (Request): The Request Object
        team_name (str): The name of the team

    Raises:
        HTTPException 401: If the user is not logged in
        HTTPException 404: If the team is not found
        HTTPException 401: If the user is not authorized to view the team

    Returns:
        dict: The details of the team
    """
    if 'access_token' not in request.session or 'username' not in request.session:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Not logged in")
    username = request.session['username']
    if db_ops.get_user(username) is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    team_data = db_ops.get_team(team_name)
    if team_data is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Team not found")
    team_list = db_ops.get_team_list(username)
    if team_name not in team_list:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authorized to view this team")
    return team_data


@router.get('/my-teams')
def get_my_teams(request: Request):
    """
    Route to get the list of teams of the user

    Args:
        request (Request): The Request Object

    Raises:
        HTTPException 401: If the user is not logged in
        HTTPException 404: If the user is not found

    Returns:
        dict: The list of teams the user is part of
    """
    if 'access_token' not in request.session or 'username' not in request.session:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Not logged in")
    username = request.session['username']
    if db_ops.get_user(username) is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    team_list = db_ops.get_team_list(username)
    return {"team_list": team_list}


@router.delete('/')
def delete_team(request: Request, team_name: str):
    """
    Route to delete a team

    Args:
        request (Request): The Request Object
        team_name (str): The name of the team

    Raises:
        HTTPException 401: If the user is not logged in
        HTTPException 404: If the user is not found
        HTTPException 404: If the team is not found
        HTTPException 401: If the user is not authorized to delete the team

    Returns:
        dict: The message of the successful deletion of the team
    """
    if 'access_token' not in request.session or 'username' not in request.session:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Not logged in")
    username = request.session['username']
    if db_ops.get_user(username) is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    if db_ops.get_team(team_name) is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Team not found")
    team_list = db_ops.get_team_list(username)
    if team_name not in team_list:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authorized to delete this team")
    members = db_ops.get_team_members(team_name)
    for member in members:
        db_ops.delete_team_from_user(member, team_name)
    db_ops.delete_team(team_name)
    return {"message": "Team deleted successfully"}


@router.post('/trigger')
async def trigger_team_metrics(request: Request):
    """
    Route to trigger the analysis of a team

    Args:
        request (Request): The Request Object
        team_name (str): The name of the team

    Raises:
        HTTPException 401: If the user is not logged in
        HTTPException 404: If the user is not found
        HTTPException 404: If the team is not found
        HTTPException 401: If the user is not authorized to trigger the team analysis

    Returns:
        dict: The message of the successful triggering of the team analysis
    """
    body = await request.json()
    team_name = body['body']['team_name']
    print(team_name)
    if 'access_token' not in request.session or 'username' not in request.session:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Not logged in")
    access_token = request.session['access_token']
    username = request.session['username']
    team_list = db_ops.get_team_list(username)
    if team_name not in team_list:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authorized to trigger this team")

    async def async_runner(args):
        await start_team_analysis(*args)
    analysis_thread = Thread(target=between_callback,
                             args=(async_runner, (team_name, access_token)))
    analysis_thread.start()
    return {"message": "Team analysis started"}


@router.get('/status')
def get_team_status(request: Request, team_name: str):
    """
    Route to get the analysis status of a team

    Args:
        request (Request): The Request Object
        team_name (str): The name of the team

    Raises:
        HTTPException 401: If the user is not logged in
        HTTPException 401: If the user is not authorized to view the team status

    Returns:
        dict: The status of the team analysis
    """
    if 'access_token' not in request.session or 'username' not in request.session:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Not logged in")
    username = request.session['username']
    team_list = db_ops.get_team_list(username)
    if team_name not in team_list:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authorized to access this team")
    analysis_status = db_ops.get_team_status(team_name)
    return {"Status": analysis_status}


@router.patch('/reset')
def reset_team_data(request: Request, team_name: str):
    """
    Route to reset the team data

    Args:
        request (Request): The Request Object
        team_name (str): The name of the team

    Raises:
        HTTPException 401: If the user is not logged in
        HTTPException 404: If the user is not found
        HTTPException 404: If the team is not found
        HTTPException 401: If the user is not authorized to reset the team data

    Returns:
        dict: The message of the successful reset of the team data
    """
    if 'access_token' not in request.session or 'username' not in request.session:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Not logged in")
    username = request.session['username']
    if db_ops.get_user(username) is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    if db_ops.get_team(team_name) is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Team not found")
    team_list = db_ops.get_team_list(username)
    if team_name not in team_list:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authorized to reset this team")
    if db_ops.get_team_status(team_name) == "In Progress":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot reset while analysis is in progress")
    db_ops.reset_team(team_name)
    return {"message": "Team data reset successful"}
