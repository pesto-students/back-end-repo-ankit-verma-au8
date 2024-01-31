import { expect } from "chai";
import "mocha";
import { getTestEnv } from "../../../../test/env/testEnvironment";
import db from "../../../db";
import * as F from "../../../../test/env/factories";
import { AUTH_LOGIN } from "../../../authentication/constant";
import { USER_SIGNUP } from "../../../user/constant";
import {
  GET_EXPENSE_OVERVIEW,
  SAVE_EXPENSE,
  SAVE_WA_EXPENSE,
} from "../../constant";
import { saveExpense } from "../../../../src/expense/repo";

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
      staySignedIn: true,
      role: "user",
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

describe("Save WA expense API", () => {
  let testEnv;
  let userId;
  const newUser = F.fakeUser(null);
  beforeEach(async () => {
    testEnv = await getTestEnv();
    await testEnv.resetDB();
    const response1 = await testEnv.server.inject({
      method: USER_SIGNUP.method,
      url: USER_SIGNUP.endPoint,
      payload: newUser,
    });
    userId = response1.result.userId;
  });

  it("should save user expense from WA", async () => {
    const msgData = {
      event: "message",
      instanceId: "4911",
      data: {
        message: {
          _data: {
            id: {
              fromMe: false,
              remote: "918588025016@c.us",
              id: "7F185E3CFD428C765A2969FE6036160C",
              _serialized:
                "false_918588025016@c.us_7F185E3CFD428C765A2969FE6036160C",
            },
            viewed: false,
            body: "Hi",
            type: "chat",
            t: 1706161575,
            notifyName: "Ankit Verma",
            from: `${newUser.waNumber}@c.us`,
            to: "919369892127@c.us",
            self: "in",
            ack: 1,
            invis: false,
            isNewMsg: true,
            star: false,
            kicNotified: false,
            recvFresh: true,
            isFromTemplate: false,
            pollInvalidated: false,
            isSentCagPollCreation: false,
            latestEditMsgKey: null,
            latestEditSenderTimestampMs: null,
            mentionedJidList: [],
            groupMentions: [],
            isEventCanceled: false,
            isVcardOverMmsDocument: false,
            isForwarded: false,
            hasReaction: false,
            productHeaderImageRejected: false,
            lastPlaybackProgress: 0,
            isDynamicReplyButtonsMsg: false,
            isCarouselCard: false,
            parentMsgId: null,
            isMdHistoryMsg: false,
            stickerSentTs: 0,
            isAvatar: false,
            lastUpdateFromServerTs: 0,
            invokedBotWid: null,
            bizBotType: null,
            botResponseTargetId: null,
            botPluginType: null,
            botPluginReferenceIndex: null,
            botPluginSearchProvider: null,
            botPluginSearchUrl: null,
            botPluginMaybeParent: false,
            botReelPluginThumbnailCdnUrl: null,
            botMsgBodyType: null,
            requiresDirectConnection: null,
            links: [],
          },
          id: {
            fromMe: false,
            remote: "918588025016@c.us",
            id: "7F185E3CFD428C765A2969FE6036160C",
            _serialized:
              "false_918588025016@c.us_7F185E3CFD428C765A2969FE6036160C",
          },
          ack: 1,
          hasMedia: false,
          body: "Hi",
          type: "chat",
          timestamp: 1706161575,
          from: "918588025016@c.us",
          to: "919369892127@c.us",
          deviceType: "android",
          isForwarded: false,
          forwardingScore: 0,
          isStatus: false,
          isStarred: false,
          fromMe: false,
          hasQuotedMsg: false,
          hasReaction: false,
          vCards: [],
          mentionedIds: [],
          groupMentions: [],
          isGif: false,
          links: [],
        },
        media: null,
      },
    };

    const response = await testEnv.server.inject({
      method: SAVE_WA_EXPENSE.method,
      url: SAVE_WA_EXPENSE.endPoint,
      payload: msgData,
    });
    expect(response.statusCode).to.eql(200);
    const expenses = await db("expenses").select("*");
    expect(expenses.length).to.eql(1);
    expect(expenses[0].userId).to.eql(userId);
    expect(expenses[0].textMessage).to.eql(msgData.data.message.body);
  });

  it("should handle if user account does not exist ", async () => {
    const msgData = {
      event: "message",
      instanceId: "4911",
      data: {
        message: {
          _data: {
            id: {
              fromMe: false,
              remote: "918588025016@c.us",
              id: "7F185E3CFD428C765A2969FE6036160C",
              _serialized:
                "false_918588025016@c.us_7F185E3CFD428C765A2969FE6036160C",
            },
            viewed: false,
            body: "Hi",
            type: "chat",
            t: 1706161575,
            notifyName: "Ankit Verma",
            from: `913582675678@c.us`,
            to: "919369892127@c.us",
            self: "in",
            ack: 1,
            invis: false,
            isNewMsg: true,
            star: false,
            kicNotified: false,
            recvFresh: true,
            isFromTemplate: false,
            pollInvalidated: false,
            isSentCagPollCreation: false,
            latestEditMsgKey: null,
            latestEditSenderTimestampMs: null,
            mentionedJidList: [],
            groupMentions: [],
            isEventCanceled: false,
            isVcardOverMmsDocument: false,
            isForwarded: false,
            hasReaction: false,
            productHeaderImageRejected: false,
            lastPlaybackProgress: 0,
            isDynamicReplyButtonsMsg: false,
            isCarouselCard: false,
            parentMsgId: null,
            isMdHistoryMsg: false,
            stickerSentTs: 0,
            isAvatar: false,
            lastUpdateFromServerTs: 0,
            invokedBotWid: null,
            bizBotType: null,
            botResponseTargetId: null,
            botPluginType: null,
            botPluginReferenceIndex: null,
            botPluginSearchProvider: null,
            botPluginSearchUrl: null,
            botPluginMaybeParent: false,
            botReelPluginThumbnailCdnUrl: null,
            botMsgBodyType: null,
            requiresDirectConnection: null,
            links: [],
          },
          id: {
            fromMe: false,
            remote: "918588025016@c.us",
            id: "7F185E3CFD428C765A2969FE6036160C",
            _serialized:
              "false_918588025016@c.us_7F185E3CFD428C765A2969FE6036160C",
          },
          ack: 1,
          hasMedia: false,
          body: "Hi",
          type: "chat",
          timestamp: 1706161575,
          from: "918588025016@c.us",
          to: "919369892127@c.us",
          deviceType: "android",
          isForwarded: false,
          forwardingScore: 0,
          isStatus: false,
          isStarred: false,
          fromMe: false,
          hasQuotedMsg: false,
          hasReaction: false,
          vCards: [],
          mentionedIds: [],
          groupMentions: [],
          isGif: false,
          links: [],
        },
        media: null,
      },
    };

    const response = await testEnv.server.inject({
      method: SAVE_WA_EXPENSE.method,
      url: SAVE_WA_EXPENSE.endPoint,
      payload: msgData,
    });
    expect(response.statusCode).to.eql(200);
    expect(response.result).to.eql("userDoesNotExist");
  });
});

