import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API documentation for kubsau-tracker server',
    },
    host: 'localhost:3000',
    basePath: '/',
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development Server',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/routes/swagger/*.yaml'],
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerSpec };
