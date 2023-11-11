import Joi from 'joi';

const searchValidator = {
    query: Joi.object().keys({
        searchValue: Joi.string().trim().required().messages({
            'string.empty':'searchValue is a required field'
        }),
        searchField: Joi.string().trim().required().messages({
            'string.empty':'searchField is a required field'
        }),
    })
}


export default {
    searchValidator
}