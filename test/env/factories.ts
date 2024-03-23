import * as faker from "faker";
import * as _ from "ramda";
import db from "src/db";

export const getRandomValueFromArray = <T>(inputArray: Array<T>): T => {
  return inputArray[Math.floor(Math.random() * inputArray.length)];
};

export function fakeUser(options) {
  const user = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    password: "VTrack@8765",
    waNumber: faker.phone.phoneNumber("############"),
  };
  return _.mergeRight(user, options);
}
