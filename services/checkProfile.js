import userModel from "../DB/model/user.model.js"


export const checkProfile = () => {
    return async (req, res, next) => {

        try {
            const user = await userModel.findById(req.user._id)
            console.log(user.address);

            if (user.address && user.age && user.phone) {
                next()
            } else {
                res.status(400).json({ message: 'please complete your profile data' })

            }
        } catch (error) {
            res.status(500).json({ message: 'catch error', error })
        }
    }

}