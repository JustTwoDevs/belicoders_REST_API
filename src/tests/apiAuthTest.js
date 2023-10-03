import { describe, it } from "mocha";
import { expect } from "chai";
import request from "./helpers/requestHelper.js";

describe("GET /auth/login", () => {
  it("desctipcion", async () => {
    const requestBody = {
      username: "ttrejosg",
      password: "$2a$10$011TXEi.X5xADQR0AbUmDeqjgf4Y7NrF2.ihMAr/OfzGw2KjG0/.a",
    };
    const response = await request.post("/auth/login").send(requestBody);
    expect(response.status).to.equal(200);
  });
});

describe("GET /auth/logout", () => {
  it("desctipcion", async () => {
    const response = await request.get("/auth/logout");
    expect(response.status).to.equal(200);
  });
});

describe("POST /auth/recover/generate", () => {
  it("should return a 204", async () => {
    const requestBody = {
      userInfo: "cheto59",
    };
    const response = await request
      .post("/auth/recover/generate")
      .send(requestBody);
    expect(response.status).to.equal(204);
  });
});
