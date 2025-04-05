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
    default: function() { return this.role !== 'instructor'; } // Automatically approve non-instructors
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'blocked'], 
    default: function() { return this.isApproved ? 'active' : 'pending'; } // Dynamic status
  },
  blocked: { type: Boolean, default: false }  ,
  socketId: { type: String, default: null }, // New field for tracking user's socket connection

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

export default mongoose.model('User', userSchema);
