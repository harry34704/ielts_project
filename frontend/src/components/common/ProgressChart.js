import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Radar, ResponsiveContainer, Tooltip
} from 'recharts';

const ProgressChart = ({ data, title }) => {
  const formatData = (inputData) => {
    return Object.entries(inputData).map(([key, value]) => ({
      subject: key.charAt(0).toUpperCase() + key.slice(1),
      score: value,
      fullMark: 100
    }));
  };

  return (
    <Card>
      <CardContent>
        {title && (
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
        )}
        <Box sx={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <RadarChart data={formatData(data)}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar
                name="Score"
                dataKey="score"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProgressChart; 