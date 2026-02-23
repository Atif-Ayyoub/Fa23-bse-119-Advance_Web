const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  dob: Date,
  gender: String,
  address: String,
  username: String,
  password: String
}, { versionKey: false });

userSchema.set('toJSON', {
  transform: (doc, ret) => {
    if (ret && Object.prototype.hasOwnProperty.call(ret, '__v')) {
      delete ret.__v;
    }
    return ret;
  }
});

module.exports = mongoose.model('User', userSchema);
