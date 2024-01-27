import { expect } from "chai";
import "mocha";
import { getTestEnv } from "../../../../test/env/testEnvironment";
import db from "../../../db";
import * as F from "../../../../test/env/factories";
import { saveUserDetails } from "../../../user/repo";
import { AUTH_LOGIN } from "../../constant";
import { isRight } from "fp-ts/lib/These";
import jwt from "jsonwebtoken";
import config from "../../../config";
import { USER_SIGNUP } from "../../../user/constant";

describe("Login API", () => {
  let testEnv;
  const newUser = F.fakeUser(null);
  let userId;
  beforeEach(async () => {
    testEnv = await getTestEnv();
    const response1 = await testEnv.server.inject({
      method: USER_SIGNUP.method,
      url: USER_SIGNUP.endPoint,
      payload: newUser,
    });
    userId = response1.result.userId;
  });

  it("should login a user", async () => {
    const loginDetails = {
      waNumber: newUser.waNumber,
      password: newUser.password,
      staySignedIn: true,
      role: "user",
    };

    const response = await testEnv.server.inject({
      method: AUTH_LOGIN.method,
      url: AUTH_LOGIN.endPoint,
      payload: loginDetails,
    });
    const authToken = response.result.authToken;
    expect(response.statusCode).to.eql(200);
    var decoded: any = jwt.verify(authToken, config.JWT_SECRET);
    expect(decoded.userId).to.eql(response.result.userId);
    expect(decoded.scope).to.eql(loginDetails.role);
    expect(response.result.userId).to.eql(userId);
  });
  it("should handle if user does not exist", async () => {
    const loginDetails = {
      waNumber: newUser.waNumber + "1",
      password: newUser.password,
      staySignedIn: true,
      role: "user",
    };

    const response = await testEnv.server.inject({
      method: AUTH_LOGIN.method,
      url: AUTH_LOGIN.endPoint,
      payload: loginDetails,
    });
    expect(response.statusCode).to.eql(400);
    expect(response.result.errors).to.eql("No account exist for this number");
  });
  it("should handle if password is incorrect", async () => {
    const newUser = await F.fakeUser(null);

    await saveUserDetails({ ...newUser, role: "user" });

    const loginDetails = {
      waNumber: newUser.waNumber,
      password: newUser.password + "a",
      staySignedIn: true,
      role: "user",
    };

    const response = await testEnv.server.inject({
      method: AUTH_LOGIN.method,
      url: AUTH_LOGIN.endPoint,
      payload: loginDetails,
    });
    expect(response.statusCode).to.eql(400);
    expect(response.result.errors).to.eql("Incorrect password");
  });
});
