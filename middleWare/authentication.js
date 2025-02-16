import jwt from 'jsonwebtoken'
import userModel from '../DB/model/user.model.js'




const auth = () => {
    return async (req, res, next) => {

        try {
            const { authorization } = req.headers

            if (!authorization.startsWith(process.env.BearerKey)) {
                res.status(400).json({ message: 'In-valid Bearer key' })
            } else {
                const token = authorization.split(process.env.BearerKey)[1]
                const decoded = jwt.verify(token, process.env.tokenSignature)
                if (!decoded || !decoded.id || !decoded.isLoggedIn) {
                    res.status(400).json({ message: 'In-valid token pay load' })
                } else {
                    const user = await userModel.findById(decoded.id).select(' firstName email Role ')
                    if (!user) {
                        res.status(404).json({ message: "user doesn't exist " });
                    } else {
                        req.user = user
                        next()
                    }
                }
            }
        } catch (error) {
            res.status(500).json({ message: 'catch error', error })
        }
    }
}


export default auth