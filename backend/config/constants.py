"""
File containing all the constants used in the project
"""
import os
from dotenv import load_dotenv

load_dotenv()

GITHUB_CLIENT_ID = os.getenv('GITHUB_CLIENT_ID')
GITHUB_CLIENT_SECRET = os.getenv('GITHUB_CLIENT_SECRET')
SESSION_SECRET_KEY = os.getenv('SESSION_SECRET_KEY')
GITHUB_CALLBACK = os.getenv('GITHUB_CALLBACK')
MONGO_URL = "mongodb+srv://shashankp28:MyPassword12345@cluster0.iy0bw.mongodb.net/?retryWrites=true&w=majority"
OPEN_AI_KEY = os.getenv('OPEN_AI_KEY')
FRONTEND_HOMEPAGE = os.getenv('FRONTEND_HOMEPAGE')