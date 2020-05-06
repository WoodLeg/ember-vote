import Controller from "@ember/controller";
import { task } from "ember-concurrency";
import { action } from "@ember/object";
import fetch from "fetch";
import { tracked } from "@glimmer/tracking";
import { inject as service } from "@ember/service";
import { serializeAndPush } from "ember-api-actions";

export default class LoginController extends Controller {
  @service session;
  @service router;
  @service store;

  email = null;
  password = null;

  @tracked errors = null;

  @action
  updateEmail(event) {
    this.email = event.target.value;
  }

  @action
  updatePassword(event) {
    this.password = event.target.value;
  }

  @task(function* (event) {
    event.preventDefault();

    let response = yield fetch("http://localhost:4242/users/signin", {
      method: "POST",
      mode: "same-origin", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      // credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: this.email,
        password: this.password,
      }),
    });

    let result = yield response.json();
    if (result.errors) {
      this.errors = result.errors;
      return;
    }

    this.session.setSession(result.data.id, result.meta.bearer);
    this.store.push(result);
    this.router.transitionTo("ballots");
  }).drop()
  signin;
}
