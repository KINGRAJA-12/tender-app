import { Application } from "../models/application.model.js";
import { Company } from "../models/company.model.js";
import { Tender } from "../models/tendor.model.js";
import { Op } from "sequelize";
export const createApplication = async (req, res) => {
  try {
    let userId = req?.user?.id;
    let { tenderId, message } = req.body;
    if (!tenderId || !message) {
      return res.status(400).json({ message: "Tender ID and message are required" });
    }
    let company = await Company.findOne({ where: { userId } });
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    let tender = await Tender.findByPk(tenderId);
    if (!tender || tender.status === "close") {
      return res.status(404).json({ message: "Tender not found or already closed" });
    }
    if(tender.postedBy===company.id){
      return res.status(400).json({message:"you caanot apply you tender"});
    }
    let existingApp = await Application.findOne({
      where: { tenderId, companyId: company.id }
    });
    if (existingApp) {
      return res.status(400).json({ message: "You already applied for this tender" });
    }
    let application = await Application.create({
      tenderId,
      companyId: company.id,
      message
    });
    return res.status(201).json({ message: "Application submitted", application });
  } catch (err) {
    console.error(err?.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const getMyApplications = async (req, res) => {
  try {
    let userId = req?.user?.id;
    let company = await Company.findOne({ where: { userId } });
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    let applications = await Application.findAll({
      where: { companyId: company.id },include:{
        model:Tender,
        attributes:["id","title","description","deadline","status","budget","postedBy","allocatedTo"]
        ,include:{
          model:Company,
          as:'postedCompany',
          attributes:["id","companyName","logo"]
        }
      }
    });
    console.log(applications)
    return res.status(200).json({ applications });
  } catch (err) {
    console.error(err?.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const updateApplication = async (req, res) => {
  try {
    let userId = req?.user?.id;
    let { applicationId } = req?.params;
    let { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }
    let company = await Company.findOne({ where: { userId } });
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    let application = await Application.findOne({
      where: {
        id: applicationId,
        companyId: company.id
      }
    });
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    application.message = message;
    await application.save();
    return res.status(200).json({ message: "Application updated", application });
  } catch (err) {
    console.error(err?.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const deleteApplication = async (req, res) => {
  try {
    let userId = req?.user?.id;
    let { applicationId } = req?.params;
    let company = await Company.findOne({ where: { userId } });
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    let application = await Application.findOne({
      where: {
        id: applicationId,
        companyId: company.id
      }
    });
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    await application.destroy();
    return res.status(200).json({ message: "Application deleted successfully" });
  } catch (err) {
    console.error(err?.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const acceptRequest = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { applicationId } = req.params;

    if (!applicationId) return res.status(400).json({ message: "Application ID required" });

    const company = await Company.findOne({ where: { userId } });
    if (!company) return res.status(404).json({ message: "Company not found" });

    const application = await Application.findOne({
      where: { id: applicationId, status: "pending" }
    });
    if (!application) return res.status(404).json({ message: "Application not found or already processed" });

    const tender = await Tender.findOne({
      where: {
        id: application.tenderId,
        postedBy: company.id,
        allocatedTo: null,
        status: "open",
        deadline: { [Op.gte]: new Date() }
      }
    });
    if (!tender) return res.status(404).json({ message: "Tender not eligible for allocation" });

    // Accept and allocate
    application.status = "accept";
    await application.save();

    tender.allocatedTo = application.companyId;
    tender.status = "close";
    await tender.save();

    // Reject all other pending applications
    await Application.update(
      { status: "reject" },
      {
        where: {
          tenderId: tender.id,
          status: "pending",
          id: { [Op.ne]: application.id }
        }
      }
    );

    return res.status(200).json({ message: "Application accepted and tender allocated" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const rejectRequest=async(req,res)=>{
    try{
        let userId=req?.user?.id;
        let {applicationId}=req?.params;
        if(!applicationId){
            return res.status(400).json({message:'requied Id missing'});
        }
        let company=await Company.findOne({
            where:{
                userId
            }
        });
        if(!company){
            return res.status(400).json({message:"required company is missing"});
        }
        const tender = await Tender.findOne({
            where: {
                [Op.and]: [
                    { postedBy: company.id },
                    { allocatedTo: null },
                    { status: "open" },
                    {
                        deadline: {
                            [Op.gte]: new Date()
                        }
                    }
                ]
            }
        });
        if(!tender){
            return res.status(400).json({message:"NO such tender is found"});
        }
        let application=await Application.findOne({
            where:{
                id:applicationId,
                tenderId:tender?.id,
                status:'pending'
            }
        })
        application.status="reject";
        await application.save();
        return res.status(200).json({message:"Application rejected"})

    }catch(err){
        console.error(err?.message);
        return res.status(500).json({ message: "Internal server error" });        
    }
}
export const getAllMyPendingApplication=async(req,res)=>{
  try{
    let userId=req?.user?.id;
    let comapny=await Company.findOne({
      where:{
        userId
      }
    })
    if(!comapny){
      return res.status(400).json({message:"Required company information is missiing"});
    }
    let applications=await Application.findAll({
      where:{
        companyId:comapny?.id,
        status:"pending"
      },
      include:{
        model:Tender,
        attributes:["id","title","description","deadline","status","budget","postedBy","allocatedTo"]
        ,include:{
          model:Company,
          as:'postedCompany',
          attributes:["id","companyName","logo"]
        }
      }
    })
    return res.status(200).json(applications);
  }catch(err){
    console.log(err?.message);
    return res.status(500).json({message:"internel server error"});
  }
}
export const getAllMyAcceptedApplication=async(req,res)=>{
  try{
    let userId=req?.user?.id;
    let comapny=await Company.findOne({
      where:{
        userId
      }
    })
    if(!comapny){
      return res.status(400).json({message:"Required company information is missiing"});
    }
    let applications=await Application.findAll({
      where:{
        companyId:comapny?.id,
        status:"accept"
      },include:{
        model:Tender,
        attributes:["id","title","description","deadline","status","budget","postedBy","allocatedTo"]
        ,include:{
          model:Company,
          as:'postedCompany',
          attributes:["id","companyName","logo"]
        }
      }
    })
    return res.status(200).json(applications);
  }catch(err){
    console.log(err?.message);
    return res.status(500).json({message:"internel server error"});
  }
}
export const getAllMyRejectedApplication=async(req,res)=>{
  try{
    let userId=req?.user?.id;
    let comapny=await Company.findOne({
      where:{
        userId
      }
    })
    if(!comapny){
      return res.status(400).json({message:"Required company information is missiing"});
    }
    let applications=await Application.findAll({
      where:{
        companyId:comapny?.id,
        status:"reject"
      },include:{
        model:Tender,
        attributes:["id","title","description","deadline","status","budget","postedBy","allocatedTo"]
        ,include:{
          model:Company,
          as:'postedCompany',
          attributes:["id","companyName","logo"]
        }
      }
    })
    console.log(applications,"rejeceted is called")
    return res.status(200).json(applications);
  }catch(err){
    console.log(err?.message);
    return res.status(500).json({message:"internel server error"});
  }
}
export const getAllAplicationToTheTender = async (req, res) => {
  try {
    const { tenderId } = req.params;

    if (!tenderId) {
      return res.status(400).json({ message: "Required tender ID is missing" });
    }

    const applications = await Application.findAll({
      where: { tenderId },
      include: [
        {
          model: Company,
          as: "participant",
          attributes: ["id", "companyName", "logo", "address", "description"],
        },
        {
          model: Tender,
          attributes: ["id", "title", "description", "status", "deadline"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json(applications);
  } catch (err) {
    console.error(err?.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};


