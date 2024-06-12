const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
require("dotenv").config();
process.env.NODE_ENV = "test";
const chai = require("chai");
const sinon = require("sinon");
const chaiHttp = require("chai-http");
const app = require("../../../app");
const User = require("../../models/User");

chai.use(chaiHttp);
const { expect } = chai;

describe("Auth Controller", () => {
  let request;
  before(() => {
    request = chai.request(app).keepOpen();
  });

  after(() => {
    request.close();
  });

  describe("POST /register", () => {
    it("should register a new user", async () => {
      try {
        const user = {
          email: "test@example.com",
          password: "password123",
        };
        const res = await request.post("/auth/register").send(user);
        expect(res).to.have.status(201);
        expect(res._body).to.include({
          message: "User registered successfully",
        });
      } catch (error) {
        console.error("Error registering user", error);
        throw error;
      }
    });
  });

  describe("POST /login", () => {
    const user = { email: "test@example.com", password: "password123" };
    before(async () => {
      try {
        await request.post("/auth/register").send(user);
      } catch (error) {
        console.error("Error registering user", error);
      }
    });
    it("should login a user", async () => {
      try {
        const res = await request.post("/auth/login").send(user);
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("token");
      } catch (error) {
        console.error("Error logging in user", error);
        throw error;
      }
    });
  });
});

// Mocking with Sinon
describe("Auth Controller with Sinon", () => {
  let findOneStub, saveStub;

  beforeEach(() => {
    findOneStub = sinon.stub(User, "findOne");
    saveStub = sinon.stub(User.prototype, "save");
  });

  afterEach(() => {
    findOneStub.restore();
    saveStub.restore();
  });

  it("should register a new user with sinon stub", async () => {
    try {
      const user = {
        password: "password123",
        email: "mock@example.com",
      };
      saveStub.resolves(user);
      const res = await chai.request(app).post("/auth/register").send(user);
      expect(res).to.have.status(201);
      expect(res.body).to.include({
        message: "User registered successfully",
      });
    } catch (error) {
      console.error("Error registering user with sinon stub", error);
      throw error;
    }
  });

  it("should login a user with sinon stub", async () => {
    try {
      const email = "mock@example.com";
      const password = "password123";
      const user = { email, password };
      findOneStub.resolves({ email, password: bcrypt.hashSync(password, 10) });
      const res = await chai.request(app).post("/auth/login").send(user);
      expect(res).to.have.status(200);
      expect(res.body).to.have.property("token");
    } catch (error) {
      console.error("Error logging in user with sinon stub", error);
      throw error;
    }
  });
});
