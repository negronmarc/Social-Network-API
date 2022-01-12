const { Thought, User } = require("../models");

const thoughtController = {
  // gets all thoughts
  getThoughts(req, res) {
    Thought.find()
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((error) => res.status(500).json(error));
  },

  // gets single thought by id
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId }).then((dbThoughtData) =>
      res.json(dbThoughtData)
    );
  },

  // creates a thought
  createThought(req, res) {
    Thought.create(req.body)
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => res.status(500).json(err));
  },

  // update thought
  updateThought(req, res) {
    // updates thought
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought with this id!" })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },

  // deletes thought
  deleteThought(req, res) {
    Thought.findOneAndRemove({ _id: req.params.thoughtId })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          return res.status(404).json({ message: "No thought with this id!" });
        }

        // removes thought id from user's `thoughts` field
        return User.findOneAndUpdate(
          { thoughts: req.params.thoughtId },
          { $pull: { thoughts: req.params.thoughtId } },
          { new: true }
        );
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          return res
            .status(404)
            .json({ message: "Thought created but no user with this id!" });
        }
        res.json({ message: "Thought successfully deleted!" });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // adds a reaction to a thought
  addReaction(req, res) {
    //  adds reaction to thought's reaction array
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
    )
      .then((reaction) =>
        !reaction
          ? res.status(404).json({ message: "No reaction with this id!" })
          : res.json(reaction)
      )
      .catch((err) => res.status(500).json(err));
  },

  // removes reaction from a thought
  removeReaction(req, res) {
    // removes reaction from thoughts
    Thought.findOneAndUpdate(
      { _id: req.params.reactionId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { runValidators: true, new: true }
    )
      .then((reaction) =>
        !reaction
          ? res.status(404).json({ message: "No reaction with this id!" })
          : res.json({ message: `Reaction has been deleted!` })
      )
      .catch((err) => res.status(500).json(err));
  },
};

module.exports = thoughtController;
