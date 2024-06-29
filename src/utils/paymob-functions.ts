import config from "../config";
const { paymob: { accessLink,apiKey, orderLink, paymentKeyRefLink,expirationTime,integration_id,callBackBaseURL } } = config;
import axios from "axios";

const getTokenFromPayMob = async ()=>{
    const getToken = await axios.post( accessLink, { api_key : apiKey })            
    const token = getToken.data.token;
    return token
}

const orderRegistration = async (cartItems:any,payload:{[key:string]:any}) => {    
    const auth_token = await getTokenFromPayMob();
    const createOrder = await axios.post( orderLink, { 
        auth_token,
        delivery_needed:true,
        amount_cents: payload.amount * 100,
        shipping_data: payload.shipping_data,
        currency: "EGP",
        // merchant_order_id: 60,
        items: []
    })    
    return {
        auth_token,
        merchant_order_id : createOrder.data.id
    }
}
const getPaymentToken = async (cartItems:any,payload:{[key:string]:any}) => {    
    const { merchant_order_id, auth_token } = await orderRegistration(cartItems,payload);
    const getPaymentToken = await axios.post( paymentKeyRefLink, { 
        auth_token,
        expiration: expirationTime,        
        amount_cents: payload.amount * 100,
        billing_data: payload.shipping_data,
        currency: "EGP",
        merchant_order_id,
        integration_id:integration_id,
        lock_order_when_paid:false
    })     
    return getPaymentToken.data.token
}

export {
    getTokenFromPayMob,
    orderRegistration,
    getPaymentToken
}