
const { handleResponseError } = require('./handlingErrors');
const { ApiError } = require('./apiError');
const asyncWrapper = require('./asyncWrapper');

const trimText = (text:string) => {
    return text.replace(/\s+/g, ' ');
}

module.exports = { ApiError, asyncWrapper, handleResponseError, trimText };
