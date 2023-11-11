import request from 'supertest';
import app from '../app';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import config from '../config'
const { url } = config.db;

describe('users authentication', () => {
    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());
    })
    afterAll(async () => {
        await mongoose.disconnect();
        await mongoose.connection.close();
    })
    describe('User Sign Up ',()=>{
        it('Sign Up route', async () => {
            const signUpResponse = await request(app)
            .post(`/api/v1/auth/register`)
            .send({
                firstName: 'Ali',
                lastName: 'Ahmed',
                userName: 'aliahmedfathi22',
                email: 'aliahmedfathi22@gmail.com',
                password: '@iti43OS'
            });
            expect(signUpResponse.status).toBe(201);
            expect(signUpResponse.body).toHaveProperty('token');
            expect(signUpResponse.body).toHaveProperty('data');
            expect(signUpResponse.body.status).toBe('success');
        })
    })
    describe('User Sign In ',()=>{
        it('Sign In route', async () => {
            const signInResponse = await request(app)
            .post(`/api/v1/auth/login`)
            .send({
                email: 'aliahmedfathi22@gmail.com',
                password: '@iti43OS'
            });
            expect(signInResponse.status).toBe(StatusCodes.OK);
            
        })
    })
})