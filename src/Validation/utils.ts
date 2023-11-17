import Joi from 'joi';

const searchValidator = {
    query: Joi.object().keys({
        searchValue: Joi.string().trim().required().messages({
            'string.empty':'searchValue is a required field'
        }),
        searchField: Joi.string().trim().required().messages({
            'string.empty':'searchField is a required field'
        }),
        page: Joi.number().messages({
            'number.base': 'page must be a number',
            'number.empty': 'page is a required field'
        }),
        limit: Joi.number().messages({
            'number.base': 'limit must be a number',
            'number.empty': 'limit is a required field'
        }),
        sort: Joi.string().messages({
            'string.base': 'sort must be a string',
            'string.empty': 'sort is a required field'
        }),
        select: Joi.string().messages({
            'string.base': 'select must be a string',
        })
    })
}


export default {
    searchValidator
}