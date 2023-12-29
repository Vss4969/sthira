import axios from 'axios';
import config from "../config";

const API_URL = config.apiUrl;

export const GetTeams = async () => {
    try {
        const response = await axios.get(`${API_URL}/teams/my-teams`, {
            withCredentials: true,
        });
        return response.data["team_list"];
    } catch (error) {
        console.error(error);
        return false;
    }
}

export const GetTeamInfo = async (team) => {
    try {
        const response = await axios.get(`${API_URL}/teams/`, {
            params: {
                team_name: team,
            },
            withCredentials: true,
        });
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export const CreateTeam = async (teamName, teamMembers) => {
    try {
        const response = await axios.post(`${API_URL}/teams/`, {body: {
            "team_name": teamName,
            "members": teamMembers,
        }}, {
            withCredentials: true,
        });
        return response;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export const StartAnalysis = async (teamName) => {
    try {
        const response = await axios.post(`${API_URL}/teams/trigger`, {body: {
            "team_name": teamName
        }}, {
            withCredentials: true,
        });
        return response;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export const DeleteTeam = async (teamName) => {
    try {
        const response = await axios.delete(`${API_URL}/teams/`, {
            params: {
                team_name: teamName,
            },
            withCredentials: true,
        });
        console.log(response);
        return response;
    } catch (error) {
        console.error(error);
        return false;
    }
}
