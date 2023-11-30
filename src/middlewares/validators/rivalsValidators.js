import validator from "./validator.js";
import { States } from "#models/Rival.js";

const testRivalRequestValidator = async (body, errors) => {
  if (
    body.userCode == null ||
    body.userCode === undefined ||
    body.userCode === ""
  ) {
    errors.push({
      on: "userCode",
      message: "The userCode cannot be empty",
    });
  }
};

const testRivalDocumentValidator = async (rival, errors) => {
  if (rival.state !== States.DRAFT) {
    errors.push({
      on: "state",
      message: "The Rival must be in Draft state to be tested",
    });
  }
  if (
    rival.expectedOutput === null ||
    rival.expectedOutput === undefined ||
    rival.expectedOutput === ""
  ) {
    errors.push({
      on: "expectedOutput",
      message: "The Rival must have expected output to be tested",
    });
  }
  if (rival.__t === "Algorithm") {
    if (
      rival.inputCases === null ||
      rival.inputCases === undefined ||
      rival.inputCases === ""
    ) {
      errors.push({
        on: "inputCases",
        message: "The Algorithm rival must have input cases to be tested",
      });
    }
  }
  if (rival.__t === "Sql") {
    if (
      rival.creationScript === null ||
      rival.creationScript === undefined ||
      rival.creationScript === ""
    ) {
      errors.push({
        on: "creationScript",
        message: "The SQL rival must have creationScript to be tested",
      });
    }
    if (
      rival.databaseName === undefined ||
      rival.databaseName === null ||
      rival.databaseName === ""
    ) {
      errors.push({
        on: "databaseName",
        message: "The SQL rival must have database name to be tested",
      });
    }
  }
};

export const testRivalValidator = validator(testRivalRequestValidator, {
  model: "Rival",
  querys: [
    { field: "_id", params: "rivalId" },
    { field: "createdBy", value: "userId" },
  ],
  validator: testRivalDocumentValidator,
});
