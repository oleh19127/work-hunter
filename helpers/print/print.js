import { red, green, yellow } from "colorette";

const log = console.log;

class Print {
  successfully(message) {
    log(green(message));
  }

  error(message) {
    log(red(message));
  }

  warning(message) {
    log(yellow(message));
  }

  default(message) {
    log(message);
  }
}

export const print = new Print();
