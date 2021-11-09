import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import express from "express";
import db from "./config/Database.js";
import router from "./routes/index.js";
import cors from "cors";

dotenv.config();
const app = express();

try {
    await db.authenticate();
    console.log('Database connected...');
} catch (err) {
    console.log(error);
}

app.use(cors({ credentials: true, origin: "http://45.76.151.160:3000", optionsSuccessStatus: 200 }));
app.use(cookieParser());
app.use(express.json());
app.use(router);

app.listen(5000, () => console.log("Server running at port 5000"));
