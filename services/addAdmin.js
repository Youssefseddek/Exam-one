import userModel from "../DB/model/user.model.js";
import bcrypt from 'bcryptjs'



export const addAdmin = async () => {

    const user = await userModel.findOne({ Role: 'Admin' })
    if (!user) {
        const hashPassword = bcrypt.hashSync('Admin@123', parseInt(process.env.saltRound))
        const newAdmin = new userModel({ firstName: 'Youssef', lastName: 'Mostafa', email: 'admin@gmail.com', password: hashPassword, Role: 'Admin', confirmEmail: true })
        const savedAdmin = await newAdmin.save()
        console.log("Admin added successfully");
    }


}


export default addAdmin