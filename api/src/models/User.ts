import * as bcrypt from 'bcrypt-nodejs';
import * as crypto from 'crypto';
import { model, Schema } from 'mongoose';

const userSchema = new Schema(
  {
    email: { type: String, unique: true },
    password: { type: String, required: true },
    companyName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    name: { type: String, required: true },
    passwordResetToken: String,
    passwordResetExpires: Date,

    tokens: Array,

    profile: {
      name: String,
      gender: String,
      location: String,
      website: String,
      picture: String
    }
  },
  { timestamps: true, collection: 'users' }
);

/**
 * Password hash middleware.
 */
userSchema.pre('save', function save(next) {
  const user = this as any;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

/**
 * Helper method for validating user's password.
 */
userSchema.methods.comparePassword = function comparePassword(candidatePassword: any, cb: any) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

/**
 * Helper method for getting user's gravatar.
 */
userSchema.methods.gravatar = function gravatar(size: any) {
  if (!size) {
    size = 200;
  }
  if (!this.email) {
    return `https://gravatar.com/avatar/?s=${size}&d=retro`;
  }
  const md5 = crypto
    .createHash('md5')
    .update(this.email)
    .digest('hex');
  return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
};

export const User = model('User', userSchema);
