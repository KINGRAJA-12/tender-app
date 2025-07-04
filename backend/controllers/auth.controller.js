import bcrypt from "bcryptjs";
import {User} from "../models/relationship.js";
import {Company} from "../models/relationship.js";
import supabase from "../configurations/supbase.js";
import jwt from "jsonwebtoken"
export const register = async (req, res) => {
  try {
    let {
      username,
      email,
      password,
      number,
      companyName,
      address,
      description,
      logo
    } = req.body;

    console.log(username+" "+
      email+" "+
      password+" "+
      number+" "+
      companyName+" "+
      address+" "+
      description)
    if (!username || !email || !password || !number || !companyName || !address || !description || !logo) {
      return res.status(400).json({ message: "All credentials are required" });
    }
  
    let existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already used" });
    }
    let hashPassword = await bcrypt.hash(password, 10);
    let newUser = await User.create({
      username,
      email,
      password: hashPassword,
      number,
    });
    let matches = logo.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!matches) {
      return res.status(400).json({ message: "Invalid logo format" });
    }
    let contentType = matches[1]; 
    let base64Data = matches[2];
    let buffer = Buffer.from(base64Data, "base64");
    let ext = contentType.split("/")[1];
    let fileName = `logos/${Date.now()}-${companyName}.${ext}`;
    let { error: uploadError } = await supabase
      .storage
      .from(process.env.SUPABASE_BUCKET_NAME)
      .upload(fileName,buffer, {
        upsert: true,
      });

    if (uploadError) {
      return res
        .status(500)
        .json({ message: uploadError.message||"Failed to upload logo" });
    }

    let { data: logoData } = supabase
      .storage
      .from(process.env.SUPABASE_BUCKET_NAME)
      .getPublicUrl(fileName);
    let newCompany = await Company.create({
      companyName,
      address,
      description,
      logo: logoData.publicUrl,
      userId: newUser.id,
    });

    return res.status(201).json({
      message: "Registered successfully",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
      company: {
        id: newCompany.id,
        name: newCompany.companyName,
        logo: newCompany.logo,
      },
    });

  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide all fields" });
    }
    console.log(email)
    let user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Email not found" });
    }
    let isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    let accessToken = jwt.sign({ userId: user.id },process.env.ACCESS_TOKEN_SECRETE_KEY,{ expiresIn: "15m" });
    let refreshToken = jwt.sign({ userId: user.id },process.env.REFRESH_TOKEN_SECRETE_KEY,{ expiresIn: "7d" });
    res.cookie("accessToken", accessToken, {
      maxAge: 15 * 60 * 1000, 
      httpOnly: true,
      secure: false,
      sameSite: "strict"
    });
    res.cookie("refreshToken", refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: false,
      sameSite: "strict"
    });

    return res.status(200).json({
      message: "Login successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      }
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const getMe=async(req,res)=>{
  try{
    let user=req?.user;
    let comapny=await Company.findOne({
      where:{
        userId:user?.id
      }
    })
    return res.status(200).json({user:user,company:comapny});
  }catch(err){
    console.log(err.message);
    return res.status(500).json({message:"Internal server error"});

  }
}
export const logout=async(req,res)=>{
  try{
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res.status(200).json({message:"Logout successfully"});
  }catch(err){
    console.log(err.message);
    return res.status(500).json({message:"Internal server error"});
  }
}
export const refreshAccessToken=async(req,res)=>{
  try{
    console.log("this is called")
    let refreshToken=req?.cookies?.refreshToken;
    if(!refreshToken){
      return res.status(403).json({message:"unauthorized"});
    }
    let decode=await jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRETE_KEY);
    if(!decode){
      return res.status(403).json({message:"unauthorized"});
    }
    let user=await User.findByPk(decode.userId);
    if(!user){
      return res.status(403).json({message:"Unauthorized"});
    }
    let accessToken=jwt.sign({userId:user?.id},process.env.ACCESS_TOKEN_SECRETE_KEY,{expiresIn:"15m"});
    res.cookie("accessToken",accessToken,{httpOnly:true,maxAge:15*60*1000,secure:false,sameSite:"strict"});
    return res.status(200).json({message:"refreshed successfully"});
  }catch(err){
    console.log(err?.message);
    return res.status(500).json({message:"Internel server error"});
  }
}
