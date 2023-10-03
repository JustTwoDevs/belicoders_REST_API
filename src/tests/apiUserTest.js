import { describe, it } from "mocha";
import { expect } from "chai";
import request from "./helpers/requestHelper.js";

describe("GET /user/register", () => {
  it("desctipcion", async () => {
    const requestBody = {
      name: "Carlos",
      lastname: "Chitiva",
      age: 18,
      nationality: "Colombia",
      genre: "M",
      username: "cheto59",
      password: "hola123",
      email: "carloschiti.12@gmail.com",
      number: 3204422392,
    };
    const response = await request.post("/user/register").send(requestBody);
    expect(response.status).to.equal(204);
  });
});
