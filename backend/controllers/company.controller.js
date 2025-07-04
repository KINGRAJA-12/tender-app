import { Op } from "sequelize";
import { Company } from "../models/company.model.js";
import { Service } from "../models/service.model.js";
import { User } from "../models/user.model.js";
export const updateCompanyProfile = async (req, res) => {
  try {
    let userId = req.user?.id;
    let { companyName, address, description } = req.body;
    let company = await Company.findOne({ where: { userId } });
    if(!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    if(companyName) company.companyName = companyName;
    if(address) company.address = address;
    if(description) company.description = description;
    await company.save();
    return res.status(200).json({ message: "Company profile updated", company });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const viewCompany=async(req,res)=>{
    try{
        let {companyId}=req?.params;
        if(!companyId){
            return res.status(400).json({message:'Require id is missing'});
        }
        let company=await Company.findByPk(companyId);
        console.log(company)
        if(!company){
            return res.status(400).json({message:"No such company found"});
        }
        
        let service=await Service.findAll({
          where:{
            companyInfo:company?.id
          }
        })
        let user=await User.findOne({
          where:{
            id:company?.userId
          }
        })
        return res.status(200).json({company,service,user});
    }catch(err){
        console.log(err?.message);
        return res.status(500).json({message:"Internal server error"});
    }
}
export const getAllCompany = async (req, res) => {
  try {
    let userId = req?.user?.id;
    let company = await Company.findAll({
      where: {
        userId: {
          [Op.ne]: userId,
        },
      },
    });

    return res.status(200).json(company);
  } catch (err) {
    console.error(err?.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};