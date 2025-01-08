import { Router } from "express";
import * as Auth_Controller from './controller/auth.js'
import validation from "../../middleWare/validation.js";
import * as validators from './auth.validators.js'

const router = Router()

router.get('/', (req, res) => {
    res.json({ message: 'Auth Module' })
})


// - SignUp ( hash password , encrypt phone , send confirmation email ) 
router.post(
    '/signup',
    validation(validators.signUp),
    Auth_Controller.signup
)

router.get('/confirmEmail/:token', validation(validators.confirmEmail_and_refershToken), Auth_Controller.confirmEmail)


// - Refresh token
router.get('/refreshToken/:token', validation(validators.confirmEmail_and_refershToken), Auth_Controller.refreshToken)


// - SignIn ( must be confirmed and not deleted or blocked ) 
router.post(
    '/signin',
    validation(validators.signIn),
    Auth_Controller.signIn
)


// - Forget password ( the link must be  used only one time in another word the link must be valid for only one time access ) 
router.patch('/sendCode', validation(validators.sendCode), Auth_Controller.sendCode)

router.get('/forgetPassword/:token', validation(validators.forgetPassword), Auth_Controller.forgetPassword)





export default router