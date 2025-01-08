import { Router } from "express";
import auth from "../../middleWare/authentication.js";
import * as Comment_Controller from './controller/comment.js'
import validation from "../../middleWare/validation.js";
import * as validators from './comment.validators.js'

const router = Router()
router.use(auth())


// - Add comment ( can’t add comment on product has isDeleted equal true ,  user that has isDeleted equal true or blocked  can’t add comment )
router.post("/addComment/:productId", validation(validators.addComment), Comment_Controller.addComment)

// - Update comment ( by comment owner only ) 
router.patch("/updateComment/:id", validation(validators.updateComment), Comment_Controller.updateComment)


// - SoftDelete comment ( by product owner or comment owner , and add who is delete the comment in deletedby field in the comment model ) 
router.patch("/SoftDeleteComment/:id", validation(validators.softDeleteComment), Comment_Controller.SoftDeleteComment)



export default router