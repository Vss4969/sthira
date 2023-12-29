import React, { useState } from 'react';
import { Autocomplete, Chip, Button, Divider, Typography, Box, TextField } from '@mui/material';

const ListRepos = ({ userStats, userRepos, handleCheckboxChange, handleConfirmRepos }) => {
  const [selectedSearchRepo, setSelectedSearchRepo] = useState(null);

  const renderRepoChips = (repos, selected) => {
    return repos?.map((repo) => (
      <Chip
        key={repo?.id}
        label={repo?.name}
        avatar={<img src={repo?.owner.avatar_url} alt="Logo" width="20" height="20" />}
        onClick={() => handleCheckboxChange(repo?.id)}
        onDelete={selected ? () => handleCheckboxChange(repo?.id) : undefined}
        color={selected ? 'primary' : 'default'}
        sx={{
          margin: '4px',
          cursor: 'pointer',
          ...(selected
            ? {
                '& .MuiChip-deleteIcon': {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                },
              }
            : {}),
        }}
      />
    ));
  };

  const handleSearchRepoChange = (_, value) => {
    setSelectedSearchRepo(value);
  };

  const handleSearchRepoSelect = (_, newValue) => {
    if (newValue) {
      // Check if the repository is not already in the selected list
      if (!userRepos?.includes(newValue.id)) {
        // Add the repository to the selected list
        handleCheckboxChange(newValue.id);
      }
      // Clear the selected search repository
      setSelectedSearchRepo(null);
    }
  };
  

  return (
    <>
      <Typography component={'span'} variant="h5">Select Repos</Typography>
      {/* <Autocomplete
        id="search-repos"
        options={userStats.github_repos || []}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => (
          <TextField {...params} label="Search Repos" margin="normal" variant="outlined" fullWidth />
        )}
        onChange={handleSearchRepoChange}
        value={selectedSearchRepo}
        onSelect={handleSearchRepoSelect}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        renderOption={(props, option) => (
          <li {...props}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img src={option.owner.avatar_url} alt="Logo" width="20" height="20" style={{ marginRight: '8px' }} />
              {option.name}
            </div>
          </li>
        )}
      /> */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 2 }}>
        {renderRepoChips(userStats.github_repos.filter((repo) => !userRepos.includes(repo.id)), false)}
      </Box>
      <Divider />
      <Typography component={'span'} variant="h5">Selected Repos</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 2 }}>
        {renderRepoChips(userStats.github_repos.filter((repo) => userRepos.includes(repo.id)), true)}
      </Box>
      <Button onClick={handleConfirmRepos} variant="contained" color="primary">
        Confirm Repos
      </Button>
    </>
  );
};

export default ListRepos;