import request from 'supertest';
import app from '../app';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import config from '../config'
const { url } = config.db;
let token:string; 
let _id;
describe('users', () => {
    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create();
        
        await mongoose.connect(url);
    })
    afterAll(async () => {
        await mongoose.disconnect();
        await mongoose.connection.close();
    })
    // describe('User Sign Up ',()=>{
    //     it('Sign Up route', async () => {
    //         const signUpResponse = await request(app)
    //         .post(`/api/v1/auth/register`)
    //         .send({
    //             firstName: 'Ali',
    //             lastName: 'Ahmed',
    //             userName: 'aliahmedfathi22',
    //             email: 'aliahmedfathi22@gmail.com',
    //             password: '@iti43OS'
    //         });
    //         expect(signUpResponse.status).toBe(201);
    //     })
    // })
    describe('User Sign In ',()=>{
        it('Sign In route', async () => {
            const signInResponse = await request(app)
            .post(`/api/v1/auth/login`)
            .send({
                email: 'aliahmedfathi@gmail.com',
                password: '@iti43OS'
            });
            expect(signInResponse.status).toBe(StatusCodes.OK);
            token = signInResponse.body.token;
            _id = signInResponse.body.data._id;
            console.log(_id);
            
        })
    })
    describe('Get User Data', ()=>{
        let userId = '650c1a70700870e64b5f3b72'

        it('Unauthorized', async () => {
            const response = await request(app)
            .get(`/api/v1/users/${userId}`)
            expect(response.status).toBe(StatusCodes.FORBIDDEN);
        })
        it('User Not Found', async () => {
            userId = '650c1a70700870e64b5f3b71'
            const response = await request(app)
            .get(`/api/v1/users/650c1a70700870e64b5f3b71`)
            .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(StatusCodes.NOT_FOUND);
        })
        it('User Found Successfully', async () => {
            const response = await request(app)
            .get(`/api/v1/users/650c1a70700870e64b5f3b72`)
            .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(StatusCodes.OK);
        })

    })
})