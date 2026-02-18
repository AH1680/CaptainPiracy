import mongoose from 'mongoose';

const crewMemberSchema = new mongoose.Schema(
  {
    pirate_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Pirate', required: true },
    name: { type: String, required: true },
    role: { type: String, required: true },
    level: { type: Number, default: 1 },
    loyalty: { type: Number, default: 50 },
  },
  { timestamps: true }
);

crewMemberSchema.set('toJSON', {
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

export default mongoose.model('CrewMember', crewMemberSchema);
