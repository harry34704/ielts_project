const client = require('prom-client');
const express = require('express');

// Create a Registry to register the metrics
const register = new client.Registry();

// Add a default label which is added to all metrics
client.collectDefaultMetrics({
  app: 'ielts-practice-api',
  prefix: 'node_',
  timeout: 10000,
  register
});

// Create custom metrics
const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 0.5, 1, 5]
});

const totalRequests = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'code']
});

register.registerMetric(httpRequestDurationMicroseconds);
register.registerMetric(totalRequests);

// Middleware to track request duration and count
const metricsMiddleware = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    httpRequestDurationMicroseconds
      .labels(req.method, req.route?.path || req.path, res.statusCode)
      .observe(duration / 1000);
    
    totalRequests
      .labels(req.method, req.route?.path || req.path, res.statusCode)
      .inc();
  });
  
  next();
};

// Metrics endpoint
const metricsRouter = express.Router();
metricsRouter.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
});

module.exports = {
  metricsMiddleware,
  metricsRouter
}; 