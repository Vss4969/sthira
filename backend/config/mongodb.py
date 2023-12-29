"""
MongoDB configuration file
"""

import pymongo
from config.constants import MONGO_URL


client = pymongo.MongoClient(MONGO_URL)
db = client['Trumio']
