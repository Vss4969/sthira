"""
Module for the languages metric
"""

from services.github_api import GitHubAPI

github_api = GitHubAPI()


async def get_languages_metric(repo_data: dict, access_token, _) -> dict:
    """
    Get the languages used in a repository

    Args:
        repo_data (dict): The repository data
        access_token (str): The GitHub Access Token
        _ (dict): The metadata of the user

    Returns:
        dict: The languages used in the repository
    """
    return await github_api.get_languages(access_token, repo_data['name'],
                                          repo_data['owner']['login'])


def summarize_languages_metric(language_sets: dict) -> dict:
    """
    Summarize the languages used from multiple metrics

    Args:
        language_sets (dict): The languages used in multiple repositories

    Returns:
        dict: The languages used in all the repositories
    """
    languages = {}
    for language_set in language_sets:
        for language, value in language_set.items():
            if language not in languages:
                languages[language] = 0
            languages[language] += value
    return languages
