class Trim {
  whiteSpaces(string: string) {
    return string.replace(/\s+/g, " ").trim();
  }
}

const trim = new Trim();

export { trim };
