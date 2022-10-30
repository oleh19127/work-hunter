import { wrapper } from "../wrapper/index.js";
import { djinni } from "./Djinni.js";
import { workUa } from "./WorkUa.js";

class Parse {
  async init(searchText) {
    const [workUaVacancies, djinniVacancies] = await Promise.all([
      wrapper.method(workUa.init, searchText, "WorkUa"),
      wrapper.method(djinni.init, searchText, "Djinni"),
    ]);
    return [workUaVacancies, djinniVacancies];
  }
}

export const parse = new Parse();