describe("Get expense overview", () => {
  let testEnv;
  let userId;
  let authToken;
  const newUser = F.fakeUser(null);
  beforeEach(async () => {
    testEnv = await getTestEnv();
    await testEnv.resetDB();
    const response1 = await testEnv.server.inject({
      method: USER_SIGNUP.method,
      url: USER_SIGNUP.endPoint,
      payload: newUser,
    });
    userId = response1.result.userId;

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
    authToken = response.result.authToken;
  });

  it("should return expense overview", async () => {
    await saveExpense({ amount: 50, categoryId: 1 });
    await saveExpense({ amount: 150, categoryId: 1 });
    await saveExpense({ amount: 250, categoryId: 1 });
    await saveExpense({ amount: 350, categoryId: 1 });
    await saveExpense({ amount: 450, categoryId: 1 });
    const currentDate = new Date();
    const twoMonthsAgo = new Date(currentDate);
    twoMonthsAgo.setMonth(currentDate.getMonth() - 2);
    const timestampTwoMonthsAgo = twoMonthsAgo.getTime();
    await saveExpense({
      amount: 550,
      categoryId: 1,
      createdAt: new Date(timestampTwoMonthsAgo),
    });
    const response = await testEnv.server.inject({
      method: GET_EXPENSE_OVERVIEW.method,
      url: `${GET_EXPENSE_OVERVIEW.endPoint}?limit=5&page=1`,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    expect(response.statusCode).to.eql(200);
    expect(response.result.length).to.eql(5);
  });
});
