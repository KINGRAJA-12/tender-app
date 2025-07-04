import express from "express";
import { protect } from "../middleware/middleware.js";
import { createService, deleteService, getAllServices, updateService } from "../controllers/service.controller.js";
export const serviceRuter=express.Router();
serviceRuter.post("/add-service",protect,createService);
serviceRuter.get("/delete-service/:serviceId",protect,deleteService);
serviceRuter.post("/update-service/:serviceId",protect,updateService);
serviceRuter.get("/get-all-service",protect,getAllServices);
// serviceRuter.get("/get-service-by-company/:id",protect)