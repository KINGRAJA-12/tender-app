import { Tender } from "../models/relationship.js";
import { Company } from "../models/relationship.js";
import { Op } from "sequelize";
import {Application} from "../models/application.model.js";
export const createTender = async (req, res) => {
    try {
        let userId= req?.user?.id;
        if (!userId) {
            return res.status(400).json({ message: "CompanyId is required" });
        }
        let company = await Company.findOne({
            where:{
                userId:userId
            }
        });
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }
        let { title, description, deadline, budget, tenderDate } = req.body;
        if (!title || !description || !deadline || !budget || !tenderDate) {
            return res.status(400).json({ message: "All fields are required" });
        }
        let deadlineDate = new Date(deadline);
        let tenderCreatedDate = new Date(tenderDate);
        if (isNaN(deadlineDate) || isNaN(tenderCreatedDate)) {
            return res.status(400).json({ message: "Invalid date format" });
        }
        if (new Date() >= deadlineDate) {
            return res.status(400).json({ message: "Deadline must be in the future" });
        }
        if (tenderCreatedDate < deadlineDate) {
            return res.status(400).json({ message: "Tender date cannot be after the deadline" });
        }
        let tender = await Tender.create({
            title,
            description,
            deadline: deadlineDate,
            budget,
            tenderDate: tenderCreatedDate,
            postedBy: company.id,
        });
        return res.status(201).json({ message: "Tender created successfully", tender });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
export const updateTender = async (req, res) => {
    try {
        let userId=req?.user?.id
        let {tenderId}=req?.params
        let {title, description, deadline, budget, tenderDate } = req.body;
        if (!userId || !tenderId) {
            return res.status(400).json({ message: "User ID and Tender ID are required" });
        }
        let company = await Company.findOne({
            where:{
                userId:userId
            }
        });
        if(!company){
            return res.status(400).json({message:"required data is missing"});
        }
        let tender = await Tender.findOne({
            where: {
                postedBy: company?.id,
                id: tenderId
            }
        });
        if(!tender) {
            return res.status(404).json({ message: "No such tender found" });
        }
        if(tender.allocatedTo) {
            return res.status(400).json({ message: "This tender is already allocated and cannot be updated" });
        }
        if (title !== undefined) tender.title = title;
        if (description !== undefined) tender.description = description;
        if (deadline !== undefined) {
            let newDeadline = new Date(deadline);
            if (isNaN(newDeadline)) return res.status(400).json({ message: "Invalid deadline date" });
            tender.deadline = newDeadline;
        }
        if (budget !== undefined) tender.budget = budget;
        if (tenderDate !== undefined) {
            let newTenderDate = new Date(tenderDate);
            if (isNaN(newTenderDate)) return res.status(400).json({ message: "Invalid tender date" });
            tender.tenderDate = newTenderDate;
        }
        await tender.save();
        return res.status(200).json({ message: "Tender updated successfully", tender });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
export const closeTender=async(req,res)=>{
    try{
        let userId=req?.user?.id;
        let {tenderId}=req?.params;
        if(!tenderId || !userId){
            return res.status(400).json({message:"Required id's are misssing"});
        }
        let company = await Company.findOne({
            where:{
                userId:userId
            }
        });
        if(!company){
            return res.status(400).json({message:"required company data is missing"});
        }
        let tender=await Tender.findOne({where:{
            id:tenderId,
            postedBy:company?.id
        }})
        if(!tender){
            return res.status(400).json({message:'required tender is missing'});
        }
        tender.status="close";
        await tender.save();
        return res.status(200).json({message:"tender closed successfully"});
    }catch(err){
        console.log(err?.message);
        return res.status(500).json({message:"Internal server error"});
    }
}
export const deleteTender=async(req,res)=>{
    try{
        let userId=req?.user?.id;
        let {tenderId}=req?.params;
        if(!userId||!tenderId){
            return res.status(400).json({message:"required company is missing"});
        }
        let company = await Company.findOne({
            where:{
                userId:userId
            }
        });
        if(!company){
            return res.status(400).json({message:"required comapny data is missing"});
        };
        let tender=await Tender.findOne({
            where:{
                id:tenderId,
                postedBy:company?.id
            }
        })
        if(!tender){
            return res.status(400).json({message:"No such tender found"});
        }
        await tender.destroy();
        return res.status(200).json({message:"deleted sucessfully"});

    }catch(err){
        console.log(err?.message);
        return res.status(500).json({message:"Internal server error"});
    }
}
export const allocateTender=async(req,res)=>{
    try{
        let userId=req?.user?.id;
        let {tenderId,toId}=req?.params;
        if(!userId || !tenderId || !toId){
            return res.status(400).json({message:"required Id's missing"});
        }
        let secondOrg=await Company.findOne({
            where:{
                userId:toId
            }
        });
        if(!secondOrg){
            return res.status(400).json({message:"Required client is missing"})
        }
        let company = await Company.findOne({
            where:{
                userId:userId
            }
        });
        if(!company){
            return res.status(400).json({message:"Required company data is missing"});
        }
        let tender=await Tender.findOne({
            where:{
                id:tenderId,
                postedBy:company?.id
            }
        })
        if(!tender){
            return res.status(400).json({message:"no such tender found"});
        }
        tender.allocatedTo=secondOrg?.id;
        tender.status="close";
        await tender.save();
        return res.status(200).json({message:"allocated successfully"});
    }catch(err){
        console.log(err?.message);
        return res.status(500).json({message:"Internal server error"});
    }
}
//export const getAllAplicationToTheTender=async(req,res)=>{
//     try{
//         let {tenderId}=req?.params;
//         if(!tenderId){
//             return res.status(400).json({message:"required tender id is missing"});
//         }
//        let applications = await Application.findAll({
//         where: {
//             tenderId: tenderId
//         },
//         include: {
//             model: Company,
//             as: "participant",
//             attributes: ["id", "companyName", "logo"]
//         }
//     });
//     console.log(applications)
//     return res.status(200).json(applications);
//     }catch(err){
//         console.log(err?.message);
//         return res.status(500).json({message:"Internal server error"});        
//     }
// }
export const getAllTender=async(req,res)=>{
    try{
        let userId=req?.user?.id;
        let company=await Company.findOne({
            where:{
                userId:userId
            }
        })
        if(!company){
            return res.status(400).json({message:"No such company found"});
        }
        let tenders = await Tender.findAll({
            where: {
                postedBy: company?.id
            },

            include: [
        {
          model: Company,
          attributes: ["id", "companyName", "logo", "address", "description"],
        },]
            ,order: [['createdAt', 'DESC']]
            });
            return res.status(200).json(tenders);
    }catch(err){
        console.log(err?.message);
        return res.status(500).json({message:"Internal server error"});
    }
}
export const getAllCompaniesExceptMyTendors=async(req,res)=>{
    try{
        let userId=req?.user?.id;
        console.log(userId)
        let comapny=await Company.findOne({
            where:{
                userId
            }
        })
        if(!comapny){
            return res.status(200).json({message:"Required user not found"});
        }
        let tender=await Tender.findAll({
            where:
            {
                postedBy:{
                    [Op.ne]:comapny?.id
                }
            },
            order: [['createdAt', 'DESC']]
        })
        return res.status(200).json(tender);
    }catch(err){
        console.log(err?.message);
        return res.status(500).json({message:"Internel server error"});
    }
}
export const viewTender = async (req, res) => {
  try {
    let { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "No such ID is found" });
    }

    const tender = await Tender.findByPk(id, {
      include: {
        model: Company,
        as: 'postedCompany',
        attributes: ['id', 'companyName', 'logo']
      }
    });

    if (!tender) {
      return res.status(404).json({ message: "Tender not found" });
    }

    return res.status(200).json(tender);
  } catch (err) {
    console.log(err?.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
