import joi from 'joi'



export const addComment = {
    body: joi.object().required().keys({
        commentBody: joi.string().required()
    }),
    params: joi.object().required().keys({
        productId: joi.string().max(24).min(24).required()
    }),
    headers: joi.object().required().keys({
        authorization: joi.string().required()
    }).options({ allowUnknown: true })
}

export const updateComment = {
    body: joi.object().required().keys({
        commentBody: joi.string().required()
    }),
    params: joi.object().required().keys({
        id: joi.string().required()
    }),
    headers: joi.object().required().keys({
        authorization: joi.string().required()
    }).options({ allowUnknown: true })
}

export const softDeleteComment = {
    params: joi.object().required().keys({
        id: joi.string().required()
    }),
    headers: joi.object().required().keys({
        authorization: joi.string().required()
    }).options({ allowUnknown: true })
}