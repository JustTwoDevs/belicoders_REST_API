import models, { Schema } from "mongoose";
import Rival from "./Rival.js";

const sqlRivalSchema = new Schema({
  creationScript: { type: String },
});

export default models.SqlRival |
  Rival.discriminator("SqlRival", sqlRivalSchema);
