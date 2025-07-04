import { Service } from "../models/service.model.js";
import { Company } from "../models/company.model.js";
export const createService = async (req, res) => {
  try {
    let userId = req?.user?.id;
    let { serviceName } = req.body;
    if (!serviceName) {
      return res.status(400).json({ message: "Service name is required" });
    }
    let company = await Company.findOne({ where: { userId } });
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    let service = await Service.create({ serviceName, companyInfo: company.id });
    return res.status(201).json({ message: "Service created successfully", service });
} catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const getAllServices = async (req, res) => {
  try {
    let userId = req?.user?.id;
    let company = await Company.findOne({ where: { userId } });
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    let services = await Service.findAll({ where: { companyInfo: company.id } });
    return res.status(200).json({ services });
} catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const updateService = async (req, res) => {
  try {
    let userId = req?.user?.id;
    let { serviceId } = req.params;
    let { serviceName } = req.body;
    if (!serviceName) {
      return res.status(400).json({ message: "Service name is required" });
    }
    let company = await Company.findOne({ where: { userId } });
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    let service = await Service.findOne({
      where: {
        id: serviceId,
        companyInfo: company.id
      }
    });
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    service.serviceName = serviceName;
    await service.save();
    return res.status(200).json({ message: "Service updated successfully", service });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
export const deleteService = async (req, res) => {
  try {
    let userId = req?.user?.id;
    let { serviceId } = req.params;
    let company = await Company.findOne({ where: { userId } });
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    let service = await Service.findOne({
      where: {
        id: serviceId,
        companyInfo: company.id
      }
    });
    if(!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    await service.destroy();
    return res.status(200).json({ message: "Service deleted successfully" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
