export const USER_TABLE = "users";
export const PROFESSIONS_TABLE = "professions";

export const USER_SIGNUP = {
  endPoint: "/user/signup",
  method: "POST",
  auth: false,
  tags: ["user-signup", "api", "user"],
  failAction: "log",
  reCaptcha: false,
  description: "User signup api",
  notes: "User signup api",
};
