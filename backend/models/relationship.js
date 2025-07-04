import { User } from "./user.model.js";
import { Company } from "./company.model.js";
import { Tender } from "./tendor.model.js";
import { Application } from "./application.model.js";
import { Service } from "./service.model.js";

User.hasMany(Company, { foreignKey: "userId" });
Company.belongsTo(User, { foreignKey: "userId" });

Tender.belongsTo(Company, { foreignKey: 'postedBy', as: 'postedCompany' });
Company.hasMany(Tender, { foreignKey: 'postedBy', as: 'tenders' });


Company.hasMany(Tender, { foreignKey: "allocatedTo" });
Tender.belongsTo(Company, { foreignKey: "allocatedTo" });

Tender.hasMany(Application, { foreignKey: "tenderId" });
Application.belongsTo(Tender, { foreignKey: "tenderId" });
Application.belongsTo(Company, { foreignKey: 'companyId', as: 'participant' });
Company.hasMany(Application, { foreignKey: 'companyId', as: 'applications' });

// Company.hasMany(Application, { foreignKey: "companyId" });
// Application.belongsTo(Company, { foreignKey: "companyId" });

Company.hasMany(Service, { foreignKey: "companyInfo" });
Service.belongsTo(Company, { foreignKey: "companyInfo" });

export {
  User,
  Company,
  Tender,
  Application,
  Service
};
