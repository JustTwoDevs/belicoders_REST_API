import Rival from "./Rival.js";
import { execSync } from "child_process";
import models, { Schema } from "mongoose";

const algorithmRivalSchema = new Schema({
  inputCases: { type: String },
});

algorithmRivalSchema.methods.generateExpectedOutput = function() {
  if (this.solutionCode === undefined || this.inputCases === undefined) return;
  const outputBuffer = execSync(
    `echo "${this.inputCases}" | python3 -c "${this.solutionCode}"`,
  );
  this.expectedOutput = outputBuffer.toString();
};


export default models.AlgorithmRival ||
  Rival.discriminator("AlgorithmRival", algorithmRivalSchema);
