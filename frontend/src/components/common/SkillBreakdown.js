import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  LinearProgress,
  Tooltip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Info,
  Star,
  StarHalf,
  StarOutline
} from '@mui/icons-material';

const SkillBreakdown = ({ skillData, title }) => {
  const getSkillLevel = (score) => {
    if (score >= 80) return 'Advanced';
    if (score >= 60) return 'Intermediate';
    return 'Beginner';
  };

  const getSkillStars = (score) => {
    const stars = [];
    const fullStars = Math.floor(score / 20);
    const hasHalfStar = (score % 20) >= 10;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} color="primary" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<StarHalf key={i} color="primary" />);
      } else {
        stars.push(<StarOutline key={i} color="primary" />);
      }
    }

    return stars;
  };

  const renderTrend = (trend) => {
    if (!trend) return null;

    return trend > 0 ? (
      <TrendingUp color="success" sx={{ ml: 1 }} />
    ) : (
      <TrendingDown color="error" sx={{ ml: 1 }} />
    );
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6">{title}</Typography>
          <Tooltip title="Skill breakdown based on recent performance">
            <IconButton size="small">
              <Info />
            </IconButton>
          </Tooltip>
        </Box>

        <Grid container spacing={3}>
          {Object.entries(skillData.scores).map(([criterion, score]) => (
            <Grid item xs={12} md={6} key={criterion}>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle1">
                    {criterion.charAt(0).toUpperCase() + criterion.slice(1)}
                  </Typography>
                  {renderTrend(skillData.trends?.[criterion])}
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  {getSkillStars(score)}
                </Box>

                <LinearProgress
                  variant="determinate"
                  value={score}
                  color={score >= 80 ? 'success' : score >= 60 ? 'warning' : 'error'}
                  sx={{ height: 8, borderRadius: 4 }}
                />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {getSkillLevel(score)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {score}%
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>

        {skillData.recommendations && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Improvement Suggestions
            </Typography>
            <List dense>
              {skillData.recommendations.map((rec, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <Info color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={rec} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default SkillBreakdown; 