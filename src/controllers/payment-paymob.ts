import { Request, Response , NextFunction } from "express";
import bcryptjs from "bcryptjs"; 


import { ApiError } from "../lib";

import { infoLogger } from "../utils/logger";
import successMsg from "../utils/messages/successMsg";
import errorMsg from "../utils/messages/errorMsg";
import config from "../config";
const { paymob: { callBackBaseURL } } = config;

import { getPaymentToken } from "../utils/paymob-functions";
import { StatusCodes } from "http-status-codes";


const checkOut = async (req:Request,res:Response,next:NextFunction) => { 
        const userId = req.user._id;
        const { shipping_data : {
            apartment, email, floor, first_name, street, building, phone_number, postal_code, 
            extra_description,city, country, last_name, state
        } } = req.body
        
        // const cart = await isFound(Cart,{userId},'Cart');
        
        // const cartItemsData = await cartItems.find({cartId:cart._id});

        // const mappedItems = cartItemsData.map(item => {        
        //     return {
        //         name : `${req.user.userName}'s cart`,
        //         amount_cents: item.price * 100,
        //         description: `description`,
        //         quantity : item.quantity
        //     }
        // })
        const payload = {
            amount : "cart.totalPrice",
            client_name : `${req.user.firstName} ${req.user.lastName}`,
            shipping_data: {
                apartment, email, floor, first_name, street, building, phone_number, postal_code, 
                extra_description,city, country, last_name, state
            }
        }
        // let paymentToken = await getPaymentToken(mappedItems, payload);
        let callbackURL;
        // if(paymentToken) callbackURL = `${callBackBaseURL}${paymentToken}` 
        infoLogger(`${req.method} | success | ${StatusCodes.OK} | ${req.protocol} | ${req.originalUrl} `)
        res.status(StatusCodes.OK).json({
            status:'success',
            message : successMsg.get('Paymob Token'),
            callbackURL,
        });        
}
const successCallback = async (req:Request,res:Response,next:NextFunction) => {
    infoLogger(`${req.method} | success | ${StatusCodes.OK} | ${req.protocol} | ${req.originalUrl} `)
    res.send(`
    <html>
        <body>
            <h1>Success Payment</h1>
        </body>
    </html>
    `)
}
const failureCallback = async (req:Request,res:Response,next:NextFunction) => {
    infoLogger(`${req.method} | success | ${StatusCodes.OK} | ${req.protocol} | ${req.originalUrl} `)
    res.send(`
    <html>
        <body>
            <h1>Failed Payment</h1>
        </body>
    </html>
    `)
}
export default {
    checkOut,
    successCallback,
    failureCallback
}