import mongoose from 'mongoose';

const adminSettingSchema = new mongoose.Schema(
  {
    setting_key: { type: String, required: true, unique: true },
    setting_value: { type: String, required: true },
    setting_type: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

adminSettingSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    ret.updated_at = ret.updatedAt;
    delete ret._id;
    delete ret.__v;
    delete ret.createdAt;
    delete ret.updatedAt;
  },
});

export default mongoose.model('AdminSetting', adminSettingSchema);
