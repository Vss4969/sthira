"""
Module to analyze complete GitHub repositories for all the users and teams
"""

import copy
from time import sleep
import asyncio
from services.github_api import GitHubAPI
from services.db_ops import DBOps
from config.trumio import user_progress, default_metrics, default_repo_metrics
from metrics.languages import get_languages_metric, summarize_languages_metric
from metrics.contribution import get_contribution_metrics
from metrics.branch import get_branch_metric
from metrics.directory import get_directory_metric
from metrics.code_quality import get_code_quality
from metrics.readme import get_readme_metric
from metrics.commits import get_commits_metric
from metrics.description import get_repo_description

db_ops = DBOps()
github_api = GitHubAPI()


async def get_metrics_summary(metrics: dict, access_token: str, userdata: dict = None) -> dict:
    """
    Function to get the summarized metrics of a user or team

    Args:
        metrics (dict): The metrics of the user or team
        access_token (str): The GitHub Access Token
        userdata (dict, optional): The user data for user, None for team

    Returns:
        dict: The summarized metrics of the user or team
    """
    summarized_metrics = copy.deepcopy(default_metrics)
    if userdata:
        github_user_data = await github_api.get_user_data(access_token)
        summarized_metrics['followers'] = github_user_data['followers']
        summarized_metrics['number_of_repos'] = github_user_data['public_repos']
    else:
        summarized_metrics['followers'] = sum(metrics['followers']
                                              for _, metrics in metrics.items())
        summarized_metrics['number_of_repos'] = sum(metrics['number_of_repos']
                                                    for _, metrics in metrics.items())
    summarized_metrics['branches'] = '\n'.join(metric['branches']
                                               for _, metric in metrics.items())
    summarized_metrics['directory_structure'] = '\n'.join(metric['directory_structure']
                                                          for _, metric in metrics.items())
    summarized_metrics['code_quality_score'] = sum(metric['code_quality_score']
                                                   for _, metric in metrics.items())/len(metrics)
    summarized_metrics['code_quality_style'] = '\n'.join(metric['code_quality_style']
                                                         for _, metric in metrics.items())
    summarized_metrics['forks'] = sum(metric['forks']
                                      for _, metric in metrics.items())
    summarized_metrics['languages_used'] = \
        summarize_languages_metric(
            metric['languages_used'] for _, metric in metrics.items())
    summarized_metrics['stars'] = sum(metric['stars']
                                      for _, metric in metrics.items())
    summarized_metrics['commit_rate'] = sum(metric['commit_rate']
                                            for _, metric in metrics.items())/len(metrics)
    summarized_metrics['code_rate'] = sum(metric['code_rate']
                                          for _, metric in metrics.items())/len(metrics)
    summarized_metrics['percent_contribution'] = sum(metric['percent_contribution']
                                                     for _, metric in metrics.items())/len(metrics)
    summarized_metrics['project_descriptions'] = '\n'.join(metric['project_descriptions']
                                                           for _, metric in metrics.items())
    summarized_metrics['commit_names'] = '\n'.join(metric['commit_names']
                                                   for _, metric in metrics.items())
    summarized_metrics['readme_file_quality'] = '\n'.join(metric['readme_file_quality']
                                                          for _, metric in metrics.items())
    return summarized_metrics


