import joi from 'joi'


export const signUp = {
    body: joi.object().required().keys({
        firstName: joi.string().required(),
        lastName: joi.string().required(),
        email: joi.string().email({ minDomainSegments: 1, tlds: { allow: ['com', 'net'] } }).required().messages({
            "any.required": "PLZ enter your email",
            "string.empty": "email can not be empty",
            "string.email": " enter valid email ",
            "string.base": " enter valid email "
        }),
        password: joi.string().pattern(new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/)).required(),
        cPassword: joi.string().valid(joi.ref('password')).required(),
        phone: joi.string().pattern(/^01[0125][0-9]{8}$/).min(11).max(11).required()
    })

}


export const confirmEmail_and_refershToken = {
    params: joi.object().required().keys({
        token: joi.string().required()
    })

}





export const signIn = {
    body: joi.object().required().keys({

        email: joi.string().email({ minDomainSegments: 1, tlds: { allow: ['com', 'net'] } }).required().messages({
            "any.required": "PLZ enter your email",
            "string.empty": "email can not be empty",
            "string.email": " enter valid email ",
            "string.base": " enter valid email "
        }),
        password: joi.string().pattern(new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/)).required(),

    })

}


export const sendCode = {
    body: joi.object().required().keys({
        email: joi.string().email({ minDomainSegments: 1, tlds: { allow: ['com', 'net'] } }).required().messages({
            "any.required": "PLZ enter your email",
            "string.empty": "email can not be empty",
            "string.email": " enter valid email ",
            "string.base": " enter valid email "
        }),
    })
}


export const forgetPassword = {
    body: joi.object().required().keys({

        code: joi.string().required(),
        newPassword: joi.string().pattern(new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/))

    })
}
