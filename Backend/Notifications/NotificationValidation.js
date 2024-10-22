const Joi = require('joi');

const notificationValidation = (data) => {
    const schema = Joi.object({
        postId: Joi.string().required().pattern(/^[0-9a-fA-F]{24}$/).messages({
            "string.pattern.base": "postId must be a valid ObjectId"
        }),
        userName: Joi.string().required(),
        userId: Joi.string().required().pattern(/^[0-9a-fA-F]{24}$/).messages({
            "string.pattern.base": "userId must be a valid ObjectId"
        }),
        createdAt: Joi.date().default(Date.now),
        read: Joi.array().items(
            Joi.string().pattern(/^[0-9a-fA-F]{24}$/).messages({
                "string.pattern.base": "Each userId in read must be a valid ObjectId"
            })
        )
    });
    
    return schema.validate(data);
};

module.exports = notificationValidation;
