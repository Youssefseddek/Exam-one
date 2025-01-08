import { Router } from "express";
import auth from "../../middleWare/authentication.js";
import * as Product_Controller from './controller/product.js'
import { checkProfile } from "../../services/checkProfile.js";
import validation from "../../middleWare/validation.js";
import * as validators from './product.validators.js'

const router = Router()

router.use(auth())




// - add product ( user that has isDeleted equal true or blocked  can’t add product ) 
router.post('/addProduct', checkProfile(), validation(validators.addProduct), Product_Controller.addProduct)


// - Update product ( by product owner only)
router.patch('/updateProduct/:id', validation(validators.updateProduct), Product_Controller.updateProduct)



// - Delete product ( by product owner only ) 
router.delete('/deleteProduct/:id', validation(validators.deleteProduct), Product_Controller.deleteProduct)


// - Get all products with their comments ( must check if the comments not  softdeleted , user that has isDeleted equal true or blocked can’t get  products ) 
router.get('/getAllProducts', Product_Controller.getAllProducts)



// - SoftDelete product ( by product owner only ) 
router.patch('/softDeleteProduct/:id', validation(validators.softDeleteProduct), Product_Controller.softDeleteProduct)



// - Get product by id 
router.get('/getProductById/:id', validation(validators.getProductById), Product_Controller.getProductById)



// - like product ( the product owner can’t like his product , user can like the product only one time )
router.patch('/likeProduct/:id', validation(validators.likeProduct), Product_Controller.likeProduct)


// - Unlike product
router.patch('/unLikeProduct/:id', validation(validators.unLikeProduct), Product_Controller.unLikeProduct)



// - Search on products by title 
router.get('/searchProduct', validation(validators.searchProduct), Product_Controller.searchProduct)




// =============== like and unlike product =============
router.patch('/likeAndUnlikeProduct/:id', validation(validators.likeProduct), Product_Controller.likeAndUnlikeProduct)

export default router