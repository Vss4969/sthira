"""
Project specific configuration file. This file contains the default values for
the metrics that are tracked by Trumio. It also contains the default values for
the ProgressTracker class.
"""

import copy
from services.progress_track import ProgressTracker

user_progress = ProgressTracker()
default_repo_metrics = {
    "project_descriptions": None,
    "directory_structure": None,
    "code_quality_score": None,
    "code_quality_style": None,
    "languages_used": None,
    "stars": None,
    "forks": None,
    "branches": None,
    "commit_names": None,
    "commit_rate": None,
    "code_rate": None,
    "percent_contribution": None,
    "readme_file_quality": None,
}
default_metrics = copy.deepcopy(default_repo_metrics)
default_metrics["followers"] = None
default_metrics["number_of_repos"] = None
