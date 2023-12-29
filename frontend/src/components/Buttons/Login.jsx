import React from "react";
import { Button } from "@mui/material";
import config from "../../config";


export default function Login() {
    const apiUrl = config.apiUrl;
    const login = async () => {
        try {
            window.location.href = `${apiUrl}/github/login`;
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Button
            variant="contained"
            color="primary"
            onClick={login}
            style={{ backgroundColor: '#0065C1', color: 'white', marginTop: '10px' }}
            endIcon={<GitHubIcon />}  // Add GitHub icon to the button
        >
            Login with GitHub
        </Button>
    );
}