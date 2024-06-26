import mongoose from "mongoose";

const { Schema } = mongoose;

const placeSchema = new Schema({
  name: String,
  location: String,
  image: String,
  mapURL: String,
  description: String,
  owner: { type: String, required: true },
});

const Place = mongoose.models.Place || mongoose.model("Place", placeSchema);

export default Place;
