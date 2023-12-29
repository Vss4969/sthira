import React from "react";
import { Button } from "@mui/material";
import config from "../../config";


export default function Logout() {
    const apiUrl = config.apiUrl;
    const handleLogout = async () => {
        try {  
            localStorage.setItem('userData', false);
            // document.cookie = "cookieName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            window.location.href = `${apiUrl}/github/logout`;
            
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Button onClick={handleLogout} variant="contained" color="error">
            Logout
        </Button>
    );
}