import { expect } from "chai";
import "mocha";
import { getTestEnv } from "../../../../test/env/testEnvironment";
import db from "../../../db";
import * as F from "../../../../test/env/factories";
import { USER_SIGNUP, USER_TABLE } from "../../../../src/user/constant";

describe("User API", () => {
  let testEnv;
  beforeEach(async () => {
    testEnv = await getTestEnv();
    testEnv.resetDB();
  });

  it("should signup the user", async () => {
    const newUser = await F.fakeUser(null);

    const response = await testEnv.server.inject({
      method: USER_SIGNUP.method,
      url: USER_SIGNUP.endPoint,
      payload: newUser,
    });

    expect(response.statusCode).to.eql(201);
    const userDetails = await db(USER_TABLE)
      .select("*")
      .where({ email: newUser.email })
      .first();

    const responseUserId = response.result.userId;
    expect(userDetails.id).to.eql(responseUserId);
    expect(userDetails.firstName).to.eql(newUser.firstName);
    expect(userDetails.email).to.eql(newUser.email);
    expect(userDetails.waNumber).to.eql(newUser.waNumber);
    expect(userDetails.password).to.be.a("string");
    expect(userDetails.role).to.eql("user");
    expect(userDetails.password).to.not.eql(newUser.password);
  });
  it("should handle bad request", async () => {
    const newUser = F.fakeUser({ firstName: 1 });

    const response = await testEnv.server.inject({
      method: USER_SIGNUP.method,
      url: USER_SIGNUP.endPoint,
      payload: newUser,
    });
    expect(response.statusCode).to.eql(400);
  });

  it("should handle invalid password", async () => {
    const newUser = F.fakeUser({ password: "1343" });

    const response = await testEnv.server.inject({
      method: USER_SIGNUP.method,
      url: USER_SIGNUP.endPoint,
      payload: newUser,
    });
    expect(response.statusCode).to.eql(400);
  });

  it("should handle invalid email", async () => {
    const newUser = F.fakeUser({ email: "obanjiwj!mail.com" });

    const response = await testEnv.server.inject({
      method: USER_SIGNUP.method,
      url: USER_SIGNUP.endPoint,
      payload: newUser,
    });
    expect(response.statusCode).to.eql(400);
  });
  it("should handle duplicate user", async () => {
    const newUser = await F.fakeUser(null);
    await testEnv.server.inject({
      method: USER_SIGNUP.method,
      url: USER_SIGNUP.endPoint,
      payload: newUser,
    });
    const response = await testEnv.server.inject({
      method: USER_SIGNUP.method,
      url: USER_SIGNUP.endPoint,
      payload: newUser,
    });
    expect(response.statusCode).to.eql(400);
    expect(response.result.message).to.eql(
      "WhatsApp number is already registered"
    );
  });
});
