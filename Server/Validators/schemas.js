const Joi = require('joi');

const userRegisterSchema = Joi.object({
    name: Joi.string().required().min(2),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6),
    phoneNumber: Joi.string().required()
});

const userLoginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

const orderCreateSchema = Joi.object({
    userId: Joi.string().required(),
    items: Joi.array().items(Joi.object({
        productId: Joi.string().required(),
        title: Joi.string().required(),
        price: Joi.number().required(),
        image: Joi.string().required(),
        size: Joi.string().required(),
        color: Joi.string().optional(),
        sku: Joi.string().required(),
        quantity: Joi.number().required().min(1)
    })).min(1).required(),
    totalAmount: Joi.number().required().min(0),
    shippingAddress: Joi.object({
        fullName: Joi.string().required(),
        address: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        zipCode: Joi.string().required(),
        country: Joi.string().required()
    }).required()
});

module.exports = {
    userRegisterSchema,
    userLoginSchema,
    orderCreateSchema
};
