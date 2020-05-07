import Controller from "@ember/controller";
import { task } from "ember-concurrency";
import { action } from "@ember/object";
import fetch from "fetch";
import { tracked } from "@glimmer/tracking";
import { inject as service } from "@ember/service";

export default class LoginController extends Controller {
  @service session;
  @service router;
  @service store;

  @tracked email = '';
  @tracked password = '';
  @tracked errors = null;

  @action
  updateEmail(event) {
    this.email = event.target.value;
  }

  get disableSubmitBtn() {
    return this.email.length <= 0 || this.password.length <= 0;
  }

  @action
  updatePassword(event) {
    this.password = event.target.value;
  }

  @task(function* (event) {
    event.preventDefault();

    const response = yield this.session.signin(this.email, this.password);
    const result = yield response.json()

    console.log(result)
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
