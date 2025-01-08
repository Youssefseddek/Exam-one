import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import * as allRouter from './modules/index.router.js'
import connectDB from './DB/connection.js'
import addAdmin from './services/addAdmin.js'

const app = express()
const port = process.env.PORT
const baseUrl = process.env.BASE_URL

app.use(express.json())

app.use(`${baseUrl}/auth`, allRouter.authRouter)
app.use(`${baseUrl}/user`, allRouter.userRouter)
app.use(`${baseUrl}/product`, allRouter.productRouter)
app.use(`${baseUrl}/comment`, allRouter.commentRouter)





app.get('*', (req, res) => res.status(404).json('404 Not Found Page'))

addAdmin()
connectDB()
app.listen(port, () => console.log(`Server Is Running on port ${port}!`))