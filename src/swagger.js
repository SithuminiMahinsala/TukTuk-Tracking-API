import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TukTuk Tracking API',
      version: '1.0.0',
      description: 'Real-Time Three-Wheeler Tracking & Movement Logging System for Sri Lanka Police',
    },
    servers: [
      {
        url: 'http://tuktuk-production.eba-xpwv48ku.ap-southeast-1.elasticbeanstalk.com/',
        description: 'Production server',
      },
      {
        url: 'http://localhost:5000',
        description: 'Local server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.js'],
};

export default swaggerJsdoc(options);