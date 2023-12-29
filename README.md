<font size="4">

# Sthira: An GitHub Profile Analyzer Bot

This bot is used to analyze the GitHub profile of a user. The user can login through GitHub on our platform. Later can analyze his/her own repositories/projects. The bot comes up with a well structured analysis providing various metrics such as code quality, project description and many more. Users can also create teams and get profiles for teams.

  <a href="./assets/sthira_animation.gif" target="_blank">
    <img src="./assets/sthira_animation.gif" alt="Sthira">
  </a>

</font>

<font size="3">

## Getting Started

### Pre-requisites

* Ensure that you have `Node.js` and `npm` installed on your machine.
* Ensure that you have `Python 3.8` and `pip` installed on your machine.
* Make sure you have `FastAPI` and `Uvicorn` installed


### Installation

1. Clone the repository

    ```bash
    git clone https://github.com/Vss4969/sthira.git
    ```

2.  Run backend service
    ```bash
    cd backend
    ```
    Follow the [README.md](./backend/README.md)

3. Run frontend service
    ```bash
    cd frontend
    npm install
    ```
    Follow the [README.md](./frontend/README.md)

## Overview

The Tech-Stack used in this application is:

- **ReactJS** for the frontend
- **FastAPI** for the backend
- **MongoDB** for the database

<br>

The application can be accesses through this [Link](http://localhost:81/). Backend API Documentation can be found [Here](http://localhost:8001/docs).

### User Interface Screens (Click to Open)

  <a href="./assets/repo_analyser.svg" target="_blank">
    <img src="./assets/repo_analyser.svg" alt="Repo Analyzer">
  </a>

### Code Directory Structure

The code for this application is present in the `sthira` folder. It is divided into `frontend` and `backend` folders. The frontend code is in `ReactJS` while the `backend` code is in `FastAPI`. The directory structure is shown below:

```
sthira
  |
  |- frontend
  |    |- public             -> Index, Media and Assets
  |    |- src
  |         |- pages         -> User and Team pages
  |         |- components    -> React components
  |         |- service       -> API points
  |         |- index.js      -> Main page render
  |         |- App.js        -> Routes
  |
  |- backend
  |    |- config        -> Constants and Connections
  |    |- metrics       -> Metrics Calculators
  |    |- routers       -> API Endpoints
  |    |- services      -> GitHub/DB/OpenAI Integrations
  |    |- main.py       -> Main entry point
  |    |- Dockerfile    -> Docker Image File
  |
  |- README.md           -> Documentation (📍You are here)
```


</font>