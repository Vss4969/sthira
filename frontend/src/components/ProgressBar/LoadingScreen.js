import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

const LoadingScreen = ({ progress }) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
      }}
    >
      <CircularProgress variant="determinate" value={progress} />
      <div style={{ marginLeft: 10 }}>
        <Typography component={'span'} variant="caption" color="text.secondary">
          {`${Math.round(progress)}%`}
        </Typography>
      </div>
    </div>
  );
};

export default LoadingScreen;
