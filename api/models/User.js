import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'; // For password hashing

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  role: { type: String, enum: ['student', 'instructor', 'admin'], required: true },
  expertise: { 
    type: String, 
    required: function() { return this.role === 'instructor'; }, // Required for instructors only
  },
  password: { type: String, required: true },
  cv: { type: String }, // Store the path to the CV if the user is an instructor
  isApproved: { 
    type: Boolean, 
    default: function() { return this.role !== 'instructor'; } 
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'blocked'], 
    default: function() { return this.isApproved ? 'active' : 'pending'; } 
  },
  blocked: { type: Boolean, default: false }  ,
  socketId: { type: String, default: null },
  bio: {
    type: String,
    default: 'I am passionate about learning and sharing knowledge with others.',
    trim: true,
    maxlength: [500, 'Bio cannot exceed 500 characters']
  },

  // Avatar
  profilePic: {
    type: String,
    default: '' // Stores the URL or path to the uploaded avatar
  },
  otp: { type: String },
  otpExpiration: { type: Date },
  isVerified: { type: Boolean, default: true },
  passwordResetOtp: { type: String },
passwordResetOtpExpiration: { type: Date },

 availableBalance: { type: Number, default: 0 },
 bankDetails: {
  accountName: String,
  accountNumber: String,
  bankCode: String, // e.g., '001' for CBE
},

}, { timestamps: true });

// Middleware: Update `status` before saving
userSchema.pre('save', function(next) {
  if (this.blocked) {
    this.status = 'blocked';  // If the user is blocked, set status to 'blocked'
    this.isApproved = false;  // Ensure isApproved is set to false when blocked
  } else {
    this.status = this.isApproved ? 'active' : 'pending';  // Otherwise, set the status based on approval
  }
  next();
});


// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Password comparison method
userSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

// OTP generation and verification
userSchema.methods.generateOTP = function() {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  this.otp = otp;
  this.otpExpiration = Date.now() + 100 * 60 * 1000; // OTP expires in 10 minutes
  return otp;
};

userSchema.methods.verifyOTP = function(otp) {
  if (this.otp === otp && this.otpExpiration > Date.now()) {
    return true;
  }
  return false;
};

// User schema method to handle password reset OTP generation and verification
userSchema.methods.generatePasswordResetOTP = function() {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  this.passwordResetOtp = otp;
  this.passwordResetOtpExpiration = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes
  return otp;
};

userSchema.methods.verifyPasswordResetOTP = function(otp) {
  if (this.passwordResetOtp === otp && this.passwordResetOtpExpiration > Date.now()) {
    return true;
  }
  return false;
};


// Method: Update profile (optional helper)
userSchema.methods.updateProfile = async function(updates) {
  const allowedUpdates = ['name', 'email', 'bio', 'profilePic'];
  const updatesKeys = Object.keys(updates);
  const isValidUpdate = updatesKeys.every(key => allowedUpdates.includes(key));

  if (!isValidUpdate) {
    throw new Error('Invalid profile updates');
  }

  updatesKeys.forEach(key => {
    this[key] = updates[key];
  });

  return this.save();
};

export default mongoose.model('User', userSchema);
