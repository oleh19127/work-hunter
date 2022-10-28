import { djinni } from "./djinni.js";
import { workUa } from "./WorkUa.js";
import { wrapper } from "../wrapper/index.js";

class Parse {
  async init(searchText) {
    const [workUaVacancies, djinniVacancies] = await Promise.all([
      wrapper.func(workUa.init, "WorkUa", searchText),
      wrapper.func(djinni.init, "Djinni", searchText),
    ]);
    return [workUaVacancies, djinniVacancies];
  }
}

export const parse = new Parse();
