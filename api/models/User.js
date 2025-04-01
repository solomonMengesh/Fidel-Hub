import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'; // For password hashing

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  role: { type: String, enum: ['student', 'instructor','admin'], required: true },
  expertise: { 
    type: String, 
    required: function() { return this.role === 'instructor'; }, // Ensure expertise is required for instructors
  },
  password: { type: String, required: true },
  cv: { type: String }, // Store the path to the CV if the user is an instructor
}, { timestamps: true });

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    // Hash the password before saving it
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Password comparison method
userSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model('User', userSchema);
