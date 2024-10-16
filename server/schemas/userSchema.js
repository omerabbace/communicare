const Joi = require('joi');
const userSchema = Joi.object({
    name: Joi.string().required().messages({
        'any.required': 'Name is required',
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Please enter a valid email',
        'any.required': 'Email is required'
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'Password must be at least 6 characters',
        'any.required': 'Password is required'
    }),
    phone: Joi.string().required().messages({
        'any.required': 'Phone number is required'
    }),
    role: Joi.string().valid('admin', 'normal', 'volunteer', 'serviceProvider').required().messages({
        'any.only': 'Role must be one of admin, normal, volunteer, or serviceProvider',
        'any.required': 'Role is required'
    }),
    // CNIC is required for volunteers and service providers
    cnic: Joi.string().when('role', {
        is: Joi.valid('volunteer', 'serviceProvider'),
        then: Joi.string().pattern(/^\d{5}-\d{7}-\d{1}$/).required().messages({
            'string.pattern.base': 'CNIC must be in the format 12345-1234567-1',
            'any.required': 'CNIC is required for volunteer and service provider roles'
        }),
        otherwise: Joi.string().allow(null)
    }),
    // Service category is required for service providers
    serviceCategory: Joi.string().when('role', {
        is: 'serviceProvider',
        then: Joi.string().valid('accidentManagement', 'vehicleAssistance').required().messages({
            'any.only': 'Service category must be either accidentManagement or vehicleAssistance',
            'any.required': 'Service category is required for service provider role'
        }),
        otherwise: Joi.string().allow(null)
    })
});

module.exports = { userSchema };
