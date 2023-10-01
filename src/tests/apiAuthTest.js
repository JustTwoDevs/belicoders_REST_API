import { describe, it } from "mocha";
import { expect } from "chai";
import { request } from "./helpers/requestHelper";

describe("GET /auth/login", () => {
  it("desctipcion", async () => {
    const response = await request.get("/register");
    expect(response.status).to.equal(200);
    expect(response.body).to.be.an("array");
  });
});

describe("GET /auth/logout", () => {
  it("desctipcion", async () => {
    const response = await request.get("/register");
    expect(response.status).to.equal(200);
    expect(response.body).to.be.an("array");
  });
});
