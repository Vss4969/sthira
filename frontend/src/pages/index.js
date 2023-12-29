import React, { useState, useEffect } from 'react';
import {
    Button, Checkbox, Container, CssBaseline, Grid, Paper, Typography, Collapse, Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { blue } from '@mui/material/colors';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingScreen from '../components/ProgressBar/LoadingScreen';
import Metrics from '../components/Metrics/Metrics';
import GitHubIcon from '@mui/icons-material/GitHub';
import { CheckLogin, GetRepos, SetRepos, GetUserStats, StartAnalysis, GetAnalysisProgress, ResetRepos, GetUserStatus } from '../service/api';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import ListRepos from '../components/ListRepos/ListRepos';
import Logout from '../components/Buttons/Logout';
import ResponsiveAppBar from '../components/Navbar/NavbarMUI';
import config from "../config";


const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: blue[800],
        },
    },
});
const apiUrl = config.apiUrl;


export default function Index() {
    const [userData, setUserData] = useState({});
    const [userStats, setUserStats] = useState({});
    const [repos, setRepos] = useState([]);
    const [userRepos, setUserRepos] = useState([]);
    const [analysisProgress, setAnalysisProgress] = useState(0);
    const [loading, setLoading] = useState(false);
    const [userStatus, setUserStatus] = useState(false);
    const [expandedRepo, setExpandedRepo] = useState(null);
    // State to manage the select repos dialog open/close
    const [isSelectReposDialogOpen, setSelectReposDialogOpen] = useState(false);

    // Function to handle opening the select repos dialog
    const handleOpenSelectReposDialog = () => {
        setSelectReposDialogOpen(true);
    };

    // Function to handle closing the select repos dialog
    const handleCloseSelectReposDialog = () => {
        setSelectReposDialogOpen(false);
    };

    const handleExpand = (repoId) => {
        setExpandedRepo((prev) => (prev === repoId ? null : repoId));
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Check if userData is available in local storage
                const storedUserData = localStorage.getItem('userData');
                // If userData is available in local storage, get its value
                if (Object.keys(userData).length === 0 && storedUserData && JSON.parse(storedUserData) !== false && Object.keys(JSON.parse(storedUserData)).length !== 0) {
                    // If userData is not in state but available in local storage, set it in state
                    setUserData(JSON.parse(storedUserData));
                } else if (Object.keys(userData).length === 0) {
                    // If userData is not in state and local storage, perform login
                    const loggedInUserData = await CheckLogin();
                    localStorage.setItem('userData', JSON.stringify(loggedInUserData));
                    setUserData(loggedInUserData);
                }

                // Fetch user stats if userData is available
                if (userData) {
                    console.log("User data:", userData);
                    const stats = await GetUserStats();
                    console.log("User stats:", stats);
                    setUserStats(stats);

                    // Fetch user status
                    const status = await GetUserStatus();
                    console.log(status);
                    setUserStatus(status);

                    // // Get user progress if analysis is in progress
                    // const progress = await GetAnalysisProgress();
                    // console.log(progress);
                    // if (progress !== -1){
                    //     setLoading(true);
                    //     const intervalId = setInterval(async () => {
                    //         const progress = await GetAnalysisProgress();

                    //         console.log(progress);
                    //         setAnalysisProgress(progress);
                    //         // setLoading(true);

                    //         if (progress === -1) {
                    //             clearInterval(intervalId);
                    //             setLoading(false);
                    //             // Fetch fresh user stats after analysis
                    //             const updatedStats = await GetUserStats();
                    //             console.log(updatedStats);
                    //             setUserStats(updatedStats);
                    //         }
                    //     }, 2000);
                    // }
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []); // Trigger when the component mounts



    // useEffect(() => {
    //     // Print whenever userRepos changes
    //     console.log('userRepos changed:', userStats);
    // }, [userStats]);

    const login = async () => {
        try {
            window.location.href = `${apiUrl}/github/login`;
        } catch (error) {
            console.error(error);
        }
    };

    // const logout = async () => {
    //     try {
    //         setUserData({});
    //         window.location.href = '${apiUrl}/github/logout';
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };

    const selectRepos = async () => {
        try {
            const repos = await GetRepos();
            setRepos(repos);
            console.log(repos);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCheckboxChange = (repoId) => {
        setUserRepos((prevUserRepos) => {
            if (prevUserRepos.includes(repoId)) {
                // If repoId is already in the list, remove it
                return prevUserRepos.filter((id) => id !== repoId);
            } else {
                // If repoId is not in the list, add it
                return [...prevUserRepos, repoId];
            }
        });
    };

    const handleConfirmRepos = async () => {
        if (userRepos.length === 0) {
            toast.error('Please select at least one repo to start analysis!');
        } else if (userRepos.length > 4) {
            toast.error('You can select up to 4 repos for analysis!');
        } else {
            // Set the repos
            try {
                const response = await SetRepos(userRepos);
                console.log(response);

                // Fetch fresh user stats after setting repos
                const updatedStats = await GetUserStats();
                console.log(updatedStats);
                setUserStats(updatedStats);
                // refresh the page
                window.location.reload();
            } catch (error) {
                console.error(error);
            }
            console.log('Start Analyzing with selected repos:', userRepos);
        }
    };

    const handleAnalysis = async () => {
        try {
            const response = await StartAnalysis();
            console.log(response);

            setLoading(true);
            const intervalId = setInterval(async () => {
                const progress = await GetAnalysisProgress();
                console.log(progress);
                setAnalysisProgress(progress);

                if (progress === -1) {
                    clearInterval(intervalId);
                    setLoading(false);
                    // Fetch fresh user stats after analysis
                    const updatedStats = await GetUserStats();
                    console.log(updatedStats);
                    setUserStats(updatedStats);
                    // refresh the page
                    window.location.reload();
                }
            }, 300); // Fetch progress every 1000 milliseconds (1 second)
        } catch (error) {
            console.error(error);
        }
    }

    const resetRepos = async () => {
        try {
            const response = await ResetRepos();
            console.log(response);

            // Fetch fresh user stats after resetting repos
            const updatedStats = await GetUserStats();
            console.log(updatedStats);
            setUserStats(updatedStats);
        } catch (error) {
            console.error(error);
        }
    }

    // print userprogress whenever it changes
    useEffect(() => {
        console.log('userProgress changed:', analysisProgress);
    }, [analysisProgress]);

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Container component="main" maxWidth="lg">
                {Object.keys(userData).length ? (
                    <div>
                        <ResponsiveAppBar />
                        <Paper elevation={3} style={{ padding: '20px', margin: '20px' }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    {userStats?.repositories && userStats.repositories.length ? (
                                        <div>
                                            {!userStatus && (
                                                <div>
                                                    <Typography component={'span'} variant="h4" style={{ margin: '15px 0px' }}>Selected Repos</Typography>
                                                    {userStats?.repositories.map((repo) => (
                                                        <div key={repo} style={{ margin: '10px 0px' }}>
                                                            <img
                                                                src={userStats?.github_repos.find(r => r.id === repo).owner.avatar_url}
                                                                alt="Logo"
                                                                width="20"
                                                                height="20"
                                                            />
                                                            <a
                                                                href={userStats?.github_repos.find(r => r.id === repo).html_url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                style={{ color: 'inherit', textDecoration: 'none', marginLeft: '10px' }}
                                                            >
                                                                {userStats?.github_repos.find(r => r.id === repo).name}
                                                            </a>
                                                        </div>
                                                    ))}
                                                    <Button onClick={handleAnalysis} variant="contained" color="primary">
                                                        Start Analysis
                                                    </Button>
                                                </div>
                                            )}
                                            {loading && <LoadingScreen progress={analysisProgress === -1 ? 0 : analysisProgress * 100} />}
                                            <Grid item xs={12}>
                                                {userStats?.metrics && userStats?.metrics_summary && userStats.status === 'Completed' && (
                                                    <Card variant="outlined">
                                                        <CardContent>
                                                            <Typography component={'span'}
                                                                variant="h3"
                                                                style={{
                                                                    backgroundColor: 'rgba(255, 255, 255, 0.10)',
                                                                    borderRadius: '10px 10px 0 0',
                                                                    padding: '10px 20px',
                                                                    boxShadow: 'none',
                                                                    display: 'inline-block',
                                                                    width: 'fit-content',
                                                                }}
                                                            >
                                                                Summarised Metrics
                                                            </Typography>
                                                            <Metrics metric={userStats.metrics_summary} />
                                                        </CardContent>
                                                    </Card>
                                                )}
                                            </Grid>
                                            {userStats?.metrics && Object.entries(userStats.metrics || {}).map(([key, metric]) => {
                                                const repo = userStats.github_repos.find((r) => r.id === parseInt(key));
                                                if (repo) {
                                                    return (
                                                        <Grid item xs={12} key={key}>
                                                            <Card variant="outlined">
                                                                <CardContent>
                                                                    <Button
                                                                        variant="contained"
                                                                        onClick={() => handleExpand(repo.id)}
                                                                        style={{ textTransform: 'none', backgroundColor: 'rgba(255, 255, 255, 0.10)', borderRadius: expandedRepo === repo.id ? '10px 10px 0 0' : '10px 10px 10px 10px', boxShadow: 'none' }} // Add textTransform to prevent capitalization
                                                                    >
                                                                        <Typography component={'span'} variant="body1" style={{ marginRight: '10px' }}>{repo.name}</Typography> {/* Use body1 for smaller text */}
                                                                    </Button>
                                                                    <Collapse in={expandedRepo === repo.id}>
                                                                        <Metrics metric={metric} />
                                                                    </Collapse>
                                                                </CardContent>
                                                            </Card>
                                                        </Grid>
                                                    );
                                                } else {
                                                    console.error(`Repository with id ${key} not found.`);
                                                    return null;
                                                }
                                            })}
                                            <br />
                                            <Button onClick={resetRepos} variant="contained" color="secondary">
                                                Reset Repos
                                            </Button>
                                        </div>
                                    ) : (
                                        <div>
                                            <Button onClick={handleOpenSelectReposDialog} variant="contained" color="primary">
                                                Select Repos
                                            </Button>
                                            <ToastContainer />
                                            {/* Dialog for selecting repos */}
                                            <Dialog open={isSelectReposDialogOpen} onClose={handleCloseSelectReposDialog} maxWidth="md" fullWidth>
                                                {/* <DialogTitle>
                                                <Typography component={'span'} variant="h3">Select Repos</Typography>
                                            </DialogTitle> */}
                                                <DialogContent>
                                                    <ListRepos
                                                        userStats={userStats}
                                                        userRepos={userRepos}
                                                        handleCheckboxChange={handleCheckboxChange}
                                                        handleConfirmRepos={handleConfirmRepos}
                                                    />
                                                </DialogContent>
                                                <DialogActions>
                                                    <Button onClick={handleCloseSelectReposDialog} color="primary">
                                                        Close
                                                    </Button>
                                                </DialogActions>
                                            </Dialog>
                                        </div>

                                    )}
                                </Grid>
                            </Grid>
                        </Paper>
                    </div>

                ) : (
                    <Paper elevation={3} style={{ padding: '20px', margin: '20px' }}>
                        <Grid container spacing={3} style={{ height: '100%', overflow: 'hidden' }}>
                            {/* Left side */}
                            <Grid item xs={6}>
                                <Paper
                                    elevation={3}
                                    style={{
                                        padding: '20px',
                                        marginTop: '20px',
                                        borderRadius: '10px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        height: '100%',
                                        backgroundColor: 'black',  // Set background color to black
                                        color: 'white',  // Set text color to white
                                        width: '80%',
                                        margin: 'auto',
                                    }}
                                >
                                    <Typography component={'span'} variant="h4" style={{ color: '#0065C1', marginBottom: '10px', fontWeight: 700 }}>
                                        Repo Analyser
                                    </Typography>
                                    <hr style={{ width: '80%', border: '1px solid #0065C1', margin: '10px 0' }} />
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={login}
                                        style={{ backgroundColor: '#0065C1', color: 'white', marginTop: '10px' }}
                                        endIcon={<GitHubIcon />}  // Add GitHub icon to the button
                                    >
                                        Login with GitHub
                                    </Button>
                                </Paper>
                            </Grid>
                            {/* Right side */}
                            <Grid item xs={6}>
                                <img
                                    src="https://prod-app.trumio.ai/assets/talent.819f69ca.png"
                                    alt="Sthira Logo"
                                    style={{ width: '100%', borderRadius: '10px' }}
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                )}
            </Container>
        </ThemeProvider>
    );
}
