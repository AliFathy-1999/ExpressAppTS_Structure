import { Router } from "express";
    
import { userAuth, adminAuth } from "../middlewares/auth";
import { asyncWrapper } from "../lib";

import { paymentPaymobController } from "../controllers";
const router = Router()

router.post('/checkout', userAuth, asyncWrapper(paymentPaymobController.checkOut))
router.get('/success', asyncWrapper(paymentPaymobController.successCallback))
router.get('/failure',asyncWrapper(paymentPaymobController.failureCallback))

export default router;