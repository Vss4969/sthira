import React, { useState, useEffect } from 'react';
import { Button, Typography, Container, Paper, Grid, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Chip, createTheme, ThemeProvider, Collapse, CssBaseline } from '@mui/material';
import { GetTeams, GetTeamInfo, CreateTeam, StartAnalysis, DeleteTeam } from '../service/teamsapi';
import Metrics from '../components/Metrics/Metrics';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { blue, red } from '@mui/material/colors';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import DeleteIcon from '@mui/icons-material/Delete';
import Logout from '../components/Buttons/Logout';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import ResponsiveAppBar from '../components/Navbar/NavbarMUI';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: blue[800],
    },
    error: {
      main: red[500],
    },
  },
});

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [teamInfo, setTeamInfo] = useState([
    {
      "team_name": "Bit - Buddies",
      "team_members": [
        "Vss4969",
        "chiru4969"
      ],
      "status": "Completed",
      "metrics": {
        "project_descriptions": "An Online Restaurant Management System based on Servlets, JDBC, and MySQL. The project includes features such as authentication and authorization, menu management, shopping cart, order management, and user profile maintenance. It is implemented using Java, JavaServer Pages (JSP), HTML, CSS, and MySQL.\nThis repository contains code for a personal website with information about the owner, including education, hobbies, and contact information. There is also an HTML form for sending a message via email.",
        "directory_structure": "The file and folder naming convention in the directory structure appears to be consistent and clear. The code modularization seems well-organized, with separate folders for different types of files (e.g., classes, media, snapshots). The overall structure does not appear to be too simple or disordered.\nThe file and folder naming convention in this directory structure appears to be simple and straightforward, following standard naming conventions. The code modularization is not evident from the directory structure alone, as it does not provide information about the organization of code files into modules or components. Overall, the structure seems ordered and well-maintained, with descriptive file names and logical categorization.",
        "code_quality_score": 82.5,
        "code_quality_style": "The code appears to be a web-based restaurant management system implemented in Java using Servlets, JSP, HTML, CSS, and MySQL. It includes features such as authentication, menu management, shopping cart, order management, user profile maintenance, cart management, and payment gateway. The code is well-structured and follows coding conventions.\nThe code quality is moderate. There are some unnecessary comments and inconsistent formatting, but overall the code is clear and readable.",
        "languages_used": {
          "Java": 56748,
          "CSS": 8674,
          "HTML": 3037
        },
        "stars": 1,
        "forks": 0,
        "branches": "Only Master/Main branch Exists\nOnly Master/Main branch Exists",
        "commit_names": "\"The commits seem to be on track with the project description as the initial commit indicates the start of the project, followed by the necessary updates and additions such as project delivery and README updates.\"\n\"The quality of the commits is inconsistent. While some commits involve updating the README.md file, others involve adding and deleting directories and files. There is also a mention of adding a wiki link to IIT Dharwad, which is not directly related to the project description.\"",
        "commit_rate": 3.75,
        "code_rate": 1506.5,
        "percent_contribution": 99.02912621359224,
        "readme_file_quality": "\"The readme file provides a comprehensive description of the project, including all the implemented features, supported languages, prerequisites, and even includes snapshots for reference.\"\n\"The quality of the readme file is poor as it lacks organization, has unnecessary information, and includes unprofessional language.\"",
        "followers": 7,
        "number_of_repos": 22
      }
    }
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamMembers, setNewTeamMembers] = useState([]);
  const [newMember, setNewMember] = useState('');

  const [expandedTeam, setExpandedTeam] = useState(false);

  const handleExpand = (teamName) => {
    setExpandedTeam(expandedTeam === teamName ? false : teamName);
  };

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setNewTeamName('');
    setNewTeamMembers([]);
    setNewMember('');
  };

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const responseTeams = await GetTeams();
        setTeams(responseTeams);
        setTeamInfo([
          {
            "team_name": "Bit - Buddies",
            "team_members": [
              "Vss4969",
              "chiru4969"
            ],
            "status": "Completed",
            "metrics": {
              "project_descriptions": "An Online Restaurant Management System based on Servlets, JDBC, and MySQL. The project includes features such as authentication and authorization, menu management, shopping cart, order management, and user profile maintenance. It is implemented using Java, JavaServer Pages (JSP), HTML, CSS, and MySQL.\nThis repository contains code for a personal website with information about the owner, including education, hobbies, and contact information. There is also an HTML form for sending a message via email.",
              "directory_structure": "The file and folder naming convention in the directory structure appears to be consistent and clear. The code modularization seems well-organized, with separate folders for different types of files (e.g., classes, media, snapshots). The overall structure does not appear to be too simple or disordered.\nThe file and folder naming convention in this directory structure appears to be simple and straightforward, following standard naming conventions. The code modularization is not evident from the directory structure alone, as it does not provide information about the organization of code files into modules or components. Overall, the structure seems ordered and well-maintained, with descriptive file names and logical categorization.",
              "code_quality_score": 82.5,
              "code_quality_style": "The code appears to be a web-based restaurant management system implemented in Java using Servlets, JSP, HTML, CSS, and MySQL. It includes features such as authentication, menu management, shopping cart, order management, user profile maintenance, cart management, and payment gateway. The code is well-structured and follows coding conventions.\nThe code quality is moderate. There are some unnecessary comments and inconsistent formatting, but overall the code is clear and readable.",
              "languages_used": {
                "Java": 56748,
                "CSS": 8674,
                "HTML": 3037
              },
              "stars": 1,
              "forks": 0,
              "branches": "Only Master/Main branch Exists\nOnly Master/Main branch Exists",
              "commit_names": "\"The commits seem to be on track with the project description as the initial commit indicates the start of the project, followed by the necessary updates and additions such as project delivery and README updates.\"\n\"The quality of the commits is inconsistent. While some commits involve updating the README.md file, others involve adding and deleting directories and files. There is also a mention of adding a wiki link to IIT Dharwad, which is not directly related to the project description.\"",
              "commit_rate": 3.75,
              "code_rate": 1506.5,
              "percent_contribution": 99.02912621359224,
              "readme_file_quality": "\"The readme file provides a comprehensive description of the project, including all the implemented features, supported languages, prerequisites, and even includes snapshots for reference.\"\n\"The quality of the readme file is poor as it lacks organization, has unnecessary information, and includes unprofessional language.\"",
              "followers": 7,
              "number_of_repos": 22
            }
          }
        ]);

        const infoPromises = responseTeams.map(async (team) => {
          const responseTeamInfo = await GetTeamInfo(team);
          setTeamInfo((prevTeamInfo) => [...prevTeamInfo, responseTeamInfo]);
        });

        await Promise.all(infoPromises);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTeams();
  }, []);

  const handleTeamAnalysis = (teamName) => {
    console.log(`Start analysis for ${teamName}`);
  };

  const handleCreateTeamSubmit = async () => {
    try {
      if (!newTeamName || newTeamMembers.length === 0) {
        toast.error('Please provide a team name and at least one user.');
        return;
      }

      const response = await CreateTeam(newTeamName, newTeamMembers);

      if (response.status === 200) {
        const responseAnalysis = await StartAnalysis(newTeamName);

        await new Promise((resolve) => setTimeout(resolve, 5000));

        const responseTeamInfo = await GetTeamInfo(newTeamName);
        setTeamInfo((prevTeamInfo) => [...prevTeamInfo, responseTeamInfo]);
        toast.success('Team created successfully!');
      } else {
        toast.error('Team creation failed!');
      }

      handleDialogClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddUser = () => {
    setNewTeamMembers((prevMembers) => [...prevMembers, newMember]);
    setNewMember('');
  };

  const handleRemoveUser = (index) => {
    setNewTeamMembers((prevMembers) => {
      const updatedMembers = [...prevMembers];
      updatedMembers.splice(index, 1);
      return updatedMembers;
    });
  };

  const handleDeleteTeam = async (teamName) => {
    try {
      const response = await DeleteTeam(teamName);

      if (response.status === 200) {
        const updatedTeams = teams.filter((team) => team !== teamName);
        setTeams(updatedTeams);

        // Fetch team info for the remaining teams
        const updatedTeamInfo = await Promise.all(
          updatedTeams.map(async (team) => GetTeamInfo(team))
        );

        setTeamInfo(updatedTeamInfo);
        toast.success(`Team "${teamName}" deleted successfully!`);
      } else {
        toast.error(`Failed to delete team "${teamName}"`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container component="main" maxWidth="lg">
        <ResponsiveAppBar />
        {/* <Navbar /> */}
        <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography component={'span'} variant="h3" style={{ textAlign: 'center', marginBottom: '10px' }}>
                Teams
              </Typography>
            </Grid>
            {teamInfo?.map((team) => (
              <Grid item xs={12} key={team.team_name}>
                <Card variant="outlined">
                  <CardContent>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Button
                        variant="contained"
                        onClick={() => handleExpand(team.team_name)}
                        style={{
                          textTransform: 'none',
                          backgroundColor: 'rgba(255, 255, 255, 0.10)',
                          borderRadius:
                            expandedTeam === team.team_name
                              ? '10px 10px 0 0'
                              : '10px 10px 10px 10px',
                          boxShadow: 'none',
                        }}
                      >
                        <Typography component={'span'} variant="body1" style={{ marginRight: '10px' }}>
                          {team.team_name}
                        </Typography>
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDeleteTeam(team.team_name)}
                        sx={{ borderRadius: '10px' }}
                      >
                        <DeleteIcon />
                      </Button>
                    </div>

                    <Collapse in={expandedTeam === team.team_name}>
                      {team.status === 'Completed' && <Metrics metric={team.metrics} />}
                    </Collapse>
                    <Typography component={'span'} variant="caption" style={{ marginTop: '10px' }}>
                      Team Members:
                      {team.team_members && team.team_members.length > 0 ? (
                        team.team_members.map((member, index) => (
                          <Chip
                            key={index}
                            label={member}
                            color="primary"
                            variant="outlined"
                            style={{
                              margin: '8px',
                            }}
                            onClick={() => { window.open(`https://github.com/${member}`, '_blank') }}
                          />
                        ))
                      ) : (
                        <span>No members</span>
                      )}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <br />
          <Button onClick={handleDialogOpen} variant="contained" color="primary">
            Create Team
          </Button>
          <Dialog open={isDialogOpen} onClose={handleDialogClose}>
            <DialogTitle>Create Team</DialogTitle>
            <DialogContent>
              <TextField
                label="Team Name"
                variant="outlined"
                fullWidth
                margin="normal"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
              />
              <Typography component={'span'}>Team Members:</Typography>
              {newTeamMembers.map((member, index) => (
                <Chip
                  key={index}
                  label={member}
                  onDelete={() => handleRemoveUser(index)}
                  color="primary"
                  variant="outlined"
                  style={{ marginRight: '8px', marginBottom: '8px' }}
                />
              ))}
              <TextField
                label="Add User"
                variant="outlined"
                fullWidth
                margin="normal"
                value={newMember}
                onChange={(e) => setNewMember(e.target.value)}
              />
              <Button onClick={handleAddUser} variant="contained" color="primary">
                Add User
              </Button>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose} color="error" variant="contained">
                Cancel
              </Button>
              <Button onClick={handleCreateTeamSubmit} color="primary" variant="contained">
                Submit
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </Container>
      <ToastContainer />
    </ThemeProvider>
  );
}