async def start_user_analysis(user_data: dict, access_token: dict) -> None:
    """
    Async function to start the analysis of a users repositories with progress updates
    and update the database accordingly

    Args:
        user_data (dict): The user data
        access_token (str): The GitHub Access Token
    """
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    username = user_data['username']
    db_ops.update_user_status(username, "In Progress")
    print(db_ops.get_cached_metrics(username))
    if len(db_ops.get_cached_metrics(username)) != 0:
        for i in range(20):
            user_progress.update_key_progress(username, i/20)
            await asyncio.sleep(0.1)
        db_ops.update_metrics(username, db_ops.get_cached_metrics(username))
        db_ops.update_metrics_summary(
            username, db_ops.get_cached_metrics_summary(username))
        db_ops.update_user_status(username, "Completed")
        user_progress.delete_key_progress(username)
        return
    check_repositories = set(user_data['repositories'])
    all_metrics = {}
    try:
        total = len(check_repositories)
        current, no_metrics, per_repo = 0, 13, 0.9 / total
        for repo in user_data['github_repos']:
            if repo['id'] not in check_repositories:
                continue
            print("Repository Name:", repo['name'])
            user_progress.update_key_progress(username, current)
            metadata = {}
            metrics = copy.deepcopy(default_repo_metrics)
            metrics['branches'] = await get_branch_metric(repo, access_token, metadata)
            print("Branches Metric Done")
            current += per_repo / no_metrics
            user_progress.update_key_progress(username, current)
            metrics['directory_structure'] = await get_directory_metric(repo, access_token,
                                                                        metadata)
            print("Directory Metric Done")
            current += per_repo / no_metrics
            user_progress.update_key_progress(username, current)
            metrics['code_quality_style'], metrics['code_quality_score'] = \
                await get_code_quality(repo, access_token, metadata)
            print("Code Quality Done")
            current += 2 * per_repo / no_metrics
            user_progress.update_key_progress(username, current)
            metrics['forks'] = repo['forks']
            print("Forks Done")
            current += per_repo / no_metrics
            user_progress.update_key_progress(username, current)
            metrics['languages_used'] = await get_languages_metric(
                repo, access_token, metadata)
            print("Languages Done")
            current += per_repo / no_metrics
            user_progress.update_key_progress(username, current)
            metrics['stars'] = repo['stargazers_count']
            print("Stars Done")
            current += per_repo / no_metrics
            user_progress.update_key_progress(username, current)
            metrics['commit_rate'], metrics['code_rate'], metrics['percent_contribution'] = \
                await get_contribution_metrics(repo, access_token, metadata)
            print("Contribution Done")
            current += 3 * per_repo / no_metrics
            user_progress.update_key_progress(username, current)
            metrics['project_descriptions'] = get_repo_description(metadata)
            print("Description Done")
            metrics['commit_names'] = await get_commits_metric(
                repo, access_token, metadata)
            print("Commit Names Done")
            current += per_repo / no_metrics
            user_progress.update_key_progress(username, current)
            metrics['readme_file_quality'] = await get_readme_metric(repo, access_token, metadata)
            print("README Done")
            current += per_repo / no_metrics
            user_progress.update_key_progress(username, current)
            current += per_repo / no_metrics
            user_progress.update_key_progress(username, current)
            all_metrics[str(repo['id'])] = metrics
            print("All Done\n\n")
        db_ops.update_metrics(username, all_metrics)
        print("\n\n\nAll Metrics:\n", all_metrics, "\n\n\n")
    except Exception as e:  # pylint: disable=broad-except
        print(e)
    finally:
        db_ops.update_metrics(username, all_metrics)
        all_metrics_summary = await get_metrics_summary(all_metrics, access_token, user_data)
        print("\n\n\nUser Metrics Summary:\n", all_metrics_summary, "\n\n\n")
        db_ops.update_metrics_summary(
            username, all_metrics_summary)
        user_progress.update_key_progress(username, 1)
        db_ops.update_user_status(username, "Completed")
        user_progress.delete_key_progress(user_data['username'])


async def start_team_analysis(team_name: str, access_token: str) -> None:
    """
    Function to start the analysis of a team and update the database

    Args:
        team_name (str): The name of the team
        access_token (str): The GitHub Access Token
    """
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    db_ops.update_team_status(team_name, "In Progress")
    user_list = db_ops.get_team_members(team_name)
    team_metrics = {}
    for user in user_list:
        user_data = db_ops.get_user(user)
        if user_data is None:
            continue
        team_metrics[user_data['username']] = user_data['metrics_summary']
    team_summary = await get_metrics_summary(team_metrics, access_token)
    print("\n\n\nTeam Metrics Summary:\n", team_summary, "\n\n\n")
    db_ops.update_team_summary(team_name, team_summary)
    db_ops.update_team_status(team_name, "Completed")
