"""
GitHub OAuth2 configuration file
"""

from authlib.integrations.starlette_client import OAuth
from config.constants import GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET

github_oauth_params = {
    "name": 'github',
    "client_id": GITHUB_CLIENT_ID,
    "client_secret": GITHUB_CLIENT_SECRET,
    "authorize_url": 'https://github.com/login/oauth/authorize',
    "access_token_url": 'https://github.com/login/oauth/access_token',
    "client_kwargs": {'scope': 'repo'}
}

github_oauth = OAuth()
github_oauth.register(**github_oauth_params)
