import mongoose from "mongoose";



const commentSchema = new mongoose.Schema({

    commentBody: {
        type: String,
        required: true
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true
})


const commentModel = mongoose.model('Comment', commentSchema)

export default commentModel


