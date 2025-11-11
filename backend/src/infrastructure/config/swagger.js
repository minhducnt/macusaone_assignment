import swaggerJSDoc from 'swagger-jsdoc';
import { config } from './config.js';

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'MERN Authentication API',
    version: '1.0.0',
    description: 'A comprehensive authentication API built with Node.js, Express, and MongoDB',
    contact: {
      name: 'API Support',
      email: 'support@example.com'
    },
    license: {
      name: 'ISC',
      url: 'https://opensource.org/licenses/ISC'
    }
  },
  servers: [
    {
      url: `http://localhost:${config.PORT}/api/v1`,
      description: 'Development server (v1)'
    },
    {
      url: `${config.CLIENT_URL}/api/v1`,
      description: 'Production server (v1)'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Auto-generated MongoDB ObjectId'
          },
          name: {
            type: 'string',
            minLength: 2,
            maxLength: 50,
            description: 'User full name'
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'User email address'
          },
          role: {
            type: 'string',
            enum: ['admin', 'manager', 'staff'],
            description: 'User role'
          },
          isEmailVerified: {
            type: 'boolean',
            description: 'Email verification status'
          },
          isActive: {
            type: 'boolean',
            description: 'Account active status'
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Account creation timestamp'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Last update timestamp'
          }
        },
        required: ['id', 'name', 'email', 'role', 'isEmailVerified', 'isActive']
      },
      AuthResponse: {
        type: 'object',
        properties: {
          user: {
            $ref: '#/components/schemas/User'
          },
          tokens: {
            type: 'object',
            properties: {
              accessToken: {
                type: 'string',
                description: 'JWT access token'
              },
              refreshToken: {
                type: 'string',
                description: 'JWT refresh token'
              },
              tokenType: {
                type: 'string',
                example: 'Bearer'
              }
            },
            required: ['accessToken', 'refreshToken', 'tokenType']
          }
        },
        required: ['user', 'tokens']
      },
      Error: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false
          },
          message: {
            type: 'string',
            description: 'Error message'
          },
          errors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                field: {
                  type: 'string',
                  description: 'Field name that caused the error'
                },
                message: {
                  type: 'string',
                  description: 'Validation error message'
                }
              }
            }
          }
        },
        required: ['success', 'message']
      },
      RegisterRequest: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            format: 'email',
            description: 'User email address'
          },
          password: {
            type: 'string',
            minLength: 8,
            description: 'User password'
          },
          firstName: {
            type: 'string',
            minLength: 1,
            description: 'User first name'
          },
          lastName: {
            type: 'string',
            minLength: 1,
            description: 'User last name'
          },
          role: {
            type: 'string',
            enum: ['admin', 'manager', 'staff'],
            default: 'staff',
            description: 'User role'
          }
        },
        required: ['email', 'password', 'firstName', 'lastName']
      },
      LoginRequest: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            format: 'email',
            description: 'User email address'
          },
          password: {
            type: 'string',
            description: 'User password'
          }
        },
        required: ['email', 'password']
      },
      UpdateProfileRequest: {
        type: 'object',
        properties: {
          firstName: {
            type: 'string',
            minLength: 1,
            description: 'User first name'
          },
          lastName: {
            type: 'string',
            minLength: 1,
            description: 'User last name'
          }
        }
      },
      UserStats: {
        type: 'object',
        properties: {
          totalUsers: {
            type: 'integer',
            description: 'Total number of users'
          },
          activeUsers: {
            type: 'integer',
            description: 'Number of active users'
          },
          verifiedUsers: {
            type: 'integer',
            description: 'Number of email-verified users'
          },
          usersByRole: {
            type: 'object',
            description: 'Users grouped by role'
          },
          recentRegistrations: {
            type: 'integer',
            description: 'Recent registrations (last 30 days)'
          },
          verificationRate: {
            type: 'number',
            description: 'Email verification rate percentage'
          }
        }
      },
      Pagination: {
        type: 'object',
        properties: {
          page: {
            type: 'integer',
            description: 'Current page number'
          },
          limit: {
            type: 'integer',
            description: 'Items per page'
          },
          total: {
            type: 'integer',
            description: 'Total number of items'
          },
          totalPages: {
            type: 'integer',
            description: 'Total number of pages'
          }
        }
      },
      CreateUserRequest: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            format: 'email',
            description: 'User email address'
          },
          password: {
            type: 'string',
            minLength: 8,
            description: 'User password'
          },
          firstName: {
            type: 'string',
            minLength: 1,
            description: 'User first name'
          },
          lastName: {
            type: 'string',
            minLength: 1,
            description: 'User last name'
          },
          role: {
            type: 'string',
            enum: ['admin', 'manager', 'staff'],
            default: 'staff',
            description: 'User role'
          }
        },
        required: ['email', 'password', 'firstName', 'lastName']
      },
      UpdateUserRequest: {
        type: 'object',
        properties: {
          firstName: {
            type: 'string',
            minLength: 1,
            description: 'User first name'
          },
          lastName: {
            type: 'string',
            minLength: 1,
            description: 'User last name'
          },
          role: {
            type: 'string',
            enum: ['admin', 'manager', 'staff'],
            description: 'User role'
          },
          isActive: {
            type: 'boolean',
            description: 'Account active status'
          }
        }
      },
      File: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Auto-generated file ID'
          },
          filename: {
            type: 'string',
            description: 'Unique filename'
          },
          originalName: {
            type: 'string',
            description: 'Original uploaded filename'
          },
          mimeType: {
            type: 'string',
            description: 'File MIME type'
          },
          size: {
            type: 'integer',
            description: 'File size in bytes'
          },
          url: {
            type: 'string',
            description: 'File access URL'
          },
          isPublic: {
            type: 'boolean',
            description: 'Whether file is publicly accessible'
          },
          uploadedBy: {
            type: 'string',
            description: 'User ID who uploaded the file'
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Upload timestamp'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Last update timestamp'
          }
        },
        required: ['id', 'filename', 'originalName', 'mimeType', 'size', 'url', 'isPublic', 'uploadedBy']
      }
    }
  }
};

// Swagger options
const options = {
  swaggerDefinition,
  apis: [
    './src/infrastructure/routes/auth-routes.js',
    './src/infrastructure/routes/user-routes.js',
    './src/infrastructure/routes/file-routes.js',
    './src/infrastructure/controllers/*.js'
  ]
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
