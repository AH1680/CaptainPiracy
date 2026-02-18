import mongoose from 'mongoose';

const shipSchema = new mongoose.Schema(
  {
    pirate_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Pirate', required: true },
    name: { type: String, required: true },
    type: { type: String, default: 'sloop' },
    health: { type: Number, default: 100 },
    max_health: { type: Number, default: 100 },
    speed: { type: Number, default: 10 },
    cannons: { type: Number, default: 2 },
  },
  { timestamps: true }
);

shipSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    ret.pirate_id = ret.pirate_id?.toString();
    ret.created_at = ret.createdAt;
    delete ret._id;
    delete ret.__v;
    delete ret.createdAt;
    delete ret.updatedAt;
  },
});

export default mongoose.model('Ship', shipSchema);
