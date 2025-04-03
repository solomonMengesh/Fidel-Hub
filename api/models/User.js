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
    enum: ['active', 'pending'], 
    default: function() { return this.isApproved ? 'active' : 'pending'; } // Dynamic status
  }
}, { timestamps: true });

// Middleware: Update `status` before saving
userSchema.pre('save', function(next) {
  console.log('Before save:', this.isApproved, this.status); // Log the values before saving

  this.status = this.isApproved ? 'active' : 'pending';
  
  console.log('After save:', this.status); // Log the status after setting it
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
