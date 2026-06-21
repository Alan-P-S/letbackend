import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Node.js Express API with Swagger',
      version: '1.0.0',
      description: 'A simple Express API application documented with Swagger',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  // Path to the API docs (where your route files are located)
  apis: ['./routes/*.js', './app.js'], 
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
