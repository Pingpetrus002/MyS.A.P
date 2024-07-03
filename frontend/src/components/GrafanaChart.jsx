import React from 'react';
import { Box, Typography } from '@mui/material';

const GrafanaChart = ({ src, title }) => {
    return (
        <Box sx={{ marginBottom: '2rem' }}>
            <Typography variant="h6" gutterBottom align="center">{title}</Typography>
            <iframe
                src={src}
                width="100%"
                height="400"
                frameBorder="0"
                title={title}
                style={{ borderRadius: '8px', border: '1px solid #ddd' }}
            ></iframe>
        </Box>
    );
};

export default GrafanaChart;
