/**
 * Validation Schemas
 * Joi schemas for request validation
 */
import Joi from 'joi';

// Ensure Joi is loaded properly
if (!Joi) {
  throw new Error('Joi library failed to load');
}

export const authSchemas = {
  register: Joi.object({
    email: Joi.string().email().required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
      }),
    password: Joi.string().min(8).required()
      .messages({
        'string.min': 'Password must be at least 8 characters long',
        'any.required': 'Password is required'
      }),
    firstName: Joi.string().trim().min(1).required()
      .messages({
        'string.min': 'First name cannot be empty',
        'any.required': 'First name is required'
      }),
    lastName: Joi.string().trim().min(1).required()
      .messages({
        'string.min': 'Last name cannot be empty',
        'any.required': 'Last name is required'
      }),
    role: Joi.string().valid('admin', 'manager', 'staff').default('staff')
      .messages({
        'any.only': 'Role must be one of: admin, manager, staff'
      })
  }),

  login: Joi.object({
    email: Joi.string().email().required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
      }),
    password: Joi.string().required()
      .messages({
        'any.required': 'Password is required'
      })
  }),

  verifyEmail: Joi.object({
    token: Joi.string().required()
      .messages({
        'any.required': 'Verification token is required'
      })
  }),

  forgotPassword: Joi.object({
    email: Joi.string().email().required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
      })
  }),

  resetPassword: Joi.object({
    token: Joi.string().required()
      .messages({
        'any.required': 'Reset token is required'
      }),
    password: Joi.string().min(8).required()
      .messages({
        'string.min': 'Password must be at least 8 characters long',
        'any.required': 'Password is required'
      })
  })
};

export const userSchemas = {
  getUsers: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    email: Joi.string().email(),
    role: Joi.string().valid('admin', 'manager', 'staff'),
    isActive: Joi.boolean(),
    isEmailVerified: Joi.boolean(),
    sortBy: Joi.string().valid('createdAt', 'email', 'firstName', 'lastName').default('createdAt'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc')
  }),

  createUser: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    firstName: Joi.string().trim().min(1).required(),
    lastName: Joi.string().trim().min(1).required(),
    role: Joi.string().valid('admin', 'manager', 'staff').default('staff')
  }),

  updateUser: Joi.object({
    firstName: Joi.string().trim().min(1),
    lastName: Joi.string().trim().min(1),
    role: Joi.string().valid('admin', 'manager', 'staff'),
    isActive: Joi.boolean()
  }).min(1),

  updateProfile: Joi.object({
    firstName: Joi.string().trim().min(1),
    lastName: Joi.string().trim().min(1)
  }).min(1)
};

export const fileSchemas = {
  uploadFile: Joi.object({
    file: Joi.object().required()
      .messages({
        'any.required': 'File is required'
      })
  }),

  getFiles: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(10),
    sortBy: Joi.string().valid('createdAt', 'filename', 'size').default('createdAt'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc')
  }),

  updateFile: Joi.object({
    filename: Joi.string().trim().min(1),
    isPublic: Joi.boolean()
  }).min(1)
};
