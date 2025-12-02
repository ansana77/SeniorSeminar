import { Schema } from 'mongoose';
import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const { isEmail, isStrongPassword } = validator;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [isEmail, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: true,
      validate: [
        isStrongPassword,
        'Please enter a strong password with at least 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 symbol',
      ],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET || 'somesecretkey', {
    expiresIn: process.env.JWT_EXPIRE || '1d',
  });
};

const User = mongoose.model('users', userSchema);

export default User;