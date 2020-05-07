import Controller from "@ember/controller";

import { inject as service } from '@ember/service'
import { action } from "@ember/object";
import { task } from "ember-concurrency";
import { tracked } from '@glimmer/tracking'

export default class SignupController extends Controller {
  @service session;
  @service router;

  email = '';
  password = '';
  confirmPassword = '';

  @tracked errors = null;

  @action
  updateEmail(event) {
    this.email = event.target.value;
  }

  @action
  updatePassword(event) {
    this.password = event.target.value;
  }

  @action
  updateConfirmPassword(event) {
    this.confirmPassword = event.target.value;
  }

  @task(function*(event) {
    event.preventDefault();
    let response = yield this.session.signup(this.email, this.password, this.confirmPassword);
    let result = yield response.json();

    if (result.errors) {
      this.errors = result.errors;
      return;
    }

    this.session.setSession(result.data.id, result.meta.bearer);
    this.store.push(result);
    this.router.transitionTo("ballots");
  }).drop() signup;
}
