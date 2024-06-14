const chai = require("chai");
const sinon = require("sinon");
const authMiddleware = require("../../middleware/auth");
const ACCESS_TOKEN = require("../constants");

const { expect } = chai;

describe("Auth Middleware", () => {
  it("should call next() if user is authenticated", () => {
    const accessToken = ACCESS_TOKEN;

    const req = { headers: { authorization: `Bearer ${accessToken}` } };

    const res = {};
    const next = sinon.spy();
    try {
      authMiddleware(req, res, next);
      expect(next.calledOnce).to.be.true;
    } catch (error) {
      console.error("Error in auth middleware", error);
      throw error;
    }
  });

  it("should respond with 401 if user is not authenticated", async () => {
    const req = { isAuthenticated: sinon.stub().returns(false) };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    const next = sinon.spy();

    try {
      await authMiddleware(req, res, next);
      expect(res.status.calledWith(401)).to.be.true;
      expect(
        res.json.calledWith({
          error: "Access token is missing from the request header.",
        })
      ).to.be.true;
      expect(next.called).to.be.false;
    } catch (error) {
      console.error("Error in auth middleware", error);
      throw error;
    }
  });
});
