import mongoose from 'mongoose';

const inventoryItemSchema = new mongoose.Schema(
  {
    pirate_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Pirate', required: true },
    item_name: { type: String, required: true },
    item_type: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    rarity: { type: String, default: 'common' },
    icon_url: { type: String, default: null },
  },
  { timestamps: true }
);

inventoryItemSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    ret.pirate_id = ret.pirate_id?.toString();
    ret.acquired_at = ret.createdAt;
    delete ret._id;
    delete ret.__v;
    delete ret.createdAt;
    delete ret.updatedAt;
  },
});

export default mongoose.model('InventoryItem', inventoryItemSchema);
