import userModel from "../../../DB/model/user.model.js"
import CryptoJS from "crypto-js"
import { myEmail } from "../../../services/sendEmail.js"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
// import moment from "moment"
import moment from 'moment-timezone'



// - Get user by id
export const UserById = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id)
        res.status(200).json({ message: 'Done', user })
    } catch (error) {
        res.status(500).json({ message: 'catch error', error })
    }
}


// - Update profile ( by account owner only )
export const updateProfile1 = async (req, res) => {

    try {


        const { age, gender, myPhone, address } = req.body
        console.log(req.body);
        let phone
        if (myPhone) {

            const cipherPhone = CryptoJS.AES.encrypt(myPhone, process.env.encryptionKey).toString()
            phone = cipherPhone
        }

        const updateUser = await userModel.findOneAndUpdate({ _id: req.user._id, isBlocked: false, isDeleted: false },
            { age, gender, phone, address },
            { new: true }
        )

        res.status(200).json({ message: 'Profile updated successfuly', updateUser })
    } catch (error) {
        res.status(500).json({ message: 'catch error', error })
    }
}


export const updateProfile = async (req, res) => {
    try {
        const { email, age, address, myPhone, firstName, lastName } = req.body;
        if (email) {
            await userModel.findOneAndUpdate(
                { _id: req.user._id, isDeleted: false, isBlocked: false },
                {
                    confirmEmail: false,
                    email
                }
            );
            const token = jwt.sign({ id: req.user._id }, process.env.tokenEamilSignature)
            const message = `
            <a href='${req.protocol}://${req.headers.host}${process.env.BASE_URL}/auth/confirmEmail/${token}'>Follow me to activate your account</a>
            `;
            myEmail(email, message, "Confiramtion email");
        }
        let phone
        if (myPhone) {
            const encryptedPhone = CryptoJS.AES.encrypt(
                myPhone,
                process.env.encryptionKey
            ).toString();
            phone = encryptedPhone
        }
        if (address || lastName || firstName || age) {
            await userModel.findOneAndUpdate(
                { _id: req.user._id, isDeleted: false, isBlocked: false },
                {
                    address,
                    firstName,
                    lastName,
                    age,
                    phone
                }
            );
        }
        res.status(200).json({
            message:
                "Updated Done ,please check your email for confirmation if you update your email"
        });
    } catch (error) {
        res.status(500).json({ message: 'catch error', error })
    }
};


// - Upadete password ( by account owner only )
export const updatePassword = async (req, res) => {

    try {
        const { oldPassword, newPassword } = req.body

        const user = await userModel.findOne({ _id: req.user._id, isBlocked: false, isDeleted: false }).select('password')

        const match = bcrypt.compareSync(oldPassword, user.password)
        if (!match) {
            res.status(400).json({ message: 'password is rong' })
        } else {
            const hashPassword = bcrypt.hashSync(newPassword, parseInt(process.env.saltRound))

            const updatePass = await userModel.updateOne({ _id: user._id },
                { password: hashPassword }
            )

            updatePass.modifiedCount
                ? res.status(200).json({ message: 'password updated successfully' })
                : res.status(400).json({ message: 'fail to update password' })
        }

    } catch (error) {
        res.status(500).json({ message: 'catch error', error })

    }
}


// - Softdelete profile ( by account owner only )
export const softDelete = async (req, res) => {

    try {
        const user = await userModel.findOneAndUpdate({ _id: req.user._id, isBlocked: false, isDeleted: false },
            {
                isDeleted: true
            }, { new: true }
        )

        user
            ? res.status(200).json({ message: 'Account marked as deleted successfully' })
            : res.status(400).json({ message: " This account is already marked as deleted or blockecd from the admin side " })

    } catch (error) {
        res.status(500).json({ message: 'catch error', error })

    }
}


// - Forget password ( the link must be  used only one time in another word the link must be valid for only one time access )
// - Refresh token



// - Block account ( by admin only )( inside the app file  , create function fires when ever you run the server , this function will add a user in user collection but with admin role to be able to access the block account API )
export const blockAccount = async (req, res) => {

    try {
        const { id } = req.params
        if (req.user.Role == "Admin") {
            const blockUser = await userModel.findOneAndUpdate({ _id: id, isBlocked: false, isDeleted: false, Role: 'User' },
                {
                    isBlocked: true
                }, { new: true }
            )

            blockUser
                ? res.status(200).json({ message: 'Account blocked successfully' })
                : res.status(400).json({ message: " This account already blocked or not exist" })

        } else {
            res.status(401).json({ message: 'you are not admin (Unauthorized to access this API)' })
        }

    } catch (error) {
        res.status(500).json({ message: 'catch error', error })

    }
}



// - SignOut ( return the lastSeen in the response )
export const signOut = async (req, res) => {

    const user = await userModel.updateOne({ _id: req.user._id, isOnline: true },
        {
            lastSeen: moment().tz('Africa/Cairo').format(),
            isOnline: false
        }
    )

    user.modifiedCount
        ? res.status(200).json({ message: 'sign out successfully' })
        : res.status(400).json({ message: " fail to sign out" })
}



// - Get all users with their products with  the comments on each product ( decrypt user’s phone  , don’t get products with isDeleted equal true) 

export const allUsers = async (req, res) => {
    try {
        const users = await userModel.find({ isBlocked: false, isDeleted: false, Role: "User" }).populate(
            {
                path: 'products',
                match: { isDeleted: false },
                populate: [
                    {
                        path: 'comments',
                        match: { isDeleted: false }
                    }
                ]
            }
        )

        if (users.length) {

            users.map(element => {
                if (element.phone) {

                    const nphone = CryptoJS.AES.decrypt(element.phone, process.env.encryptionKey).toString(CryptoJS.enc.Utf8);
                    element.phone = nphone
                    console.log(nphone);
                }

            });
            res.status(200).json({ message: 'Done', users })
        } else {
            res.status(400).json({ message: " user not found" })
        }


    } catch (error) {
        res.status(500).json({ message: 'catch error', error })
    }
}


// ys
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3N2M0YzhlNWUzZTZmNzhkODEzN2FhMyIsImlzTG9nZ2VkSW4iOnRydWUsImlhdCI6MTczNjI2NzYxMSwiZXhwIjoxNzM2MzU0MDExfQ.o_W_a9dtYGasWS1cpKllH9mWji9FLs_7SuFIUfUzRyE



// ym
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3N2IwMmRjMjZiNTg1ZGNiNWYzMjVhZCIsImlzTG9nZ2VkSW4iOnRydWUsImlhdCI6MTczNjI3MDI1NywiZXhwIjoxNzM2MzU2NjU3fQ.QcJGaEeX0e_95hRh7nLxsdnrp-yzrInt8LrXSjrz04c

// admin
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3N2JlMjhiYmQ0ZDk3MDJlZDFjMTY1YSIsImlzTG9nZ2VkSW4iOnRydWUsImlhdCI6MTczNjI3MDMyMSwiZXhwIjoxNzM2MzU2NzIxfQ.RmQnVMl4qf0bEcWp5ITtZue6GClnyKK68a_E7JpMycE