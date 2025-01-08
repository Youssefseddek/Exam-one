import userModel from "../../../DB/model/user.model.js"
import bcrypt from 'bcryptjs'
import CryptoJS from "crypto-js"
import { myEmail } from "../../../services/sendEmail.js"
import jwt from 'jsonwebtoken'
import { nanoid } from 'nanoid'

// - SignUp ( hash password , encrypt phone , send confirmation email ) 
export const signup = async (req, res) => {

    try {
        const { firstName, lastName, email, password, phone } = req.body

        const user = await userModel.findOne({ email })
        if (user) {
            res.status(409).json({ message: 'Email Exist' })
        } else {
            const cipherPhone = CryptoJS.AES.encrypt(phone, process.env.encryptionKey).toString();
            const hashPassword = bcrypt.hashSync(password, parseInt(process.env.saltRound))

            const newUser = new userModel({ firstName, lastName, email, password: hashPassword, phone: cipherPhone })
            const saveduser = await newUser.save()

            const token = jwt.sign({ id: saveduser._id }, process.env.tokenEamilSignature, { expiresIn: '1h' })
            const refToken = jwt.sign({ id: saveduser._id }, process.env.tokenEamilSignature, { expiresIn: 60 * 60 * 24 })
            const confirmEmailLink = `${req.protocol}://${req.headers.host}${process.env.BASE_URL}/auth/confirmEmail/${token}`
            const refTokenlink = `${req.protocol}://${req.headers.host}${process.env.BASE_URL}/auth/refreshToken/${refToken}`
            const message = `
                <a href = ${confirmEmailLink}> click here to confirm your email </a>
                <br>
                <br>
                <a href=${refTokenlink}>Click here to refresh your token if its expired </a>
            `
            myEmail(saveduser.email, message, 'Confirmation Email')

            res.status(201).json({ message: 'Your account created successfully please confirm your email', saveduser })

        }
    } catch (error) {
        res.status(500).json({ message: 'catch error', error })
    }
}





export const confirmEmail = async (req, res) => {

    try {

        const { token } = req.params

        const decoded = jwt.verify(token, process.env.tokenEamilSignature)

        if (!decoded?.id) {
            res.status(400).json({ message: "In-valid payload" });
        } else {
            const user = await userModel.updateOne({ _id: decoded.id, confirmEmail: false },
                { confirmEmail: true }
            )

            user.modifiedCount ?
                res.status(200).json({ message: "Done please login" })
                : res.status(400).json({ message: "Already confirmed" });
        }

    } catch (error) {
        res.status(500).json({ message: 'catch error', error })
    }

}


// - Refresh token
export const refreshToken = async (req, res) => {

    try {

        const { token } = req.params
        console.log({ token });
        console.log(process.env.tokenEamilSignature);
        const decoded = jwt.verify(token, process.env.tokenEamilSignature)
        console.log({ decoded });

        if (!decoded?.id) {
            res.status(400).json({ message: "In-valid payload" });
        } else {
            const user = await userModel.findById(decoded.id).select('email confirmEmail')
            if (!user) {
                res.status(404).json({ message: "user doesn't exist " });
            } else {
                if (user.confirmEmail) {
                    res.status(409).json({ message: "Email Already confirmed" });
                } else {
                    const token = jwt.sign({ id: user._id }, process.env.tokenEamilSignature, { expiresIn: 5 * 60 })
                    const confirmEmailLink = `${req.protocol}://${req.headers.host}${process.env.BASE_URL}/auth/confirmEmail/${token}`
                    const message = `
                    <a href = ${confirmEmailLink}> click here to confirm your email </a>
                `
                    myEmail(user.email, message, 'Confirmation Email')
                    res.status(200).json({ message: "Done" });
                }
            }
        }
    } catch (error) {
        res.status(500).json({ message: 'catch error', error })
    }

}


// - SignIn ( must be confirmed and not deleted or blocked )
export const signIn = async (req, res) => {
    try {

        const { email, password } = req.body

        const user = await userModel.findOne({ email })
        if (!user) {
            res.status(404).json({ message: "user doesn't exist " });
        } else {
            if (!user.confirmEmail) {
                res.status(400).json({ message: "Please Confirm your email first" });
            } else {
                if (user.isDeleted || user.isBlocked) {
                    res.status(400).json({ message: "you cannot login because your account is softdeleted or blocked by the admin" });
                } else {
                    const match = bcrypt.compareSync(password, user.password)
                    if (!match) {
                        res.status(400).json({ message: "In-valid Password" });
                    } else {
                        const token = jwt.sign({ id: user._id, isLoggedIn: true }, process.env.tokenSignature, { expiresIn: 60 * 60 * 24 })
                        await userModel.updateOne({ _id: user._id }, { isOnline: true })
                        res.status(200).json({ message: 'Done', token })
                    }
                }
            }
        }
    } catch (error) {
        res.status(500).json({ message: 'catch error', error })
    }
}



// - Forget password ( the link must be  used only one time in another word the link must be valid for only one time access ) 
export const sendCode = async (req, res) => {
    try {

        const { email } = req.body

        const user = await userModel.findOneAndUpdate({ email, isBlocked: false, isDeleted: false },

            {
                Use_Reset_link: false
            }
        )

        if (!user) {
            res.status(404).json({ message: 'In-valid email' })
        } else {

            const code = nanoid()
            const updateCode = await userModel.updateOne({ _id: user._id },
                {
                    code
                }
            )

            const token = jwt.sign({ id: user._id }, process.env.tokenSignature, { expiresIn: 60 * 60 })

            const message = `<div>
            <h1> your code is </h1>
            <p> ${code} </p>
            <a href='${req.protocol}://${req.headers.host}${process.env.BASE_URL}/auth/forgetPassword/${token}'>Follow me to continue</a>
            </div>`;
            myEmail(user.email, message, 'Verfication Email')

            res.status(200).json({ message: 'please check your email to get your code' })
        }


    } catch (error) {
        res.status(500).json({ message: 'catch error', error })
    }


}



export const forgetPassword = async (req, res) => {

    try {
        const { code, newPassword } = req.body

        const { token } = req.params
        const decoded = jwt.verify(token, process.env.tokenSignature)

        if (!decoded) {
            res.status(404).json({ message: 'In-valid token payload' })
        } else {

            const user = await userModel.findById(decoded.id)
            if (user.Use_Reset_link) {
                res.status(400).json({ message: 'this link is used before' })
            } else {
                const match = bcrypt.compareSync(newPassword, user.password)
                if (match) {
                    res.status(400).json({ message: ' Sorry this password is match the old password please change it' })
                } else {
                    const hashPassword = bcrypt.hashSync(newPassword, parseInt(process.env.saltRound))
                    const updatePassword = await userModel.updateOne({ _id: user._id, code },
                        {
                            password: hashPassword,
                            Use_Reset_link: true
                        }
                    )


                    updatePassword.modifiedCount
                        ? res.status(200).json({ message: 'update password successfully' })
                        : res.status(404).json({ message: 'fail to update password' })
                }
            }
        }
    } catch (error) {
        res.status(500).json({ message: 'catch error', error })

    }

}

