import mongoose from "mongoose";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
const userSchema = new mongoose.Schema({
  //we are assuming that name is unique 
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [2, 'Name must be at least 2 characters long']
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [0, 'Age must be greater than 0'],
    max: [120, 'Age must be less than 120']
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [10, 'Password must be at least 10 characters long']
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: [true, 'Gender is required']
  },
  about: {
    type: String,
    maxlength: [5000, 'About must not exceed 5000 characters']
  }
}, {
  timestamps: true
});

// hashing password before saving it to database
userSchema.pre("save", async function(next){
  if(!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password,10)
  next();
})

// checking the hashed password
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password);
}


userSchema.methods.generateAccessToken = function(){
      return jwt.sign({
        _id:this._id,
        
      },
       process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn :process.env.ACCESS_TOKEN_EXIPRY
      }
      )
}

export const User = mongoose.model("User",userSchema);