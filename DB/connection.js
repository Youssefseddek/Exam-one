import mongoose from "mongoose";



const connectDB = () => {
    mongoose.connect(process.env.DB_URL)
        .then(result => {
            // console.log(result);
            console.log(`connected to DB ............`);

        }).catch(error => console.log(`Fail to connect DB ............`, error))
}


export default connectDB