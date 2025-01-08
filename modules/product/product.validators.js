import joi from 'joi'



export const addProduct = {
    body: joi.object().required().keys({
        title: joi.string().required(),
        description: joi.string().required(),
        price: joi.number().required()
    }),
    headers: joi.object().required().keys({
        authorization: joi.string().required()
    }).options({ allowUnknown: true })
}

export const updateProduct = {
    body: joi.object().required().keys({
        title: joi.string(),
        description: joi.string(),
        price: joi.number()
    }),
    params: joi.object().required().keys({
        id: joi.string().max(24).min(24).required()
    }),
    headers: joi.object().required().keys({
        authorization: joi.string().required()
    }).options({ allowUnknown: true })
}

export const deleteProduct = {
    params: joi.object().required().keys({
        id: joi.string().required()
    }),
    headers: joi.object().required().keys({
        authorization: joi.string().required()
    }).options({ allowUnknown: true })
}

export const softDeleteProduct = {
    params: joi.object().required().keys({
        id: joi.string().required()
    }),
    headers: joi.object().required().keys({
        authorization: joi.string().required()
    }).options({ allowUnknown: true })
}

export const getProductById = {
    params: joi.object().required().keys({
        id: joi.string().required()
    }),
    headers: joi.object().required().keys({
        authorization: joi.string().required()
    }).options({ allowUnknown: true })
}

export const likeProduct = {
    params: joi.object().required().keys({
        id: joi.string().required()
    }),
    headers: joi.object().required().keys({
        authorization: joi.string().required()
    }).options({ allowUnknown: true })
}

export const unLikeProduct = {
    params: joi.object().required().keys({
        id: joi.string().required()
    }),
    headers: joi.object().required().keys({
        authorization: joi.string().required()
    }).options({ allowUnknown: true })
}

export const searchProduct = {
    query: joi.object().required().keys({
        searchKey: joi.string()
    }),
    headers: joi.object().required().keys({
        authorization: joi.string().required()
    }).options({ allowUnknown: true })
}