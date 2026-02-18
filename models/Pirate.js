import mongoose from 'mongoose';

const pirateSchema = new mongoose.Schema(
  {
    discord_id: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    level: { type: Number, default: 1 },
    experience: { type: Number, default: 0 },
    gold: { type: Number, default: 100 },
    ship_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Ship', default: null },
    island_name: { type: String, default: 'Tortuga' },
    avatar_url: { type: String, default: null },
    // Optional, player-facing identity customisations
    title: { type: String, default: '' },
    bio: { type: String, default: '' },
  },
  { timestamps: true }
);

pirateSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    ret.ship_id = ret.ship_id ? ret.ship_id.toString() : null;
    ret.created_at = ret.createdAt;
    ret.last_active = ret.updatedAt;
    delete ret._id;
    delete ret.__v;
    delete ret.createdAt;
    delete ret.updatedAt;
  },
});

export default mongoose.model('Pirate', pirateSchema);
