class Random {

  async color() {
    const colors = ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white', 'gray']
    const randomIndex = Math.floor(Math.random() * colors.length + 1)
    return colors[randomIndex]
  }

}

const random = new Random

export {random}