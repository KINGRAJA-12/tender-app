import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { dbConnect } from "./configurations/db.js";
import cors from "cors";
import { authRouters } from "./routers/auth.routes.js";
import { tenderRouter } from "./routers/tender.routes.js";
import { serviceRuter } from "./routers/service.routes.js";
import { applicationRouter } from "./routers/application.routes.js";
import { companyRouter } from "./routers/company.routes.js";
dotenv.config();
let app=express();
app.use(express.json({
    limit:"20mb"
}));
app.use(cookieParser())
app.use(cors({
    origin:"http://localhost:3000",
    credentials:true
}))
app.use("/api/v1/auth",authRouters);
app.use("/api/v1/tender",tenderRouter);
app.use("/api/v1/service",serviceRuter);
app.use("/api/v1/apply",applicationRouter);
app.use("/api/v1/company",companyRouter);
let port=process.env.PORT||5000;
app.listen(port,async()=>{
    await dbConnect();
    // await sequelize.sync()
    console.log(`server stary at port ${port}`);
})
