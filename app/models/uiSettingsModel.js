import { Schema, model, models } from "mongoose";

const UISettingsSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  theme: {
    String,
    required: true,
    enum: ['light', 'dark'],
  },
}, {
  timestamps: true  // Automatically add create, update timestamp fields
});

const UISettings = models.UISettings || model('UISettings', UISettingsSchema);

export default UISettings;