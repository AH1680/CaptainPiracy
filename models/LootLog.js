import mongoose from 'mongoose';

const lootLogSchema = new mongoose.Schema(
  {
    pirate_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Pirate', required: true },
    item_name: { type: String, required: true },
    value: { type: Number, default: 0 },
    source: { type: String, required: true },
  },
  { timestamps: true }
);

lootLogSchema.set('toJSON', {
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

export default mongoose.model('LootLog', lootLogSchema);
