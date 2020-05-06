import Model, { attr } from "@ember-data/model";
import { memberAction, serializeAndPush } from "ember-api-actions";

export default class UserModel extends Model {
  @attr("string") email;
  @attr("string") password;
}
