import ora from "ora";
import { random } from "../random/index.js";

class Wrapper {
  async method(meth, searchText, searchSite) {
    const spinner = ora(`Search in ${searchSite}: ${searchText}`).start();
    spinner.color = await random.color();
    const result = await meth(searchText);
    spinner.succeed();
    return result;
  }
}

const wrapper = new Wrapper();

export { wrapper };
