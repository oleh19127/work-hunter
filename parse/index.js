import { WorkUa } from "./work-ua.js";
import { Djinni } from "./djinni.js";

export class Parse {
  async init(searchText) {
    const [workUaVacancies, djinniVacancies] = await Promise.all([
      new WorkUa(searchText).init(),
      new Djinni(searchText).init(),
    ]);
    return [workUaVacancies, djinniVacancies];
  }
}
