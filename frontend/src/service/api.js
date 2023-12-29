// api.js
import axios from 'axios';
import config from "../config";

const API_URL = config.apiUrl;
export const CheckLogin = async () => {
	try {
		const response = await axios.get(`${API_URL}`, {
			withCredentials: true,
		});
		console.log(response.data);
		if (response.data.login === "Authenticated") {
			return response.data.user_data;
		}
		return {};
	} catch (error) {
		console.error(error);
		return false;
	}
};

export const GetUserStats = async () => {
	try {
		const response = await axios.get(`${API_URL}/users`, {
			withCredentials: true,
		});
		// console.log(response.data.user_data)
		return response.data.user_data;
	} catch (error) {
		console.error(error);
		return false;
	}
};

export const StartAnalysis = async () => {
	try {
		const response = await axios.post(
			`${API_URL}/users/trigger`,
			{},
			{
				withCredentials: true,
			}
		);
		console.log(response);
		return response;
	} catch (error) {
		console.error(error);
		return false;
	}
};

export const GetAnalysisProgress = async () => {
	try {
		const response = await axios.get(`${API_URL}/users/progress`, {
			withCredentials: true,
		});
		return response.data.progress;
	} catch (error) {
		console.error(error);
		return false;
	}
};

export const Logout = async () => {
	try {
		const response = await axios.get(`${API_URL}/github/logout`);
		console.log(response.data);
		return response.data;
	} catch (error) {
		console.error(error);
		return false;
	}
};

export const GetRepos = async () => {
	try {
		const response = await axios.get(`${API_URL}/users/github/repositories`, {
			withCredentials: true,
		});
		console.log(response.data);
		return response.data.github_repositories;
	} catch (error) {
		console.error(error);
		return false;
	}
};

export const SetRepos = async (repoList) => {
	try {
		const response = await axios.post(
			`${API_URL}/users/repositories`,
			repoList,
			{
				withCredentials: true,
			}
		);
		console.log(response);
		return response;
	} catch (error) {
		console.error(error);
		return false;
	}
};

export const ResetRepos = async () => {
  try {
    const response = await axios.patch(`${API_URL}/users/reset`, {}, {
        withCredentials: true
    });
    console.log(response)
    return response;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export const GetUserStatus = async () => {
  try {
    const response = await axios.get(`${API_URL}/users/status`, {
      withCredentials: true,
    });
    console.log(response.data.status)
    if(response.data.status === "Completed"){
      return true;
    }
    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
}

// export const GetSelectedRepos = async () => {
//   try {
//     const response = await axios.get(`${API_URL}/users/user/repositories`, {
//       withCredentials: true,
//     });
//     console.log(response.data.user_repositories)
//     return response.data.user_repositories;
//   } catch (error) {
//     console.error(error);
//     return false;
//   }
// }
