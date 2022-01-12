const { Schema, model } = require("mongoose");
const reactionSchema = require("./Reaction");
const dateFormat = require("../utils/dateFormat");

const thoughtSchema = new Schema(
  {
    // adds thoughtText
    thoughtText: {
      type: String,
      required: true,
      maxlength: 280,
    },
    // adds createdAt
    createdAt: {
      type: Date,
      default: Date.now,
      get: (timestamp) => dateFormat(timestamp),
    },
    // adds username
    username: {
      type: String,
      required: true,
    },
    // adds reactions
    reactions: [reactionSchema],
  },
  {
    // Adds toJSON option
    toJSON: {
      getters: true,
    },
    id: false,
  }
);

thoughtSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});

const Thought = model("Thought", thoughtSchema);

module.exports = Thought;
