import pkg from "mongoose";
import Rival from "./Rival.js";
import db from "#databaseConnections/mysqlConnection.js";
const { Schema, models } = pkg;

const sqlRivalSchema = new Schema({
  creationScript: { type: String, required: false },
  databaseName: { type: String, required: false },
});

sqlRivalSchema.methods.generateExpectedOutput = function () {
  if (this.creationScript === "" || this.databaseName === "")
    this.expectedOutput = "";
  try {
    db.execute(this.creationScript, (err) => {
      if (err) {
        console.error("Error creating the database", err);
      } else {
        db.query(`USE ${this.databaseName}`, (useErr) => {
          if (useErr) {
            console.error("Error changing to the database", useErr);
          }
          db.query(this.solutionCode, (scriptErr, rows) => {
            if (scriptErr) {
              console.error("There is an error in your script:", scriptErr);
            }

            const expectedOutput = JSON.stringify(rows);

            this.expectedOutput = expectedOutput;
          });
        });
      }
    });
  } catch (error) {
    console.error("Error generating expected output:", error);
    throw error;
  }
};

sqlRivalSchema.pre("save", function (next) {
  this.generateExpectedOutput();

  next();
});

export default models.SqlRival ||
  Rival.discriminator("SqlRival", sqlRivalSchema);
