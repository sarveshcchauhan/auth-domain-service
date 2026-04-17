import mongoose from "mongoose";

/**
 * Outbox Schema
 *
 * Stores events before publishing to Kafka.
 */
const OutboxSchema = new mongoose.Schema({
  eventId: { type: String, required: true, unique: true },
  eventType: { type: String, required: true },
  payload: { type: Object, required: true },

  status: {
    type: String,
    enum: ["PENDING", "PROCESSED"],
    default: "PENDING",
    index: true,
  },

  createdAt: { type: Date, default: Date.now },
  processedAt: { type: Date },
});

/**
 * Index for efficient polling
 */
OutboxSchema.index({ status: 1, createdAt: 1 });

export const OutboxModel = mongoose.model("Outbox", OutboxSchema);