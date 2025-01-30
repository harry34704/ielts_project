const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'IELTS Practice API',
      version: '1.0.0',
      description: 'API documentation for IELTS Practice application',
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Result: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: ['reading', 'writing', 'speaking'],
            },
            scores: {
              type: 'object',
              additionalProperties: {
                type: 'number',
              },
            },
            feedback: {
              type: 'string',
            },
            detailedAnalysis: {
              type: 'object',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Task: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: ['reading', 'writing', 'speaking'],
            },
            title: {
              type: 'string',
            },
            description: {
              type: 'string',
            },
            level: {
              type: 'string',
              enum: ['beginner', 'intermediate', 'advanced'],
            },
            timeLimit: {
              type: 'number',
            },
            content: {
              type: 'object',
            },
          },
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./routes/*.js'], // Path to the API routes
};

module.exports = swaggerJsdoc(options); 