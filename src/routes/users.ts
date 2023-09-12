import { Router } from "express";
import validate from '../middlewares/validation'
const { asyncWrapper } = require("../lib/index");
const { usersValidator }  =  require('../Validation/index')
const { userController } = require('../controllers/index')
const {upload} = require('../middlewares/upload-image')
const router = Router()

router.post('/register',upload.single("pImage"), validate(usersValidator.signUp) ,asyncWrapper(userController.register))
router.delete('/:id' ,asyncWrapper(userController.deleteUser))
router.patch('/:id',upload.single("pImage"), validate(usersValidator.signUp) ,asyncWrapper(userController.updateUser))


export default router;