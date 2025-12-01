import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../index";
import USER_ROLES from "../../roles/roles";
import IPlayer from "../../interfaces/IPlayer";

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI_TEST!);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("GET /user/get-acolytes", () => {
  it("should return all users with the role 'acolyte'", async () => {
    const response = await request(app).get("/user/get-acolytes");

    expect(response.statusCode).toBe(200);

    const acolytes: IPlayer[] = response.body;

    expect(acolytes.length).toBeGreaterThan(0);

    acolytes.forEach((acolyte) => {
      expect(acolyte.rol).toBe(USER_ROLES.ACOLYTE);
    });
  });
});

describe("PATCH /user/update/:userEmail", () => {
  it("should update the user with the specified email", async () => {
    const fieldToUpdate = "experience";
    const newValue = 61000;

    const response = await request(app)
      .patch("/user/update/juan.benito@ikasle.aeg.eus")
      .send({ [fieldToUpdate]: newValue });

    expect(response.statusCode).toBe(200);

    const user: IPlayer = response.body;

    expect(user[fieldToUpdate]).toEqual(newValue);
  });
});
