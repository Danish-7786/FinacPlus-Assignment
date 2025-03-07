
import mongoose from "mongoose";


console.log(process.env.MONGODB_URI);
const connectDB = async ()=> {
    try {
       const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`);
       if(connectionInstance){
           console.log("Mongodb successfully connected !!");
       }
         
        
    } catch (error) {
        console.log("Error in connecting with data base",error);
        process.exit(1) 
    }
}

export default connectDB;