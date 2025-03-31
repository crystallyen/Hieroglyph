import express from "express"
import cors from "cors"
import 'dotenv/config';

const app = express()

const port = process.env.PORT || 3001

const corsOptions = {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
};

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});