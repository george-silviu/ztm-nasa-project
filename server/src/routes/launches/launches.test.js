const request = require("supertest");
const app = require("../../app"); //require express app
const { mongoConnect, mongoDisconnect } = require("../../services/mongo");

describe("Launches API", () => {
  //before running all test connect to mongo
  beforeAll(async () => {
    await mongoConnect();
  });
  //after all tests disconnect from mongo
  afterAll(async () => {
    await mongoDisconnect();
  });

  //fixture
  describe("Test GET /launches", () => {
    test("It should respond with 200 success", async () => {
      //make req to the endpoint that is tested
      const response = await request(app)
        .get("/launches")
        .expect("Content-Type", /json/) //check json content type headers
        .expect(200); //check status code assertion
    });
  });

  describe("Test POST /launch", () => {
    const completeLaunchData = {
      mission: "USS Enterprise",
      rocket: "NCC 1701-D",
      target: "Kepler-62 f",
      launchDate: "January 4, 2028",
    };

    const launchDataWithoutDate = {
      mission: "USS Enterprise",
      rocket: "NCC 1701-D",
      target: "Kepler-62 f",
    };

    const launchDataWithInvalidDate = {
      mission: "USS Enterprise",
      rocket: "NCC 1701-D",
      target: "Kepler-62 f",
      launchDate: "hello",
    };

    test("It should respond with 201 created", async () => {
      //supertest assetion
      const response = await request(app)
        .post("/launches")
        .send(completeLaunchData)
        .expect("Content-Type", /json/)
        .expect(201);

      //handling dates for testing
      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();
      expect(requestDate).toBe(responseDate);

      //jest assertion
      expect(response.body).toMatchObject(launchDataWithoutDate);
    });

    test("It should catch missing required properties", async () => {
      const response = await request(app)
        .post("/launches")
        .send(launchDataWithoutDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Missing required lauch property.",
      });
    });

    test("It should catch invalid dates", async () => {
      const response = await request(app)
        .post("/launches")
        .send(launchDataWithInvalidDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Invalid launch date",
      });
    });
  });
});
