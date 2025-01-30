import React, { useState, useEffect } from 'react';
import { 
  Container, Box, Typography, Grid, Card, CardContent,
  Tab, Tabs, Button, LinearProgress, List, ListItem,
  ListItemText, ListItemIcon, Divider 
} from '@mui/material';
import {
  TrendingUp, TrendingDown, CheckCircle, Warning,
  Timeline, School, Assessment, Schedule
} from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { analyticsService } from '../services/analyticsService';
import { aiService } from '../services/aiService';
import { useApp } from '../context/AppContext';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [analytics, setAnalytics] = useState(null);
  const [studyPlan, setStudyPlan] = useState(null);
  const { showNotification } = useApp();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const history = JSON.parse(localStorage.getItem('ieltsHistory') || '[]');
      const analyticsData = analyticsService.generateInsights(history);
      setAnalytics(analyticsData);

      const studyPlanData = await aiService.generateStudyPlan(history);
      setStudyPlan(studyPlanData);
    } catch (error) {
      showNotification('Error loading dashboard data', 'error');
    }
  };

  const getChartData = (skill) => {
    if (!analytics) return null;

    const labels = [...Array(10)].map((_, i) => `Session ${i + 1}`);
    const datasets = Object.entries(analytics.progress.progressBySkill[skill])
      .map(([criterion, scores]) => ({
        label: criterion.charAt(0).toUpperCase() + criterion.slice(1),
        data: scores,
        borderColor: getRandomColor(),
        tension: 0.1
      }));

    return { labels, datasets };
  };

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const renderProgressChart = (skill) => {
    const chartData = getChartData(skill);
    if (!chartData) return null;

    return (
      <Box sx={{ height: 300, mb: 4 }}>
        <Line
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                max: 100
              }
            },
            plugins: {
              legend: {
                position: 'bottom'
              }
            }
          }}
        />
      </Box>
    );
  };

  const renderInsights = () => {
    if (!analytics?.insights.length) return null;

    return (
      <List>
        {analytics.insights.map((insight, index) => (
          <ListItem key={index}>
            <ListItemIcon>
              {insight.type === 'improvement' ? (
                <TrendingUp color="success" />
              ) : (
                <TrendingDown color="error" />
              )}
            </ListItemIcon>
            <ListItemText primary={insight.message} />
          </ListItem>
        ))}
      </List>
    );
  };

  const renderRecommendations = () => {
    if (!analytics?.recommendations.length) return null;

    return (
      <List>
        {analytics.recommendations.map((rec, index) => (
          <ListItem key={index}>
            <ListItemIcon>
              <School color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary={`${rec.skill.toUpperCase()} - ${rec.criterion}`}
              secondary={rec.recommendation}
            />
          </ListItem>
        ))}
      </List>
    );
  };

  const renderStudyPlan = () => {
    if (!studyPlan) return null;

    return (
      <List>
        {studyPlan.tasks.map((task, index) => (
          <ListItem key={index}>
            <ListItemIcon>
              <Schedule color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary={task.title}
              secondary={
                <>
                  <Typography variant="body2" color="text.secondary">
                    {task.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Duration: {task.duration} minutes
                  </Typography>
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    );
  };

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Progress Dashboard
        </Typography>

        <Tabs 
          value={selectedTab} 
          onChange={(e, newValue) => setSelectedTab(newValue)}
          sx={{ mb: 3 }}
        >
          <Tab label="Overview" />
          <Tab label="Reading" />
          <Tab label="Writing" />
          <Tab label="Speaking" />
        </Tabs>

        {selectedTab === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recent Insights
                  </Typography>
                  {renderInsights()}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recommendations
                  </Typography>
                  {renderRecommendations()}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Personalized Study Plan
                  </Typography>
                  {renderStudyPlan()}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {selectedTab === 1 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Reading Progress
              </Typography>
              {renderProgressChart('reading')}
            </CardContent>
          </Card>
        )}

        {selectedTab === 2 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Writing Progress
              </Typography>
              {renderProgressChart('writing')}
            </CardContent>
          </Card>
        )}

        {selectedTab === 3 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Speaking Progress
              </Typography>
              {renderProgressChart('speaking')}
            </CardContent>
          </Card>
        )}
      </Box>
    </Container>
  );
};

export default Dashboard;
