const User = require('../models/user.model');
const Login = require('../models/loginUser.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendMail')
const Otp = require('../models/otp.model');
const BuyMembership = require('../models/buymembership.model');
const ProviderAccreditation = require('../models/Provider/providerAccreditation.model');
const StayUpdate = require('../models/Consumer/StayUpdate');


exports.signUpUser = async (req, res) => {
    const { firstName, lastName, email, contactNumber, password, role,referedBy } = req.body;
    try {
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const data={firstName, lastName, email, contactNumber, password:hashedPassword, role,referedBy,status:role==='consumer'?'live':''}
        const isExist = await User.findOne({ email })
        if (isExist) {
            return res.status(200).json({ message: "User already exist", status: false })
        }
        const isRefer=await User.findById(referedBy)
        if(isRefer && isRefer.role===role){
            isRefer.freeService=isRefer.freeService+1
            await isRefer.save()
            data.referedBy=referedBy
            data.freeService=1
        }

        // Create user
        const newUser = await User.create(data);

        if (newUser) {
            const code = generateOTP()
            const otp = await Otp.create({ userId: newUser._id, code })
            const emailHtml = `
            Hello ${firstName}, 
            Your One-Time Password (OTP) for WizBizla is: ${code} 
            This OTP is valid for 10 minutes. Please do not share it with anyone.
            If you did not request this, please ignore this email.
            Thank you,
            The WizBizla Team`
            await sendEmail({
                to: email,
                subject: "Your WizBizla OTP Code!",
                html: emailHtml
            });
            return res.status(200).json({ status: true, newUser, userId: newUser._id });
        } else {
            return res.status(200).json({ status: false, message: "User not created" });
        }

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server Error' });
    }
}
exports.signInUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const isExist = await User.findOne({ email });
        if (!isExist) return res.status(200).json({ message: 'User not Found', status: false });
        const hashedPassword = isExist.password
        const isMatch = await bcrypt.compare(password, hashedPassword);
        console.log(isMatch,password,hashedPassword)
        if (!isMatch) return res.status(200).json({ message: 'Invalid email or password', status: false });
        const code = generateOTP()
        const isOtpExist = await Otp.findOne({ userId: isExist._id })
        if (isOtpExist) {
            await Otp.findByIdAndDelete(isOtpExist._id)
            const otp = await Otp.create({ userId: isExist._id, code })
        } else {

            const otp = await Otp.create({ userId: isExist._id, code })
        }
        const emailHtml = `
        Hello ${isExist?.firstName}, 
            Your One-Time Password (OTP) for WizBizla is: ${code} 
            This OTP is valid for 10 minutes. Please do not share it with anyone.
            If you did not request this, please ignore this email.
            Thank you,
            The WizBizla Team`
        await sendEmail({
            to: email,
            subject: "You OTP for wizbizla!",
            html: emailHtml
        });
        const isLogin = await Login.findOne({ userId: isExist._id })
        if (isLogin) {
            await Login.findByIdAndUpdate(isLogin._id, {}, { new: true })
            return res.status(200).json({ message: "Email Sent", userId: isExist._id, isNew: false, status: true })
        } else {
            await Login.create({ userId: isExist._id })
            return res.status(200).json({ message: "Email Sent", isNew: true, userId: isExist._id, status: true })
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server Error' });
    }
}
exports.verifyOtp = async (req, res) => {
    const { userId, code, isRemember } = req.body
    try {
        const isExist = await User.findById(userId)
        if (!isExist) {
            return res.status(200).json({ message: "User not exist", status: false })
        }
        const isOtp = await Otp.findOne({ code })
        if (!isOtp) {
            return res.status(200).json({ message: "Code not exist", status: false })
        }
        const otpExpiryTime = new Date(isOtp.updatedAt);
        otpExpiryTime.setMinutes(otpExpiryTime.getMinutes() + 10);

        if (new Date() > otpExpiryTime) {
            return res.status(200).json({ message: "OTP Expired", status: false });
        }
        const isValid = code == isOtp.code
        let isPurchase = false
        let isNew = true;
        const isLogin=await Login.findOne({userId})
        if (isLogin) {
            isNew = false;
        }
       const isComplete = Boolean(await ProviderAccreditation.findOne({ userId: isExist._id })) || Boolean(await StayUpdate.findOne({ userId: isExist._id }));
        const isMembership = await BuyMembership.findOne({ userId: isExist._id, status: {$in:['active','expired'] }}).populate('membershipId')
        let isVip=false
        console.log("is mebmer ship",isMembership)
        if (isMembership) {
            isPurchase = true
            if(isMembership.membershipId.type=='provider' && isMembership?.membershipId?.topChoice){
                isVip=true
            }
        }

        if (isValid) {
            const token = jwt.sign(
                { user: isExist },
                process.env.JWT_SECRET,
                { expiresIn: isRemember ? "30d" : "1d" }
            );
            return res.status(200).json({ message: "Verify Success",isComplete, isNew, isPurchase, token,isVip, userId: isExist._id, user: isExist, status: true })
        } else {
            return res.status(200).json({ message: "Invalid credentials", status: false })
        }
    } catch (err) {
        return res.status(400).json({ status: false, error: err.message });
    }
};
exports.resendOtp = async (req, res) => {
    const id = req.params.id
    try {
        const isExist = await User.findById(id);
        if (!isExist) {
            return res.status(404).json({ status: false, message: 'User not found' });
        }
        const code = generateOTP()
        const isOtpExist = await Otp.findOne({ userId: isExist._id })
        if (isOtpExist) {
            await Otp.findByIdAndDelete(isOtpExist._id)
            const otp = await Otp.create({ userId: isExist._id, code })
        } else {
            const otp = await Otp.create({ userId: isExist._id, code })
        }
        const emailHtml = `
            Hello ${isExist?.firstName}, 
            Your One-Time Password (OTP) for WizBizla is: ${code} 
            This OTP is valid for 10 minutes. Please do not share it with anyone.
            If you did not request this, please ignore this email.
            Thank you,
            The WizBizla Team`
        await sendEmail({
            to: isExist.email,
            subject: "Your WizBizla OTP Code!",
            html: emailHtml
        });
        res.status(200).json({
            status: true,
            message: "OTP sent!"
        });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};

exports.forgotEmail = async (req, res) => {
    const email = req.params.email
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: false, message: 'User not found' });
        }
        const emailHtml = `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
        <h2>Forgot Password - Wizbizla</h2>
        <p style="font-size: 16px;">
  Click the link below to set a new password:
        <a href="${process.env.BASE_URL}/set-new-password/${user._id}" style="color: #007bff;">
    Click To Reset
  </a>
        <p>
          Need help? Contact us at 
          <a href="mailto:hello@wizbizla.com" style="text-decoration: underline;">hello@wizbizla.com</a>
        </p>
        <div style="margin-top: 20px;">
          <a href="https://wizbizla.com/" target="_blank" style="display:inline-block; padding:10px 20px; background-color:#007bff; color:#fff; text-decoration:none; border-radius:4px;">
            Go to Wizbizla
          </a>
        </div>
      </div >
        `;

        await sendEmail({
            to: email,
            subject: "You password reset link for wizbizla!",
            html: emailHtml
        });
        res.status(200).json({
            status: true,
            message: "Mail sent!"
        });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};

