import mongoose from "mongoose";



const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: String,
    age: Number,
    address: String,
    gender: {
        type: String,
        enum: ['Male', 'Female'],
        default: 'Male'
    },
    confirmEmail: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    code: {
        type: String,
        default: ''
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    isOnline: {
        type: Boolean,
        default: false
    },
    lastSeen: Date,
    Role: {
        type: String,
        enum: ['User', 'Admin'],
        default: 'User'
    } ,//( user , admin ) ( by default is user )
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    Use_Reset_link:{ type: Boolean, default: false }, 


}, {
    timestamps: true
})


const userModel = mongoose.model('User', userSchema)

export default userModel




