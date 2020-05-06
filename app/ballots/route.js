import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";

export default class BallotsRoute extends Route {
  @service session;

  beforeModel() {
    if (!this.session.isAuthenticated) {
      this.transitionTo("login");
    }
  }

  model() {
    return this.store.peekRecord("user", this.session.userId);
  }
}
