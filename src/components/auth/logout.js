import { createBrowserHistory } from "history";

export default function Logout() {
  const history = createBrowserHistory({ forceRefresh: true });
  localStorage.setItem("session", null);
  history.replace("/login");

  return "";
}
