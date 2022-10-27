import { red, green } from "colorette";

const log = console.log;

class Print {
  successfully(message) {
    log(green(message));
  }

  error(message) {
    log(red(message));
  }
}

export const print = new Print();
