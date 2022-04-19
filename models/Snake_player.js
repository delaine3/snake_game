import mongoose from "mongoose";

/* CharacterSchema will correspond to a collection in your MongoDB database. */
const Snake_player_Schema = new mongoose.Schema({
  player_name: {
    type: String,
  },
  score: {
    type: Number,
  },
});

export default mongoose.models.Snake_player ||
  mongoose.model("Snake_player", Snake_player_Schema);
