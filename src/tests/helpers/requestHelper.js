import supertest from "supertest";

const baseUrl = "localhost:3000/api/v1";
const request = supertest(baseUrl);

export default request;
