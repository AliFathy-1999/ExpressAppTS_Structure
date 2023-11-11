import Joi from 'joi';

const signUp = {
    body: Joi.object().keys({
        firstName: Joi.string()
        .min(3)
        .max(15)
        .pattern(/^[a-zA-Z\s]+$/)
        .messages({
            'string.empty': 'First name is a required field',
            'string.min': 'First name must be at least 3 characters',
            'string.max': 'First name must be at most 15 characters',
            'string.pattern.base' : 'First name must contain only alphabet letter ',
        }),
        lastName: Joi.string()
        .min(3)
        .max(15)
        .pattern(/^[a-zA-Z\s]+$/)
        .messages({
            'string.empty': 'Last name is a required field',
            'string.min': 'Last name must be at least 3 characters',
            'string.max': 'Last name must be at most 15 characters',
            'string.pattern.base' : 'Last name must contain only alphabet letter ',
        }),
        email: Joi.string().email()
        .messages({
            'string.empty': 'Email is a required field',
            'string.email': 'Invalid email format',
        }),
        userName: Joi.string().min(3).max(30)
        .pattern(/^[a-zA-Z0-9\s]+$/)
        .messages({
            'string.empty': 'User name is a required field',
            'string.min': 'Username must be at least 3 characters',
            'string.max': 'Username must be at most 30 characters',
            'string.pattern.base' : 'Username must contain only alphabet letter and numbers',
        }),       
        password: Joi.string()
        .min(8)
        .pattern(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]/)
        .messages({
            'string.empty': 'Password is a required field',
            'string.min': 'Password must be at least 8 characters',
            'string.pattern.base': 'Password must contain at least one number , Capital letter and one special character',
        }),
        pImage: Joi
        .any()
        .messages({
            'any.empty': 'Profile Image is a required field',
        }),
        role : Joi.string().valid('admin', 'user').default('admin'),
    }),
}

const signIn = {
    body: Joi.object().keys({
        email: Joi.string().required().trim().email(),
        password: Joi.string().required().trim(),
    }),
};


export default {
    signUp,
    signIn,
}
