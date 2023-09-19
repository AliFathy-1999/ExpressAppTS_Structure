import components from "../api-docs/components";
import paths from "../api-docs/paths/index";
import swaggerJSDoc from 'swagger-jsdoc';
import security from '../api-docs/components/security';

const swaggerDefinition = {
  openapi: '3.0.0', 
  info: {
    title: 'My API',
    version: '1.0.0', 
    description: 'Documentation for my API',
    contact: {
        name: "Ali Ahmed", 
        email: "aliahmedfathi37@gmail.com", 
      },
  },
  servers: [
    {
      url: "http://localhost:4000/api/v1/",
    },
  ],
  components: {
    securitySchemes: components.security,
    schemas: {
      User : components.User,
    },
  },
    paths
};
  
  

const options = {
  swaggerDefinition,
  apis: ['../routes/*.ts'], 
  description: 'Development server',
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
