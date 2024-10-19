const Joi = require('joi');

const userSchema = Joi.object({
    displayName: Joi.string().required().messages({
        'string.empty': 'Display name cannot be empty',
        'any.required': 'Display name is required',
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required',
    }),
    imageUrl: Joi.string().messages({
        'string.imageUrl': 'image url is not defined'
    })
});

const validateUser = (userData) => {
    return userSchema.validate(userData, { abortEarly: false });
}

module.exports = validateUser;
