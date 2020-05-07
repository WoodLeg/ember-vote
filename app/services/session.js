import Service from "@ember/service";
import { tracked } from "@glimmer/tracking";

export default class SessionService extends Service {
  token = null;
  type = null;
  @tracked _userId = null;
  @tracked _authenticated = null;

  get isAuthenticated() {
    return this._authenticated;
  }

  get userId() {
    return this._userId;
  }

  _setToken(value) {
    const [bearer, token] = value.split(" ");
    this.token = token;
    this.type = bearer;
  }

  setSession(id, token) {
    this._setToken(token);
    this._userId = id;
    this._authenticated = true;
    // TODO
    // Add to localStorage
  }

  deleteSession() {
    this.token = null;
    this.type = null;
    this._authenticated = false;
  }

  async signin(email, password) {
    return fetch("http://localhost:4242/users/signin", {
      method: "POST",
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
  }

  async signup(email, password, confirmPassword) {
    return fetch("http://localhost:4242/users/signup", {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        confirmPassword,
      }),
    });
  }
}
