"""
Module to analyze contributions to a repository by the user
"""
from services.github_api import GitHubAPI

github_api = GitHubAPI()


async def get_contribution_metrics(repo_data: dict,
                                   access_token: str, _) -> tuple[float, float, float]:
    """
    Function to get the contribution metrics of a repository by a user

    Args:
        repo_data (dict): The repository data
        access_token (str): The GitHub Access Token
        _ (dict): The metadata of the user

    Returns:
        tuple[float, float, float]: The commit rate, code rate and line contribution ratios
    """
    contributions = {}
    commit_rate, code_rate = 0, 0
    for _ in range(5):
        contributions = await github_api.get_contributions(access_token, repo_data['name'],
                                                           repo_data['owner']['login'])
        if len(contributions) != 0:
            break
    global_commits, global_lines = 0, 0
    user_commits, user_lines, user_weeks = 0, 0, 0
    for contribution in contributions:
        for week in contribution['weeks']:
            if week['c'] != 0:
                global_commits += week['c']
                global_lines += week['a']
                if contribution['author']['login'] == repo_data['owner']['login']:
                    user_commits += week['c']
                    user_lines += week['a']
                    user_weeks += 1
        if user_weeks != 0:
            commit_rate = user_commits / user_weeks
            code_rate = user_lines / user_weeks
    line_contribution = 0
    if global_lines != 0:
        line_contribution = 100 * user_lines / global_lines
    return commit_rate, code_rate, line_contribution
