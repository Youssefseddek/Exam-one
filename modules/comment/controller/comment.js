import commentModel from "../../../DB/model/comment.model.js"
import productModel from "../../../DB/model/product.model.js"
import userModel from "../../../DB/model/user.model.js"



// - Add comment ( can’t add comment on product has isDeleted equal true ,  user that has isDeleted equal true or blocked  can’t add comment )
export const addComment = async (req, res) => {

    try {
        const { commentBody } = req.body
        const { productId } = req.params
        const user = await userModel.findOne({ _id: req.user._id, isBlocked: false, isDeleted: false })
        if (!user) {
            res.status(401).json({ message: ' user is blocked or mark as deleted' })
        } else {
            const product = await productModel.findOne({ _id: productId, isDeleted: false })
            if (!product) {
                res.status(400).json({ message: ' product is not found or mark as deleted' })
            } else {
                const newComment = new commentModel({ commentBody, createdBy: req.user._id, productId: product._id })
                const savedComment = await newComment.save()

                await productModel.updateOne({ _id: product._id },
                    { $push: { comments: savedComment._id } }
                )
                res.status(201).json({ message: ' Your comment created successfully', savedComment })

            }
        }
    } catch (error) {
        res.status(500).json({ message: "catch error", error })
    }

}

// - Update comment ( by comment owner only )
export const updateComment = async (req, res) => {
    try {
        const { id } = req.params
        const { commentBody } = req.body

        const comment = await commentModel.findOneAndUpdate({ _id: id, isDeleted: false, createdBy: req.user._id },
            { commentBody },
            { new: true }
        )


        comment ?
            res.status(200).json({ message: 'comment updated successfully', comment })
            : res.status(400).json({ message: 'invalid input data or this comment is marked as deleted', comment })
    } catch (error) {
        res.status(500).json({ message: "catch error", error })
    }
}


// - SoftDelete comment ( by product owner or comment owner , and add who is delete the comment in deletedby field in the comment model ) 
export const SoftDeleteComment = async (req, res) => {

    try {
        const { id } = req.params

        const comment = await commentModel.findOne({ _id: id, isDeleted: false })

        if (!comment) {
            res.status(404).json({ message: "comment not found , please enter a valid comment id or Comment already marked as deleted " });
        } else {
            const product = await productModel.findOne({ _id: comment.productId })
            if (
                req.user._id.toString() == comment.createdBy.toString() ||
                req.user._id.toString() == product.createdBy.toString()
            ) {

                const softdeletedComment = await commentModel.updateOne({ _id: id, isDeleted: false },
                    { isDeleted: true, deletedBy: req.user._id }, { new: true }
                )

                softdeletedComment.modifiedCount ?
                    res.status(200).json({ message: "Comment marked as deleted successfully", softdeletedComment })
                    : res.status(400).json({ message: "Comment is already marked as deleted", softdeletedComment })
            } else {
                res.status(401).json({ message: "Unauthorized: you can't softdeletd this comment" });
            }
        }

    } catch (error) {
        res.status(500).json({ message: "catch error", error })
    }
}
