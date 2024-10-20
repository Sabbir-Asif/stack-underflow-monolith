const Joi = require('joi');

const SUPPORTED_FILE_TYPES = ['c', 'cpp', 'java', 'js', 'py', 'go', 'ruby', 'php'];

const createPostSchema = Joi.object({
  question: Joi.string()
    .required()
    .max(1000)
    .trim()
    .messages({
      'string.empty': 'Question is required',
      'string.max': 'Question cannot exceed 1000 characters',
      'any.required': 'Question is required'
    }),

  fileType: Joi.string()
    .required()
    .valid(...SUPPORTED_FILE_TYPES)
    .messages({
      'string.empty': 'File type is required',
      'any.only': `File type must be one of: ${SUPPORTED_FILE_TYPES.join(', ')}`,
      'any.required': 'File type is required'
    }),

  fileContent: Joi.string()
    .required()
    .min(1)
    .max(50000)
    .messages({
      'string.empty': 'File content is required',
      'string.min': 'File content cannot be empty',
      'string.max': 'File content cannot exceed 50000 characters',
      'any.required': 'File content is required'
    }),

  fileName: Joi.string()
    .required()
    .messages({
      'string.empty': 'File name is required',
      'any.required': 'File name is required'
    }),

  userId: Joi.string()
    .required()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.empty': 'User ID is required',
      'string.pattern.base': 'Invalid user ID format',
      'any.required': 'User ID is required'
    })
});

const updatePostSchema = Joi.object({
  question: Joi.string()
    .min(10)
    .max(1000)
    .trim()
    .messages({
      'string.min': 'Question must be at least 10 characters long',
      'string.max': 'Question cannot exceed 1000 characters'
    }),

  fileContent: Joi.string()
    .min(1)
    .max(50000)
    .messages({
      'string.min': 'File content cannot be empty',
      'string.max': 'File content cannot exceed 50000 characters'
    })
});

const validateCreatePost = (req, res, next) => {
  const { error } = createPostSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path[0],
      message: detail.message
    }));
    
    return res.status(400).json({
      success: false,
      errors
    });
  }
  
  next();
};

const validateUpdatePost = (req, res, next) => {
  const { error } = updatePostSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path[0],
      message: detail.message
    }));
    
    return res.status(400).json({
      success: false,
      errors
    });
  }
  
  next();
};

const querySchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      'number.base': 'Page must be a number',
      'number.min': 'Page must be greater than 0'
    }),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10)
    .messages({
      'number.base': 'Limit must be a number',
      'number.min': 'Limit must be greater than 0',
      'number.max': 'Limit cannot exceed 100'
    }),

  fileType: Joi.string()
    .valid(...SUPPORTED_FILE_TYPES)
    .messages({
      'any.only': `File type must be one of: ${SUPPORTED_FILE_TYPES.join(', ')}`
    }),

  sortBy: Joi.string()
    .valid('createdAt', 'fileType')
    .default('createdAt')
    .messages({
      'any.only': 'Sort by must be either createdAt or fileType'
    }),

  sortOrder: Joi.string()
    .valid('asc', 'desc')
    .default('desc')
    .messages({
      'any.only': 'Sort order must be either asc or desc'
    })
});

const validateQuery = (req, res, next) => {
  const { error, value } = querySchema.validate(req.query, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path[0],
      message: detail.message
    }));
    
    return res.status(400).json({
      success: false,
      errors
    });
  }
  
  req.query = value;
  next();
};

module.exports = {
  validateCreatePost,
  validateUpdatePost,
  validateQuery,
  SUPPORTED_FILE_TYPES
};