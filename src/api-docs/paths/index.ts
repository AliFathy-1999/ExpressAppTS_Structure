import * as userApis from './userDocs'

const userRegistration = userApis.default['/users/register']
const userLogin = userApis.default['/users/login']
const updateUser = userApis.default['/users/']
const deleteUser = userApis.default['/users/{id}']


const paths = {
    '/users/register' : userRegistration,
    '/users/login' : userLogin,
    '/users/' : updateUser,
    '/users/{id}' : deleteUser,
}

export default paths;