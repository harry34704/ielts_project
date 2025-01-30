import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Box,
  LinearProgress
} from '@mui/material';
import {
  Schedule,
  CheckCircle,
  PlayArrow,
  MenuBook,
  Create,
  RecordVoiceOver
} from '@mui/icons-material';

const StudyPlanCard = ({ plan, onStartTask }) => {
  const getTaskIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'reading':
        return <MenuBook />;
      case 'writing':
        return <Create />;
      case 'speaking':
        return <RecordVoiceOver />;
      default:
        return <Schedule />;
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 75) return 'success';
    if (progress >= 50) return 'warning';
    return 'error';
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">
            Today's Study Plan
          </Typography>
          <Chip
            icon={<Schedule />}
            label={`${plan.totalDuration} minutes`}
            color="primary"
            variant="outlined"
          />
        </Box>

        <List>
          {plan.tasks.map((task, index) => (
            <ListItem
              key={index}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                mb: 1,
                '&:last-child': { mb: 0 }
              }}
            >
              <ListItemIcon>
                {getTaskIcon(task.type)}
              </ListItemIcon>
              <ListItemText
                primary={task.title}
                secondary={
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {task.description}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <Box sx={{ flex: 1, mr: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={task.progress || 0}
                          color={getProgressColor(task.progress || 0)}
                          sx={{ height: 6, borderRadius: 3 }}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {task.progress || 0}%
                      </Typography>
                    </Box>
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                {task.completed ? (
                  <IconButton edge="end" disabled>
                    <CheckCircle color="success" />
                  </IconButton>
                ) : (
                  <IconButton 
                    edge="end" 
                    color="primary"
                    onClick={() => onStartTask(task)}
                  >
                    <PlayArrow />
                  </IconButton>
                )}
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default StudyPlanCard; 