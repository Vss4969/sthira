"""
Project file containg all the relevant Database Operations
"""

from config.mongodb import db
from config.trumio import default_metrics, default_repo_metrics


class DBOps:

    """
    Class that implements required database operations for the project

    Args:
        None
    """

    def add_user(self, user_name: str, github_repos: dict) -> None:
        """
        Adds a new user to the database

        Args:
            user_name (str): The username of the user
            github_repos (dict): The repositories of the user

        Returns:
            None
        """
        data = {
            "username": user_name,
            "status": "Not Started",
            "repositories": [],
            "github_repos": github_repos,
            "metrics": {},
            "metrics_summary": default_metrics,
            "teams": []
        }
        db.users.insert_one(data)

    def verify_and_get_repo_data(self, user_name: str, repos: list[int]) -> list[dict]:
        """
        Verfies if the repositories are valid and returns the repository data
        that are only part of the user's repositories

        Args:
            user_name (str): The username of the user
            repos (list[int]): The repositories to be verified

        Returns:
            list[dict]: The list of valid repositories and the repo data
        """
        user_info = self.get_user(user_name)
        repo_data = []
        for repo in user_info['github_repos']:
            if repo['id'] in repos:
                repo_data.append(repo)
        return repo_data

    def add_repositories(self, user_name: str, repositories: list[int]) -> None:
        """
        Add repositories to the user's repositories that need to be analyzed

        Args:
            user_name (str): The username of the user
            repositories (list[int]): The repositories to be added

        Returns:
            None
        """
        data_to_add = []
        for repo_id in repositories:
            temp_data = {
                "repo_id": repo_id,
                "status": "Not Started",
                "metrics": default_repo_metrics
            }
            data_to_add.append(temp_data)
        repositories.sort()
        user_data = self.get_user(user_name)
        cached_repos = None
        if 'cached_repositories' in user_data:
            cached_repos = user_data['cached_repositories']
        if cached_repos == repositories:
            db.users.update_one({"username": user_name},
                                {"$set": {
                                    "repositories": user_data['cached_repositories']}})
        else:
            db.users.update_one({"username": user_name},
                                {"$set": {"repositories": repositories,
                                          "cached_repositories": repositories,
                                          "metrics": {},
                                          "metrics_summary": default_metrics,
                                          "cached_metrics": {},
                                          "cached_metrics_summary": default_metrics}})

    def reset_user(self, user_name: str) -> None:
        """
        Resets the user's data and the metrics and repositories

        Args:
            user_name (str): The username of the user

        Returns:
            None
        """
        user_data = self.get_user(user_name)
        repositories = user_data['repositories']
        metrics = user_data['metrics']
        metrics_summary = user_data['metrics_summary']
        db.users.update_one({"username": user_name},
                            {"$set": {"status": "Not Started",
                                      "repositories": [],
                                      "metrics": {},
                                      "metrics_summary": default_metrics,
                                      "cached_repositories": repositories,
                                      "cached_metrics": metrics,
                                      "cached_metrics_summary": metrics_summary}})

    def update_user_status(self, user_name: str, status: str) -> None:
        """
        Update the status of user's metrics analysis

        Args:
            user_name (str): The username of the user
            status (str): The status of the user's metrics analysis

        Returns:
            None
        """
        db.users.update_one({"username": user_name}, {
                            "$set": {"status": status}})

    def add_team(self, team_name: str, team_members: list[str]) -> None:
        """
        Add a new team to the database

        Args:
            team_name (str): The name of the team
            team_members (list[str]): The list of team members

        Returns:
            None
        """
        data = {
            "team_name": team_name,
            "team_members": team_members,
            "status": "Not Started",
            "metrics": default_metrics
        }
        db.teams.insert_one(data)

    def reset_team(self, team_name: str) -> None:
        """
        Resets the team's data and the metrics

        Args:
            team_name (str): The name of the team

        Returns:
            None
        """
        db.teams.update_one({"team_name": team_name}, {"$set": {"status": "Not Started",
                                                                "metrics": default_metrics}})

    def update_metrics(self, user_name: str, metrics: dict) -> None:
        """
        Update the metrics of the user

        Args:
            user_name (str): The username of the user
            metrics (dict): The metrics of the user
        """
        db.users.update_one({"username": user_name}, {
                            "$set": {"metrics": metrics}})

    def update_metrics_summary(self, user_name: str, metrics: list[dict]) -> None:
        """
        Update indiviual repository metrics of the user

        Args:
            user_name (str): The username of the user
            metrics (list[dict]): The metrics of the user per repository

        """
        db.users.update_one({"username": user_name}, {
                            "$set": {"metrics_summary": metrics}})

    def delete_user(self, user_name: str) -> None:
        """
        Delete the user from the database

        Args:
            user_name (str): The username of the user
        """
        db.users.delete_one({"username": user_name})

    def delete_team(self, team_name: str) -> None:
        """
        Delete the team from the database

        Args:
            team_name (str): The name of the team
        """
        db.teams.delete_one({"team_name": team_name})

    def get_user(self, user_name: str) -> dict:
        """
        Get Trumio User data from the database

        Args:
            user_name (str): The username of the user
        """
        return db.users.find_one({"username": user_name}, {"_id": 0})

    def get_metrics(self, user_name: str) -> dict:
        """
        Get Trumio User metrics from the database

        Args:
            user_name (str): The username of the user
        """
        user_info = self.get_user(user_name)
        return user_info['metrics']

    def get_cached_metrics(self, user_name: str) -> dict:
        """
        Get Trumio User cached metrics from the database

        Args:
            user_name (str): The username of the user
        """
        user_info = self.get_user(user_name)
        if 'cached_metrics' in user_info:
            return user_info['cached_metrics']
        return {}

    def get_cached_metrics_summary(self, user_name: str) -> dict:
        """
        Get Trumio User cached metrics summary from the database

        Args:
            user_name (str): The username of the user
        """
        user_info = self.get_user(user_name)
        if 'cached_metrics_summary' in user_info:
            return user_info['cached_metrics_summary']
        return {}

    def get_team(self, team_name: str) -> dict:
        """
        Get Trumio team data from the database

        Args:
            team_name (str): The name of the team

        Returns:
            dict: The team data
        """
        return db.teams.find_one({"team_name": team_name}, {"_id": 0})

    def add_team_to_user(self, user_name: str, team_name: str) -> None:
        """
        Add team name to user document for easier search

        Args:
            user_name (str): The username of the user
            team_name (str): The name of the team
        """
        db.users.update_one({"username": user_name}, {
                            "$push": {"teams": team_name}})

    def delete_team_from_user(self, user_name: str, team_name: str) -> None:
        """
        Delete team name from user document for consistency

        Args:
            user_name (str): The username of the user
            team_name (str): The name of the team
        """
        db.users.update_one({"username": user_name}, {
                            "$pull": {"teams": team_name}})

    def get_team_list(self, user_name: str) -> list[str]:
        """
        Get the list of teams the user is part of

        Args:
            user_name (str): The username of the user

        Returns:
            list[str]: The list of teams the user is part of
        """
        user_info = self.get_user(user_name)
        return user_info['teams']

    def get_team_members(self, team_name: str) -> list[str]:
        """
        Get the list of members in the team

        Args:
            team_name (str): The name of the team

        Returns:
            list[str]: The list of members in the team
        """
        team_info = self.get_team(team_name)
        return team_info['team_members']

    def update_team_status(self, team_name: str, status: str) -> None:
        """
        Update the status of team's metrics analysis

        Args:
            team_name (str): The name of the team
            status (str): The status of the team's metrics analysis
        """
        db.teams.update_one({"team_name": team_name}, {
                            "$set": {"status": status}})

    def update_team_summary(self, team_name: str, metrics: dict) -> None:
        """
        Update the metrics of the team

        Args:
            team_name (str): The name of the team
            metrics (dict): The metrics of the team
        """
        db.teams.update_one({"team_name": team_name}, {
                            "$set": {"metrics": metrics}})

    def get_team_status(self, team_name: str) -> str:
        """
        Get the status of the team's metrics analysis

        Args:
            team_name (str): The name of the team
        """
        team_info = self.get_team(team_name)
        return team_info['status']
