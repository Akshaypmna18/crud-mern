const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CRUD MERN API",
      version: "1.0.0",
      description:
        "A comprehensive CRUD API built with Node.js, Express, and MongoDB",
      contact: {
        name: "API Support",
        email: "support@example.com",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development server",
      },
      {
        url: "https://your-production-url.com",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Product: {
          type: "object",
          required: ["name", "quantity", "price", "image"],
          properties: {
            _id: {
              type: "string",
              description: "Product ID",
              example: "507f1f77bcf86cd799439011",
            },
            name: {
              type: "string",
              description: "Product name",
              minLength: 2,
              maxLength: 100,
              example: "iPhone 15 Pro",
            },
            quantity: {
              type: "integer",
              description: "Product quantity",
              minimum: 0,
              maximum: 10000,
              example: 50,
            },
            price: {
              type: "number",
              description: "Product price",
              minimum: 0,
              maximum: 999999.99,
              example: 999.99,
            },
            image: {
              type: "string",
              description: "Product image URL",
              format: "uri",
              example: "https://example.com/image.jpg",
            },
            totalValue: {
              type: "number",
              description: "Total value (price × quantity)",
              example: 49999.5,
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Creation timestamp",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Last update timestamp",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "Validation failed",
            },
            errors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  field: {
                    type: "string",
                    example: "name",
                  },
                  message: {
                    type: "string",
                    example: "Name is required",
                  },
                },
              },
            },
            requestId: {
              type: "string",
              example: "req_123456",
            },
          },
        },
        Success: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              example: "Operation successful",
            },
            data: {
              type: "object",
            },
          },
        },
      },
    },
  },
  apis: ["./routes/*.js", "./controllers/*.js"], // Path to the API files
};

const specs = swaggerJSDoc(options);

module.exports = {
  swaggerUi,
  specs,
};
