import{contact} from "../models/contact.js";

export const createContact= async(req,res)=>{


    const {username,email,message} = req.body;  
    try {
        await contact.create({username,email,message});
        res.status(200).json({message:"Message Sent Successfully"});
}
catch(error){
    res.status(400).json({message:"Something went wrong"});
}
}
