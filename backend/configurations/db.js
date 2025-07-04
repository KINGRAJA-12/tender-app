import {Sequelize} from "sequelize";
import dotenv from "dotenv";
dotenv.config()
export const sequelize=new Sequelize(process.env.DATABASE_URL,{
  dialect:"postgres",
  dialectOptions:{
    ssl:{
      require:true,
      rejectUnauthorized:false
        },
      },
      logging:false
    }
   )
export const dbConnect = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log(`✅ Database connected: ${process.env.DATABASE_URL}`);
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  }
};
    
