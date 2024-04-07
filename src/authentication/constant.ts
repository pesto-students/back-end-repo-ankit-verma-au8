export const SESSION_TABLE = "session";

export const AUTH_LOGIN = {
  endPoint: `/auth/login`,
  method: "POST",
  auth: false,
  tags: ["user-login", "api"],
  failAction: "log",
  reCaptcha: true,
  description: "User login api",
  notes: "User login api",
};

export const AUTH_LOGOUT = {
  endPoint: `/auth/logout`,
  method: "POST",
  auth: {
    scope: ["user", "admin"],
  },
  tags: ["user-logout", "api"],
  failAction: "log",
  reCaptcha: false,
  description: "User logout api",
  notes: "User logout api",
};
