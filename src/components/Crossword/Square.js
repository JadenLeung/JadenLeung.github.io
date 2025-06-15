export class Square {

    static numbg = 99;
    static colors = {
        0: "white",
        1: "red",
        2: "orange",
        3: "yellow",
        4: "#88E788",
        5: "blue",
        6: "purple",
        7: "pink",
        8: "blue",
        9: "#88E788",
    }
    constructor(text, horizontal, vertical, row, col, cluenum, bg = 0) {
      this.text = text;
      this.horizontal = horizontal;
      this.vertical = vertical;
      this.row = row;
      this.col = col;
      this.cluenum = cluenum;
      this.bg = bg;
    }
    toString() {
      return `Cell(${this.row}, ${this.col}) = "${this.text}", ${this.cluenum}, ${this.bg}`;
    }
  }