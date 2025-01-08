import productModel from "../../../DB/model/product.model.js"
import userModel from "../../../DB/model/user.model.js"




// - add product ( user that has isDeleted equal true or blocked  can’t add product ) 
export const addProduct = async (req, res) => {
    try {
        const { title, description, price } = req.body

        const newProduct = new productModel({ title, description, price, createdBy: req.user._id })
        const savedProduct = await newProduct.save()

        await userModel.updateOne({ _id: req.user._id },
            { $push: { products: savedProduct._id } }
        )

        savedProduct
            ? res.status(201).json({ message: 'Done', savedProduct })
            : res.status(400).json({ message: 'fail to add product' })
    } catch (error) {
        res.status(500).json({ message: 'catch error', error })
    }
}

// - Update product ( by product owner only)
export const updateProduct = async (req, res) => {
    try {
        const { title, description, price } = req.body
        const { id } = req.params

        const product = await productModel.findOneAndUpdate({ _id: id, createdBy: req.user._id, isDeleted: false },
            {
                title, description, price
            }, { new: true }
        )

        product ?
            res.status(200).json({ message: 'Done', product })
            : res.status(400).json({ message: 'Fail to update product', product })
    } catch (error) {
        res.status(500).json({ message: 'catch error', error })
    }
}



// - Delete product ( by product owner only )
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params

        const product = await productModel.findOneAndDelete({ _id: id, createdBy: req.user._id, isDeleted: false })


        if (product) {
            await userModel.updateOne({ _id: req.user._id },
                { $pull: { products: id } }
            )

            res.status(200).json({ message: 'Done', product })

        } else {
            res.status(400).json({ message: 'Fail to delete product', product })

        }
    } catch (error) {
        res.status(500).json({ message: 'catch error', error })
    }
}



// - Get all products with their comments ( must check if the comments not  softdeleted , user that has isDeleted equal true or blocked can’t get  products )
export const getAllProducts = async (req, res) => {

    try {

        const user = await userModel.findOne({ _id: req.user._id, isBlocked: false, isDeleted: false })
        if (!user) {
            res.status(401).json({ message: 'user deleted or blocked' })
        } else {
            const products = await productModel.find({}).populate([
                {
                    path: 'comments',
                    match: { isDeleted: false }
                }

            ])
            products.length ?
                res.status(200).json({ message: "Done", products })
                : res.status(400).json({ message: "products not found", products })
        }
    } catch (error) {
        res.status(500).json({ message: 'catch error', error })
    }
}


// - SoftDelete product ( by product owner only )
export const softDeleteProduct = async (req, res) => {
    try {
        const { id } = req.params

        const product = await productModel.findOneAndUpdate({ _id: id, createdBy: req.user._id, isDeleted: false },
            {
                isDeleted: true
            }, { new: true }
        )

        product ?
            res.status(200).json({ message: 'Your product marked As deleted successfully', product })
            : res.status(400).json({ message: 'Fail to soft delete product', product })
    } catch (error) {
        res.status(500).json({ message: 'catch error', error })
    }
}

// - Get product by id
export const getProductById = async (req, res) => {

    try {
        const { id } = req.params

        const product = await productModel.findOne({ _id: id, isDeleted: false }).populate(
            {
                path: 'comments',
                match: { isDeleted: false }
            }
        )
        console.log(product);

        product ?
            res.status(200).json({ message: 'Done', product })
            : res.status(400).json({ message: 'Product not found' })
    } catch (error) {
        res.status(500).json({ message: 'catch error', error })
    }
}



// - like product ( the product owner can’t like his product , user can like the product only one time )
export const likeProduct = async (req, res) => {

    try {

        const { id } = req.params
        const product = await productModel.findById(id)

        if (!product) {
            res.status(404).json({ message: "product not found", product })
        } else {
            if (req.user._id.toString() == product.createdBy.toString()) {
                res.status(401).json({ message: "Unauthorized: you cannot like your product" })
            } else {
                if (product.likes.includes(req.user._id)) {
                    res.status(400).json({ message: "you already liked this product" })
                } else {
                    const addlike = await productModel.findOneAndUpdate({ _id: product._id },
                        {
                            $push: {
                                likes: req.user._id
                            }
                        }, { new: true }
                    )

                    addlike ?
                        res.status(200).json({ message: 'Done', addlike, Number_of_Likes: addlike.likes.length })
                        : res.status(400).json({ message: 'fail to like product' })
                }
            }
        }

    } catch (error) {
        res.status(500).json({ message: 'catch error', error })
    }
}

// - Unlike product
export const unLikeProduct = async (req, res) => {
    try {
        const { id } = req.params
        const product = await productModel.findById(id)

        if (!product) {
            res.status(404).json({ message: "product not found", product })
        } else {
            if (req.user._id.toString() == product.createdBy.toString()) {
                res.status(401).json({ message: "Unauthorized: you cannot un like your product" })
            } else {
                if (!product.likes.includes(req.user._id)) {
                    res.status(400).json({ message: "you already unliked this product" })
                } else {
                    const unlike = await productModel.findOneAndUpdate({ _id: product._id },
                        {
                            $pull: {
                                likes: req.user._id
                            }
                        }, { new: true }
                    )

                    unlike ?
                        res.status(200).json({ message: 'Done', unlike, Number_of_Likes: unlike.likes.length })
                        : res.status(400).json({ message: 'fail to unlike product' })
                }
            }
        }

    } catch (error) {
        res.status(500).json({ message: 'catch error', error })
    }

}


// - Search on products by title 
export const searchProduct = async (req, res) => {
    try {
        const { searchKey } = req.query
        console.log(searchKey);

        const products = await productModel.find(
            {
                title: { "$regex": `${searchKey}` }
            }
        )

        products ?
            res.status(200).json({ message: 'Done', products })
            : res.status(404).json({ message: 'not found product' })
    } catch (error) {
        res.status(500).json({ message: 'catch error', error })

    }
}



// =============== like and unlike product =============
export const likeAndUnlikeProduct = async (req, res) => {

    try {
        const { id } = req.params
        const product = await productModel.findById(id)
        if (!product) {
            res.status(404).json({ message: "product not found", product })
        } else {

            if (product.createdBy.toString() == req.user._id.toString()) {
                res.status(400).json({ message: "can't like your product" })
            } else {
                if (product.likes.includes(req.user._id)) {
                    const updateProduct = await productModel.findByIdAndUpdate(id,
                        { $pull: { likes: req.user._id } }, { new: true }
                    )
                    updateProduct ? res.status(200).json({ message: 'unlike Done', updateProduct, Number_of_Likes: updateProduct.likes.length }) :
                        res.status(400).json({ message: 'fail to unlike product' })
                } else {
                    const updateProduct = await productModel.findByIdAndUpdate(id,
                        { $push: { likes: req.user._id } }, { new: true }
                    )
                    updateProduct ? res.status(200).json({ message: 'like Done', updateProduct, Number_of_Likes: updateProduct.likes.length }) :
                        res.status(400).json({ message: 'fail to like product' })
                }
            }
        }



    } catch (error) {
        res.status(500).json({ message: "catch error", error })
    }
}