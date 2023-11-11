const successMsg = {
    created: (model:string) => `${model} is created successfully`,
    updated: (model:string, field:string) => `${model} with ${field} is updated successfully`,
    deleted: (model:string, field:string) => `${model} with ${field} is deleted successfully`,
    get: (model:string) => `${model} is fetched successfully`,
    signIn: (username:string) => `${username} is signed in successfully`,
    signUp: (userName:string) => `${userName} is signed up successfully`,
    customMsg: (msg:string) => msg
}
export default successMsg;