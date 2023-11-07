import { execSync } from "child_process";
import { writeFileSync, unlinkSync } from "fs";
import db from "#databaseConnections/mysqlConnection.js";


export const runAlgorithmCode = async (req, res) => {
  const { inputCases, solutionCode, userCode } = req.body;
  if (
    solutionCode === undefined ||
    inputCases === undefined ||
    userCode === undefined
  )
    return res.status(400).json({ message: "No code or input cases" });
  try {
    writeFileSync(`${req.user.id}.txt`, inputCases);
    writeFileSync(`${req.user.id}.py`, userCode);
    writeFileSync(`userCode.py`, solutionCode);
    const outputUser = execSync(
      `python ${req.user.id}.py < ${req.user.id}.txt`
    );
    const userOutput = outputUser.toString();
    const outputSolution = execSync(`python userCode.py < ${req.user.id}.txt`);
    const solutionOutput = outputSolution.toString();
    unlinkSync(`${req.user.id}.txt`);
    unlinkSync(`${req.user.id}.py`);
    unlinkSync(`userCode.py`);
    return res.status(200).json({ userOutput, solutionOutput });
  } catch (err) {
    const errorOutput = err.message;
    unlinkSync(`${req.user.id}.txt`);
    unlinkSync(`${req.user.id}.py`);
    unlinkSync(`userCode.py`);
    return res.status(200).json({ errorOutput });
  }
};

export const runSQLCode = async (req, res) => {
  const { creationScript, databaseName, userCode } = req.body;
  if (
    creationScript === undefined ||
    databaseName === undefined ||
    userCode === undefined  
  ){
    return res.status(400).json({ message: "write some code" });
  }
    
  try {
    
    db.execute(`CREATE DATABASE ${databaseName}`);
    db.query(`USE ${databaseName};${creationScript}`)
    db.query(userCode, (error, result) => {
      if(error) return res.status(200).json({  errorOutput: error.message });
      return res.status(200).json( {result, message:'query run succesfully'} );
    });
  
    db.query(`DROP DATABASE ${databaseName}`);
  } catch (err) {
    const errorOutput = err.message;
   console.error(errorOutput);
  }
};
