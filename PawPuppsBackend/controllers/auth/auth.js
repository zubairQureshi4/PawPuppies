const userModel = require("../../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv').config();
const JWT_SECRET_KEY = process.env.TOKEN_KEY;

function generateAuthToken(data){
  const token = jwt.sign(data, JWT_SECRET_KEY, { expiresIn: '24h' })
  return token
}

module.exports.login = async (req, res) => {
  try {

    const { email, password } = req.body;
    let user = await userModel.findOne({ email });
    if (!user) {
      return res.json({
        success: true,
        status: 400,
        message: "user does not exist with this email and password",
      });
    }

    // bcrypting the password and comparing with the one in db
    if (!await bcrypt.compare(password, user.password)) {

      const token = generateAuthToken({userId : user?._id, email : email})
     
      user.token = token
      user.save()

      return res.json({
        success: true,
        status: 200,
        message: "user Logged in",
        data: user,
      });
    }
    return res.json({
        success: false,
        status: 400,
        message: "user credentials are not correct",
    })

  } catch (error) {
    return res.send("Error");
  }
};

module.exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    // if any one of the field from email and password is not filled
    if (!email || !password) {
      return res.json({
        success: false,
        message: "email or password is empty",
      });
    }
    req.body.password = await bcrypt.hash(password, 10);

    let user = new userModel(req.body);
    await user.save();

    return res.json({
      success: true,
      message: "user registered successfully",
    });
  } catch (error) {
    return res.send("Internal server Error");
  }
};


//////////// we are not considering below code yet
module.exports.updateUser = async (req, res) => {
  try {

    const userDataToBeUpdated = req.body;



    const user = await userModel.findOne({ _id: req.params.id });


    if (!user) return res.send("user does not exist");

    let updatedUser = await userModel.findOneAndUpdate(
      { _id: req.params.id },
      userDataToBeUpdated,
      { new: true }
    );


    return res.json({
      success: true,
      message: "user updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    return res.send("error");
  }
};

module.exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await userModel.findById(id)
    if (!user) return res.status(200).send("user does not exist");

    await userModel.findByIdAndDelete(id)
    
    return res.json({
      success: true,
      message: "user deleted successfully",
    });
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

module.exports.userById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await userModel.findById(id)
    if(!user) return res.send("user does not exist")

    return res.json({
        success : true,
        message : "user fetched successfully",
        data : user
    })

    }catch(error){
        return res.send("error : ", error.message)
    }
}

module.exports.resetPassword = async (req, res) => {

    try{
        const {password, newPassword} = req.body;
        const {id} = req.params
    
        if(!password || !newPassword || !id) return res.send("Fields are empty")
    
        let user = await userModel.findById(id)
    
        if(!user) return res.send("user does not exist")
    
        // comparing the password from the password in DB to allow changes
        if(bcrypt.compare(password, user.password)){
            // encrypting new password 
            user.password = await bcrypt.hash(newPassword,10)
            user.save()
            return res.json({
                success : true,
                message : "Password changed successfully"
            })
        }

        return res.json({
            success : false,
            message : "wrong password"
        })

    }catch(error){
        return res.send(error.message)
    }
    
}
