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

sqlRivalSchema.methods.runCreationScript = async function(){
  try {
    if (this.creationScript === "" || this.databaseName === "") return;
   
  await executeQuery({query: `CREATE DATABASE ${this.databaseName};`, useExecute:true});
  await executeQuery({query: `USE ${this.databaseName};`, useExecute:false});
  await executeQuery({query: this.creationScript, useExecute:false});
 
  
  } catch (error) {
    console.log("error creation database", error.message);
    
  }
 
}

sqlRivalSchema.methods.dropDatabase =async  function(){
  try{
   await  executeQuery({query: `DROP DATABASE ${this.databaseName}`, useExecute:true});
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
  console.log('error running the creation script')
 }

});

export default models.SqlRival ||
  Rival.discriminator("SqlRival", sqlRivalSchema);
