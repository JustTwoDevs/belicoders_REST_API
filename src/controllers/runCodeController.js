import { execSync } from "child_process";
import { writeFileSync, unlinkSync } from "fs";
import {executeQuery} from "#databaseConnections/mysqlConnection.js";

export const runAlgorithmCode = async (req, res) => {
  const { inputCases, solutionCode, userCode } = req.body;
  if (
    solutionCode === undefined ||
    inputCases === undefined ||
    userCode === undefined
  )
    return res.status(400).json({ message: "No code or input cases" });
  let userOutput;
  try {
    writeFileSync(`${req.user.id}.txt`, inputCases);
    writeFileSync(`${req.user.id}.py`, userCode);
    const outputUser = execSync(
      `python ${req.user.id}.py < ${req.user.id}.txt`,
      { timeout: 3000 }
    );
    userOutput = outputUser.toString();
    unlinkSync(`${req.user.id}.py`);
  } catch (err) {
    const errorOutput = err.message.includes("ENOBUFS")
      ? "Runtime Exceeded"
      : err.message;
    await new Promise((resolve) => setTimeout(resolve, 100));
    unlinkSync(`${req.user.id}.py`);
    unlinkSync(`${req.user.id}.txt`);
    return res.status(200).json({ errorOutput });
  }
  try {
    writeFileSync(`solutionCode.py`, solutionCode);
    const outputSolution = execSync(
      `python solutionCode.py < ${req.user.id}.txt`,
      { timeout: 3000 }
    );
    const solutionOutput = outputSolution.toString();
    unlinkSync(`solutionCode.py`);
    unlinkSync(`${req.user.id}.txt`);
    return res.status(200).json({ userOutput, solutionOutput });
  } catch (err) {
    const errorInputCases = err.message;
    unlinkSync(`solutionCode.py`);
    unlinkSync(`${req.user.id}.txt`);
    return res.status(200).json({ errorInputCases });
  }
};

export const runSQLCode = async (req, res) => {
  const { creationScript, databaseName, userCode } = req.body;
  if (
    creationScript === undefined ||
    databaseName === undefined ||
    userCode === undefined
  ) {
    return res.status(400).json({ message: "write some code" });
  }

  try {
    await executeQuery({
      query: `CREATE DATABASE ${databaseName}`,
      useExecute:true
    });
    await executeQuery({
      query: `USE ${databaseName};${creationScript}`,
      useExecute:false
    });

    const result =await executeQuery({
      query: userCode, useExecute:false
    })
    
    executeQuery({query: `DROP DATABASE ${databaseName}`, useExecute:true});
   
      return res.status(200).json({ result, message: "query run succesfully" });
    
  
  } catch (err) {
    executeQuery({query: `DROP DATABASE ${databaseName}`, useExecute:true});
    return res.status(200).json({ errorOutput: err.message });
  }
};
