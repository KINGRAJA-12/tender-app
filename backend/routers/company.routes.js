import express from "express"
import { protect } from "../middleware/middleware.js";
import { getAllCompany, updateCompanyProfile, viewCompany } from "../controllers/company.controller.js";
export const companyRouter=express.Router();
companyRouter.post("/update-profile",protect,updateCompanyProfile);
companyRouter.get("/view-company/:companyId",protect,viewCompany);
companyRouter.get("/get-all-company",protect,getAllCompany)