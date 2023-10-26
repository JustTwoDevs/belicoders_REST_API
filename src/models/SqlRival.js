import models, { Schema } from "mongoose";
import Rival from "./Rival.js";

const sqlRivalSchema = new Schema({
  creationScript: { type: String , required: true,}, 
});

export default models.SqlRival ||
  Rival.discriminator("SqlRival", sqlRivalSchema);
