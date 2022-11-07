import { red, green, yellow } from "colorette";

const log = console.log;

class Print {
  successfully(message: string) {
    log(green(message));
  }

  error(message: string) {
    log(red(message));
  }

  warning(message: string) {
    log(yellow(message));
  }
}

export const print = new Print();
