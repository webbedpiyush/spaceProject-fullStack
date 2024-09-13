const request = require("supertest");
const app = require("../../app");
const { mongoConnect, mongoDisconnect } = require("../../services/mongo");

describe("launches API test", () => {
  beforeAll(async () => {
    await mongoConnect();
  });

  afterAll(async () => {
    await mongoDisconnect();
  });

  describe("grouping karo bhai", () => {
    test("test 1", async () => {
      const response = await request(app)
        .get("/launches")
        .expect("Content-Type", /json/)
        .expect(200);
      // the supertest provides us some http assertions
    });
    test("test 2", () => {});
  });

  describe("POST /launches", () => {
    const fullLaunchData = {
      mission: "space project",
      target: "Kepler-442 b",
      rocket: "apna rocket",
      launchDate: "january 4,2031",
    };

    const LaunchDatawithoutDate = {
      mission: "space project",
      target: "Kepler-442 b",
      rocket: "apna rocket",
    };
    test("POST /launches", async () => {
      const response = await request(app)
        .post("/launches")
        .send(fullLaunchData)
        .expect(201);
      expect(response.body).toMatchObject(LaunchDatawithoutDate);
      // comparing the res to the result

      const launchDataDate = new Date(fullLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();
      expect(responseDate).toBe(launchDataDate);
    });

    test("test 1 something related to ", () => {});
    test("test 2 error related", async () => {
      const response = await request(app)
        .post("/launches")
        .send(LaunchDatawithoutDate)
        .expect(400)
        .expect("Content-Type", /json/);
      expect(response.body).toStrictEqual({
        error: "Missing required launch property",
      });
      // comparing res body to the error body
    });
  });
});
