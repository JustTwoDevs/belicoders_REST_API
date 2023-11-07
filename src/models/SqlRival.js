import pkg from "mongoose";
import Rival from "./Rival.js";
import db from "#databaseConnections/mysqlConnection.js";
const { Schema, models } = pkg;

const sqlRivalSchema = new Schema({
  creationScript: { type: String, required: false },
  databaseName: { type: String, required: false },
});

sqlRivalSchema.methods.generateExpectedOutput = function () {
  if (this.creationScript === "" || this.databaseName === "" || this.solutionCode === "" )
    this.expectedOutput = "";
  try {
      
          db.query(this.solutionCode, (scriptErr, result ) => {
            if (scriptErr) {
              this.expectedOutput = scriptErr.message;
            }
            const expectedOutput = JSON.stringify(result);
            this.expectedOutput = expectedOutput;
          });
      
  } catch (error) {
    console.error("Error generating expected output:", error);
    throw error;
  }
};

sqlRivalSchema.methods.runCreationScript = function(){
  if (this.creationScript === "" || this.databaseName === "")
    return;
  db.execute(`CREATE DATABASE ${this.databaseName}`);
  db.query(`USE ${this.databaseName}`, (useErr) => {
    if (useErr) {
      console.error("Error changing to the database", useErr);
      }
    }
  );
  db.query(this.creationScript , (scriptErr) => {
    if (scriptErr) {
      this.expectedOutput = scriptErr.message;
      console.error("There is an error in your script:", scriptErr);
    }}
  );


}

sqlRivalSchema.methods.dropDatabase = function(){
  db.query(`DROP DATABASE ${this.databaseName}`, (dropErr) => {
      if (dropErr) {
        console.error("Error dropping the database", dropErr);
      }
    });
}


sqlRivalSchema.pre("save", async function  (next) {
 await  this.runCreationScript();
 await  this.generateExpectedOutput();
await this.dropDatabase();

  next();
});

export default models.SqlRival ||
  Rival.discriminator("SqlRival", sqlRivalSchema);
