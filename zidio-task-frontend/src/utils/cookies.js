// utils/cookies.js
import Cookies from "js-cookie";

export const setUserCookie = (user) => {
  Cookies.set("user", JSON.stringify(user), { expires: 1 });
};

export const getUserFromCookie = () => {
  const user = Cookies.get("user");
  return user ? JSON.parse(user) : null;
};

export const removeUserCookie = () => {
  Cookies.remove("user");
};
