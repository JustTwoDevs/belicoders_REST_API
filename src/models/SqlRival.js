import models, { Schema } from "mongoose";
import Rival from "./Rival.js";
import db from "#databaseConnections/mysqlConnection.js";
import { json } from "express";

const sqlRivalSchema = new Schema({
  creationScript: { type: String , required: true,}, 
  databaseName: { type: String , required: true,},
});

sqlRivalSchema.methods.generateExpectedOutput =async  function () {
   try{
  await  db.query(this.creationScript);
  await  db.query(`USE ${this.databaseName}`);
     const result=await db.query(this.codeSolution);
      const expectedOutput = json.stringify(result);

    this.expectedOutput = expectedOutput;

   await this.save();
  } catch (error) {
    console.error("Error generating expected output:", error);
    throw error; 
  }
};
export default models.SqlRival ||
  Rival.discriminator("SqlRival", sqlRivalSchema);
