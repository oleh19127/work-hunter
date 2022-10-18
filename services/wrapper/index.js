import ora from "ora"
import {random} from "../random/index.js";

class Wrapper {
  async func(f, site, searchText) {
    const spinner = ora(`Search in ${site}: ${searchText}`).start()
    spinner.color = await random.color()
    const result = await f(searchText)
    spinner.succeed()
    return result
  }

}

const wrapper = new Wrapper()

export {wrapper}
