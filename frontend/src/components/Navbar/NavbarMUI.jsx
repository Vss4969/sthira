import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { Paper } from "@mui/material";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Logout from "../Buttons/Logout";
import { Link } from "react-router-dom";
// import {

// } from '@fortawesome/free-solid-svg-icons';
const pageLinks = {
  'Marketplace': '',
  'Projects': '',
  'My Team': '/teams',
  'Home': 'http://localhost:80',
};
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // Get user data from local storage
  const userData = JSON.parse(localStorage.getItem('userData')) || {};
  const { avatar_url, login, followers, public_repos } = userData;

  const followersTooltip = `Github Followers: ${followers}`;
  const reposTooltip = `Public Repositories: ${public_repos}`;

  return (
    <AppBar position="static" style={{ backgroundColor: 'black' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>

          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              color: '#0065C1',
              textDecoration: 'none',
              fontSize: '25px'
            }}
          >
            Repo Analyser
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {Object.entries(pageLinks).map(([key, value]) => (
              <Button
                key={key}
                component={Link}
                to={value}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {key}
              </Button>
            ))}
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              color: '#0065C1',
              textDecoration: 'none',
              fontSize: '25px'
            }}
          >
            Analyser
          </Typography>
          
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {Object.entries(pageLinks).map(([key, value]) => (
              <Button
                key={key}
                component={Link}
                to={value}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {key}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {/* User information */}
              <Typography component={'span'} variant="body2" style={{ marginRight: '15px', color: 'white' }}>
                <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
                  {login}
                </Link>
              </Typography>
              <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
                <Avatar src={avatar_url} alt={login} style={{ marginRight: '15px', border: 'solid 2px #0065C1' }} />
              </Link>


              {/* Github Followers Tooltip */}
              <Tooltip title={followersTooltip} arrow>
                <Typography component={'span'} variant="body2" style={{ marginRight: '15px', color: 'white' }}>
                  <svg text="muted" aria-hidden="true" height="25" viewBox="0 0 16 16" version="1.1" width="25" data-view-component="true" className="octicon octicon-people" style={{ fill: '#6e5494' }}>
                    <path d="M2 5.5a3.5 3.5 0 1 1 5.898 2.549 5.508 5.508 0 0 1 3.034 4.084.75.75 0 1 1-1.482.235 4 4 0 0 0-7.9 0 .75.75 0 0 1-1.482-.236A5.507 5.507 0 0 1 3.102 8.05 3.493 3.493 0 0 1 2 5.5ZM11 4a3.001 3.001 0 0 1 2.22 5.018 5.01 5.01 0 0 1 2.56 3.012.749.749 0 0 1-.885.954.752.752 0 0 1-.549-.514 3.507 3.507 0 0 0-2.522-2.372.75.75 0 0 1-.574-.73v-.352a.75.75 0 0 1 .416-.672A1.5 1.5 0 0 0 11 5.5.75.75 0 0 1 11 4Zm-5.5-.5a2 2 0 1 0-.001 3.999A2 2 0 0 0 5.5 3.5Z"></path>
                  </svg>
                  {followers}
                </Typography>
              </Tooltip>

              {/* Public Repositories Tooltip */}
              <Tooltip title={reposTooltip} arrow>
                <Typography component={'span'} variant="body2" style={{ marginRight: '15px', color: 'white' }}>
                  <svg aria-hidden="true" height="23" viewBox="0 0 16 16" version="1.1" width="23" data-view-component="true" className="octicon octicon-repo mr-1 color-fg-muted" style={{ fill: 'green' }}>
                    <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"></path>
                  </svg>
                  {public_repos}
                </Typography>
              </Tooltip>
              <Logout />
            </div>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
