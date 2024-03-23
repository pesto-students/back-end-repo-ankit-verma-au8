import { expect } from "chai";
import "mocha";
import { getTestEnv } from "../../../../test/env/testEnvironment";
import db from "../../../db";
import * as F from "../../../../test/env/factories";
import { saveUserDetails } from "../../../user/repo";
import { AUTH_LOGIN, AUTH_LOGOUT, SESSION_TABLE } from "../../constant";
import jwt from "jsonwebtoken";
import config from "../../../config";

describe("Logout API", async () => {
  let testEnv;
  beforeEach(async () => {
    testEnv = await getTestEnv();
  });

  it("should logout a user", async () => {
    const newUser = await F.fakeUser(null);

    await saveUserDetails({ ...newUser, role: "user" });

    const loginDetails = {
      waNumber: newUser.waNumber,
      password: newUser.password,
      staySignedIn: true,
      role: "user",
    };

    const loginResponse = await testEnv.server.inject({
      method: AUTH_LOGIN.method,
      url: AUTH_LOGIN.endPoint,
      payload: loginDetails,
      headers: {
        "g-recaptcha-response": "dummyToken",
      },
    });
    const authToken = loginResponse.result.authToken;
    const logoutResponse = await testEnv.server.inject({
      method: AUTH_LOGOUT.method,
      url: AUTH_LOGOUT.endPoint,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    expect(logoutResponse.statusCode).to.eql(200);
    var decoded: any = jwt.verify(authToken, config.JWT_SECRET);
    const sessionData = await db(SESSION_TABLE)
      .select("*")
      .where({ sessionId: decoded.sessionId })
      .first();
    expect(sessionData).to.eql(undefined);
  });
});
