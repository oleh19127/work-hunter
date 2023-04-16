class Trim {
  whiteSpaces(string) {
    return string.replace(/\s+/g, " ").trim();
  }
}

const trim = new Trim();

export { trim };
