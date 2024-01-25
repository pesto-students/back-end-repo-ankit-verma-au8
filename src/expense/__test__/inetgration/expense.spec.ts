import { expect } from "chai";
import "mocha";
import { getTestEnv } from "../../../../test/env/testEnvironment";
import db from "../../../db";
import * as F from "../../../../test/env/factories";
import { AUTH_LOGIN } from "../../../authentication/constant";
import { USER_SIGNUP } from "../../../user/constant";
import { SAVE_EXPENSE } from "../../constant";

describe("Save expense API", () => {
  let testEnv;
  const newUser = F.fakeUser(null);
  let userId;
  let authToken;
  beforeEach(async () => {
    testEnv = await getTestEnv();
    const response1 = await testEnv.server.inject({
      method: USER_SIGNUP.method,
      url: USER_SIGNUP.endPoint,
      payload: newUser,
    });
    userId = response1.result.userId;
    const loginDetails = {
      waNumber: newUser.waNumber,
      password: newUser.password,
      role: newUser.role,
      staySignedIn: true,
    };

    const response = await testEnv.server.inject({
      method: AUTH_LOGIN.method,
      url: AUTH_LOGIN.endPoint,
      payload: loginDetails,
    });
    authToken = response.result.authToken;
  });

  it("should save user expense", async () => {
    const category = await db("expenseCategories")
      .select("*")
      .where({ name: "Entertainment" })
      .first();
    const expenseDetails = {
      amount: 5000,
      categoryId: category.id,
      textMessage: "Spent 5000 on movies",
    };

    const response = await testEnv.server.inject({
      method: SAVE_EXPENSE.method,
      url: SAVE_EXPENSE.endPoint,
      payload: expenseDetails,
      headers: { Authorization: authToken },
    });
    expect(response.statusCode).to.eql(201);
    const expenses = await db("expenses").select("*");
    expect(expenses.length).to.eql(1);
    expect(expenses[0].userId).to.eql(userId);
    expect(expenses[0].textMessage).to.eql(expenseDetails.textMessage);
    expect(Number(expenses[0].amount)).to.eql(expenseDetails.amount);
    expect(expenses[0].categoryId).to.eql(expenseDetails.categoryId);
  });
});
