const assert = require("power-assert");
const request = require("request");
const axios = require("axios");

/* Mocha and Chai Testing Framework */

describe("Test API Calls for this Project", () => {
  // Step 1
  describe("Ping Server", () => {
    it("Should ping server and return status 200", () => {
      request("http://localhost:4000/api/ping", (err, res, body) => {
        assert.equal(res.statusCode, 200);
      });
    });
    it("Should return status 404 if the route is incorrect/does not exist", () => {
      request("http://localhost:4000/api/test", (err, res, body) => {
        assert.equal(res.statusCode, 404);
      });
    });
  });

  // Step 2
  describe("Fetch data", () => {
    it("Should return status 400 if there is no tag input", () => {
      request("http://localhost:4000/api/posts", (err, res, body) => {
        assert.equal(res.statusCode, 400);
      });
    });
    it("Should return status 200 for routing to correct endpoint & passing 3 params", () => {
      request(
        "http://localhost:4000/api/posts?tag=tech,health&sortBy=reads",
        (err, res, body) => {
          assert.equal(res.statusCode, 200);
        }
      );
    });
    it("Should return status 404 if the route is incorrect/does not exist", () => {
      request(
        "http://localhost:4000/api/posts/test/?tag=tech,health&sortBy=reads",
        (err, res, body) => {
          assert.equal(res.statusCode, 404);
        }
      );
    });
    // TODO: Test the sortby function & direction function
    // I could set a mock data that follows the given parameters and assert against the actual value received with axios
  });
});
