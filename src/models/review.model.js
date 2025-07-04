import { model, Schema } from "mongoose";

const ReviewSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String },

    isArchived: { type: Boolean, default: false },

}, { timestamps: true });

const Review = model('Review', ReviewSchema)

export { Review }