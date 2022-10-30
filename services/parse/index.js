import { workUa } from "./WorkUa.js";
import { djinni } from "./Djinni.js";

class Parse {
  async init(searchText) {
    const [workUaVacancies, djinniVacancies] = await Promise.all([
      workUa.init(searchText),
      djinni.init(searchText),
    ]);
    return [workUaVacancies, djinniVacancies];
  }
}

export const parse = new Parse();