exports.resetPassword = async (req, res) => {
    const { userId, password } = req.body;
    try {

        const isExist = await User.findById(userId);
        if (!isExist) return res.status(400).json({ message: 'Invalid email' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const updatePass = await User.findByIdAndUpdate(userId, { password: hashedPassword }, { new: true })
        if (updatePass) {
            return res.status(200).json({ message: "Password reset", userId: isExist._id, status: true })
        } else {
            return res.status(200).json({ message: "Error occure in password reset", status: false })
        }
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: 'Server Error' });
    }
}
exports.changePassword = async (req, res) => {
    const { userId, newPassword,oldPassword } = req.body;
    try {

        const isExist = await User.findById(userId);
        if (!isExist) return res.status(200).json({ message: 'Invalid email' });
        const isMatch = await bcrypt.compare(oldPassword, isExist.password);
        if (!isMatch) return res.status(200).json({ message: 'Old password is incorrect', status: false });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const updatePass = await User.findByIdAndUpdate(userId, { password: hashedPassword }, { new: true })
        if (updatePass) {
            return res.status(200).json({ message: "Password change successfully", userId: isExist._id, status: true })
        } else {
            return res.status(200).json({ message: "Error occure in password reset", status: false })
        }
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: 'Server Error' });
    }
}
exports.updateUser = async (req, res) => {
    const { userId, email,contactNumber,firstName,lastName } = req.body;
    try {
        const isExist = await User.findById(userId);
        if (!isExist) return res.status(200).json({ message: 'User not exist' });
        const alreadyEmail= await User.countDocuments({email})
        if(alreadyEmail>1){
            return res.status(200).json({ message: 'Email already exist' });
        }
        const updateUser = await User.findByIdAndUpdate(userId, { email,contactNumber,firstName,lastName}, { new: true })
        if (updateUser) {
            return res.status(200).json({ message: "User data change successfully", userId: isExist._id, status: true })
        } else {
            return res.status(200).json({ message: "Error occure in user data", status: false })
        }
    } catch (err) {
        console.error(err.message);
        if(err.message.includes(' duplicate key error collection')){
            return res.status(200).json({message:"Email already exist "})
        }else{
        return res.status(200).json({ message: 'Server Error' });
        }
    }
}

function generateOTP() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}
//   vijay Code
// POST /api/auth/register
exports.createUser = async (req, res) => {
    try {
        const { firstName, lastName, email, contactNumber, password, role,onBoarding } = req.body;

        // ✅ Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                status: false,
                message: 'Email is already registered',
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ Create user
        const newUser = new User({
            firstName,
            lastName,
            onBoarding,
            email,
            contactNumber,
            password: hashedPassword,
            role,
        });

        await newUser.save();

        const token = jwt.sign(
            { userId: newUser._id, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        return res.status(201).json({
            status: true,
            token,
            message: 'User registered successfully',
        });

    } catch (err) {
        console.error('Create User Error:', err);
        return res.status(500).json({ status: false, message: 'Server Error' });
    }
};
// POST /api/auth/login
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid email or password' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });

        return res.status(200).json({ status: true, token, user });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server Error' });
    }
}

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ status: false, message: 'User not found' });
        }
        res.status(200).json({
            status: true,
            data: user
        });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.user._id).select('-password');

        if (!user) {
            return res.status(404).json({ status: false, message: 'User not found' });
        }

        res.status(200).json({
            status: true,
            data: user
        });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};
