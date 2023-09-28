import supertest from "supertest";
import { describe, it } from "mocha";
import { expect } from "chai";
import { databaseSetup } from "./helpers/databaseHelper.js";

const baseurl = "localhost:3000/api/v1";
const request = supertest(baseurl);

describe("GET /novels", () => {
  databaseSetup();
  it("should return an empty json array", async () => {
    const response = await request.get("/problems");
    expect(response.status).eql(200);
    expect(response.body).eql([]);
  });

  it("should return a 201 status code", async () => {
    const requestBody = {
      statement: "hola",
      outputAnswers: "hola1",
      difficulty: 3,
      state: 3,
    };
    const response = await request.post("/problems").send(requestBody);
    expect(response.status).eql(201);
  });
});
