import { Schema, model, models } from "mongoose";

const AccountSettingsSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  emailNotifications: {
    type: Boolean,
    required: true,
    default: false,
  },
  // twoFactorAuth: Boolean,
}, {
  timestamps: true  // Automatically add create, update timestamp fields
});

const AccountSettings = models.AccountSettings || model('AccountSettings', AccountSettingsSchema);

export default AccountSettings;
