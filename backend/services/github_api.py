"""
File that implements the GitHub API accesses for the project
"""
import base64
import httpx
from httpx import HTTPError


class GitHubAPI:

    """
    Class that implements required GitHub API accesses for the project
    """

    async def get_user_data(self, access_token: str) -> dict:
        """
        Get GitHub user deatils

        Args:
            access_token (str): The access token of the user

        Returns:
            dict: The user data
        """
        user_data = None
        try:
            async with httpx.AsyncClient() as client:
                headers = {"Authorization": f"Bearer {access_token}"}
                response = await client.get('https://api.github.com/user', headers=headers)
                response.raise_for_status()
                user_data = response.json()
        except HTTPError as http_err:
            print("Error while fetching user data:", http_err)
        return user_data

    async def get_user_repositories(self, access_token: str) -> dict:
        """
        Get GitHub user repositories

        Args:
            access_token (str): The access token of the user

        Returns:
            dict: The user repositories
        """
        repositories = []
        try:
            async with httpx.AsyncClient() as client:
                headers = {"Authorization": f"Bearer {access_token}"}
                response = await client.get('https://api.github.com/user/repos', headers=headers)
                response.raise_for_status()
                repositories = response.json()
        except HTTPError as http_err:
            print("Error while fetching user repositories:", http_err)
        return repositories

    async def get_languages(self, access_token: str, repo_name: str, owner: str) -> dict:
        """
        Get the Languages used in the repository

        Args:
            access_token (str): The access token of the user
            repo_name (str): The repository name
            owner (str): The owner of the repository

        Returns:
            dict: The languages used in the repository
        """
        languages = []
        try:
            async with httpx.AsyncClient() as client:
                url = f'https://api.github.com/repos/{owner}/{repo_name}/languages'
                headers = {"Authorization": f"Bearer {access_token}"}
                response = await client.get(url, headers=headers)
                response.raise_for_status()
                languages = response.json()
        except HTTPError as http_err:
            print("Error while fetching languages:", http_err)
        return languages

    async def get_contributions(self, access_token: str, repo_name: str, owner: str) -> dict:
        """
        Get all the contributions made by a user to the repository

        Args:
            access_token (str): The access token of the user
            repo_name (str): The repository name
            owner (str): The owner of the repository

        Returns:
            dict: The contributions made by the user to the repository
        """
        contributions = []
        try:
            async with httpx.AsyncClient() as client:
                url = f'https://api.github.com/repos/{owner}/{repo_name}/stats/contributors'
                headers = {"Authorization": f"Bearer {access_token}"}
                response = await client.get(url, headers=headers)
                response.raise_for_status()
                contributions = response.json()
        except HTTPError as http_err:
            print("Error while fetching contributions:", http_err)
        return contributions

    async def get_branches(self, access_token: str, repo_name: str, owner: str) -> dict:
        """
        Get all the branches made by a user to the repository

        Args:
            access_token (str): The access token of the user
            repo_name (str): The repository name
            owner (str): The owner of the repository

        Returns:
            dict: The branch details made by the user to the repository
        """
        branches = []
        try:
            async with httpx.AsyncClient() as client:
                url = f'https://api.github.com/repos/{owner}/{repo_name}/branches'
                headers = {"Authorization": f"Bearer {access_token}"}
                response = await client.get(url, headers=headers)
                response.raise_for_status()
                branches = response.json()
        except HTTPError as http_err:
            print("Error while fetching branches:", http_err)
        return branches

    async def get_repository_contents(self, access_token: str, repo_name: str, owner: str) -> dict:
        """
        Get the files and folders in the repository

        Args:
            access_token (str): The access token of the user
            repo_name (str): The repository name
            owner (str): The owner of the repository

        Returns:
            dict: The files and folders in the repository
        """
        contents = []
        try:
            async with httpx.AsyncClient() as client:
                branches = ["main", "master"]
                for branch in branches:
                    url = f'https://api.github.com/repos/{owner}/{repo_name}/contents/'
                    params = {"ref": branch}
                    headers = {"Authorization": f"Bearer {access_token}"}
                    response = await client.get(url, params=params, headers=headers)
                    if response.status_code == 200:
                        contents = response.json()
                        break
        except HTTPError as http_err:
            print("Error while fetching repository contents:", http_err)
        return contents

    async def get_folder_contents(self, access_token: str, repo_name: str,
                                  owner: str, trhash: str) -> dict:
        """
        Get the files and folders in a tree using the tree hash

        Args:
            access_token (str): The access token of the user
            repo_name (str): The repository name
            owner (str): The owner of the repository
            trhash (str): The tree hash of the tree

        Returns:
            dict: The files and folders in the tree
        """
        contents = []
        try:
            async with httpx.AsyncClient() as client:
                url = f'https://api.github.com/repos/{owner}/{repo_name}/git/trees/{trhash}'
                headers = {"Authorization": f"Bearer {access_token}"}
                response = await client.get(url, headers=headers)
                response.raise_for_status()
                contents = response.json()
        except HTTPError as http_err:
            print("Error while fetching repository contents:", http_err)
        return contents

    async def get_file_contents(self, access_token: str, repo_name: str,
                                owner: str, sha: str) -> str:
        """
        Get the UTF-8 encoded content of a file using the sha of the file

        Args:
            access_token (str): The access token of the user
            repo_name (str): The repository name
            owner (str): The owner of the repository
            sha (str): The sha of the file

        Returns:
            str: The UTF-8 encoded content of the file
        """
        content = ""
        try:
            async with httpx.AsyncClient() as client:
                url = f'https://api.github.com/repos/{owner}/{repo_name}/git/blobs/{sha}'
                headers = {"Authorization": f"Bearer {access_token}"}
                response = await client.get(url, headers=headers)
                response.raise_for_status()
                response = response.json()
                if response['size'] > 150*1000:
                    return ""
        except HTTPError as http_err:
            print("Error while fetching file contents:", http_err)
            return ""
        content = response['content']
        content = base64.b64decode(content).decode('utf-8')
        return content

    async def get_readme(self, access_token: str, repo_name: str, owner: str) -> str:
        """
        Get the README file of the repository

        Args:
            access_token (str): The access token of the user
            repo_name (str): The repository name
            owner (str): The owner of the repository

        Returns:
            str: The README file of the repository
        """
        readme = ""
        try:
            async with httpx.AsyncClient() as client:
                url = f'https://api.github.com/repos/{owner}/{repo_name}/readme'
                headers = {"Authorization": f"Bearer {access_token}"}
                response = await client.get(url, headers=headers)
                response.raise_for_status()
                response = response.json()
        except HTTPError as http_err:
            print("Error while fetching readme:", http_err)
        readme = response['content']
        readme = base64.b64decode(readme).decode('utf-8')
        return readme

    async def get_commits(self, access_token: str, repo_name: str, owner: str) -> str:
        """
        Get all the commits made to the repository

        Args:
            access_token (str): The access token of the user
            repo_name (str): The repository name
            owner (str): The owner of the repository

        Returns:
            str: The commits made to the repository
        """
        commits = []
        try:
            async with httpx.AsyncClient() as client:
                url = f'https://api.github.com/repos/{owner}/{repo_name}/commits'
                headers = {"Authorization": f"Bearer {access_token}"}
                response = await client.get(url, headers=headers)
                response.raise_for_status()
                commits = response.json()
        except HTTPError as http_err:
            print("Error while fetching commits:", http_err)
        commit_timeline = ""
        for commit in commits:
            commit_timeline = commit['commit']['message'] + \
                "\n" + commit_timeline
        return commit_timeline
