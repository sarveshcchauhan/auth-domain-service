import mongoose from "mongoose";

/**
 * Inbox Schema
 *
 * Ensures:
 * - Idempotency
 * - Retry tracking
 * - Failure recovery
 */
const InboxSchema = new mongoose.Schema({
  eventId: { type: String, required: true, unique: true },
  eventType: { type: String },

  status: {
    type: String,
    enum: ["PENDING", "DONE", "FAILED"],
    default: "PENDING",
    index: true,
  },

  retryCount: { type: Number, default: 0 },
  lastError: { type: String },

  nextRetryAt: { type: Date, index: true },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

/**
 * Compound index for retry worker
 */
InboxSchema.index({ status: 1, nextRetryAt: 1 });

export const InboxModel = mongoose.model("Inbox", InboxSchema);