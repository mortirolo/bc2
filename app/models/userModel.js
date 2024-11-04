// import mongoose from "mongoose";
import { Schema, model, models } from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = new Schema({
  name: {
    type: String,
    required: false,
  },
  surname: {
    type: String,
    required: false,
  },
  username: {
    type: String,
    required: false,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,  // FIXME: is this correct way to force lowercase??
  },
  profileImage: {
    // type: Buffer,  // Store image directly
    type: String,  // Store path to image in some CDN
    required: false,
  },
  password: {
    type: String,
    required: [true, 'Please add a password of at least 8 characters'],
  },
  isVerified: {
    // Set to true when user clicks link in verification email
    type: Boolean,
    default: false, // New users will be unverified by default
  },
  isActive: {
    type: Boolean,
    default: true,  // Set to false if user shuts down account
  },
  permissions: {
    type: [String],
    required: false,
  },
  verificationToken: {
    type: String,
    required: false,
  },
  tempNewEmail: {
    // Store new email here until user clicks verification link
    // Then transfer to email field and clear this field
    type: String,
    required: false,
  },
  updateEmailToken: {
    type: String,
    required: false,
  },
}, {
  timestamps: true  // Automatically add create, update timestamp fields
});

/** 
* Run mongoose middleware before saving user to DB
* pre('save') hook: This specifies that the middleware function should run before the save operation.
* The function uses the function keyword instead of an arrow function to ensure that this
* refers to the document being saved.
* Check if the password field has been modified. If the password has not been modified,
* the middleware calls next() to proceed with the save operation without re-hashing the password. 
* Otherwise, generate salt and hash the password before calling next() to proceed
* with the save operation.
* This middleware ensures that every time a user document is saved, the password is hashed if it
* has been modified, providing a layer of security for user credentials.
*/
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Provide method to compare entered password with hashed password in DB
// Used in lib/passport.js
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = models.User || model('User', userSchema);

export default User;