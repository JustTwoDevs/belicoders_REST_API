import { describe, it } from "mocha";
import { expect } from "chai";
import request from "./helpers/requestHelper.js";

describe("GET /problems", () => {
  it("should return an empty json array", async () => {
    const response = await request.get("/problems");
    expect(response.status).eql(200);
    expect(response.body).eql([]);
  });

  it("should return a 201 status code", async () => {
    const requestBody = {
      title: "happy problem",
      statement: "hola",
      outputAnswers: "hola1",
      difficulty: 3,
      state: 3,
    };
    const response = await request.post("/problems").send(requestBody);
    expect(response.status).eql(201);
  });
});
