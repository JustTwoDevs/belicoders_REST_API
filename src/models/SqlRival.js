import pkg from "mongoose";
import Rival from "./Rival.js";
import {executeQuery} from "#databaseConnections/mysqlConnection.js";
const { Schema, models } = pkg;

const sqlRivalSchema = new Schema({
  creationScript: { type: String, required: false },
  databaseName: { type: String, required: false },
});

sqlRivalSchema.methods.generateExpectedOutput =async function () {
  if (this.solutionCode === "" )
    this.expectedOutput = "";
  try {
      
       const result = await  executeQuery({
            query: this.solutionCode, useExecute:false
          });
          this.expectedOutput = JSON.stringify(result);
          
      
  } catch (error) {
    this.expectedOutput = error.message;
  }
};

sqlRivalSchema.methods.runCreationScript = function(){
  try {
    if (this.creationScript === "" || this.databaseName === "")
    return;
  executeQuery({query: `CREATE DATABASE ${this.databaseName}`, useExecute:true});
  executeQuery({query: `USE ${this.databaseName}`, useExecute:false});
  
  } catch (error) {
    console.log("error creation database", error.message);
    
  }
 
}

sqlRivalSchema.methods.dropDatabase = function(){
  try{
    executeQuery({query: `DROP DATABASE ${this.databaseName}`, useExecute:true});
  } catch (error) {
    console.log("error dropping database", error.message);
  }
 
}


sqlRivalSchema.pre("save", async function  (next) {
  try {
    if (this.isModified("solutionCode")) {
      await  this.runCreationScript();
 await  this.generateExpectedOutput();
await this.dropDatabase();

    }
   
next();
  } 
 catch(error){
  throw new Error('Error executing previous functions to save: ' + error.message);
 }

});

export default models.SqlRival ||
  Rival.discriminator("SqlRival", sqlRivalSchema);
