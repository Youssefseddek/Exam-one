import joi from 'joi'




export const updateProfile = {
    body: joi.object().required().keys({
        email: joi.string().email({ minDomainSegments: 1, tlds: { allow: ['com', 'net'] } }).messages({
            "any.required": "PLZ enter your email",
            "string.empty": "email can not be empty",
            "string.email": " enter valid email ",
            "string.base": " enter valid email "
        }),
        age: joi.number(),
        gender: joi.string(),
        address: joi.string(),
        myPhone: joi.string().pattern(/^01[0125][0-9]{8}$/).min(11).max(11),
        firstName: joi.string(),
        lastName: joi.string()

    })
}


export const updatePassword = {
    body: joi.object().required().keys({
        oldPassword: joi.string().pattern(new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/)).required(),
        newPassword: joi.string().pattern(new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/)).required(),
        cPassword: joi.string().valid(joi.ref('newPassword')).required()

    })
}


export const blockAccount = {
    params: joi.object().required().keys({
        id: joi.string().max(24).min(24).required()
    })
}