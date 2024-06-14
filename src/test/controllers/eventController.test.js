const chai = require("chai");
const sinon = require("sinon");
const chaiHttp = require("chai-http");
const app = require("../../../app");
const Event = require("../../models/Event");
const ACCESS_TOKEN = require("../constants");

chai.use(chaiHttp);
const { expect } = chai;

describe("Event Controller", () => {
  let request;
  const email = "test@example.com";
  const password = "password123";

  let accessToken;
  before(async () => {
    try {
      request = chai.request(app).keepOpen();
      await request.post("/auth/register").send({
        email,
        password,
        role: "organizer",
      });
      const res = await request.post("/auth/login").send({
        email,
        password,
      });
      accessToken = res.body.token;
    } catch (error) {
      console.error("Error registering user", error);
    }
  });

  after(() => {
    request.close();
  });

  it("should get all events", async () => {
    try {
      const res = await request.get("/events");
      expect(res).to.have.status(200);
      expect(res.body).to.be.an("array");
    } catch (error) {
      console.error("Error fetching events", error);
      throw error;
    }
  });

  it("should create a new event", async () => {
    try {
      const event = {
        title: "Test Event",
        date: new Date().toISOString(),
        time: new Date().toLocaleTimeString(),
        description: "Test description",
      };
      const res = await chai
        .request(app)
        .post("/events")
        .set("authorization", `Bearer ${accessToken}`)
        .send(event);
      expect(res).to.have.status(201);
      expect(res.body).to.include(event);
    } catch (error) {
      console.error("Error creating event", error);
      throw error;
    }
  });
});

// Mocking with Sinon
describe("Event Controller with Sinon", () => {
  let findStub, createStub;
  const accessToken = ACCESS_TOKEN;

  beforeEach(() => {
    findStub = sinon.stub(Event, "find");
    createStub = sinon.stub(Event, "create");
  });

  afterEach(() => {
    findStub.restore();
    createStub.restore();
  });

  it("should get all events with sinon stub", async () => {
    try {
      findStub.resolves([{ title: "Mock Event" }]);
      const res = await chai.request(app).get("/events");
      expect(res).to.have.status(200);
      expect(res.body).to.deep.equal([{ title: "Mock Event" }]);
    } catch (error) {
      console.error("Error fetching events with sinon stub", error);
      throw error;
    }
  });

  it("should create a new event with sinon stub", async () => {
    try {
      const event = {
        title: "Test Event",
        date: new Date().toISOString(),
        time: new Date().toLocaleTimeString(),
        description: "Test description",
      };
      createStub.resolves(event);
      const res = await chai
        .request(app)
        .post("/events")
        .set("authorization", `Bearer ${accessToken}`)
        .send(event);
      expect(res).to.have.status(201);
      expect(res.body).to.include(event);
    } catch (error) {
      console.error("Error creating event with sinon stub", error);
      throw error;
    }
  });
});
