import { print } from "./helpers/print/print.js";
import { telegram } from "./telegram/telegram.js";

class WorkHunter {
  async init() {
    try {
      print.successfully("App started!!!");
      await telegram();
    } catch (e) {
      print.error(e);
      console.log(e);
    }
  }
}

const workHunter = new WorkHunter();

await workHunter.init();
