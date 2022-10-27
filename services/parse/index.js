import { djinni } from "./djinni.js";
import { workUa } from "./WorkUa.js";
import { wrapper } from "../wrapper/index.js";

class Parse {
  async init(searchText) {
    const workUaVacancies = await wrapper.func(
      workUa.init,
      "WorkUa",
      searchText
    );
    const djinniVacancies = await wrapper.func(
      djinni.init,
      "Djinni",
      searchText
    );
    return [workUaVacancies, djinniVacancies];
  }
}

export const parse = new Parse();
