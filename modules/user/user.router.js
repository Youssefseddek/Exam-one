import { Router } from "express";
import auth from "../../middleWare/authentication.js";
import * as User_Controller from './controller/user.js'
import validation from "../../middleWare/validation.js";
import * as validators from './user.validators.js'

const router = Router()



router.use(auth());



// - Get user by id
router.get('/', User_Controller.UserById)


// - Update profile ( by account owner only )
router.put('/updateprofile', validation(validators.updateProfile), User_Controller.updateProfile)


// - Upadete password ( by account owner only )
router.patch('/updatePassword', validation(validators.updatePassword), User_Controller.updatePassword)


// - Softdelete profile ( by account owner only )
router.patch('/softDelete', User_Controller.softDelete)


// - Block account ( by admin only )( inside the app file  , create function fires when ever you run the server , this function will add a user in user collection but with admin role to be able to access the block account API )
router.patch('/blockAccount/:id', validation(validators.blockAccount), User_Controller.blockAccount)


// - SignOut ( return the lastSeen in the response )
router.patch('/signout', User_Controller.signOut)


// - Get all users with their products with  the comments on each product ( decrypt user’s phone  , don’t get products with isDeleted equal true) 
router.get('/allUsers', User_Controller.allUsers)


export default router

