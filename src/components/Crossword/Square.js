export class Square {
    constructor(text, horizontal, vertical, row, col, cluenum) {
      this.text = text;
      this.horizontal = horizontal;
      this.vertical = vertical;
      this.row = row;
      this.col = col;
      this.cluenum = cluenum;
    }
    toString() {
      return `Cell(${this.row}, ${this.col}) = "${this.text}", ${this.cluenum}`;
    }
  }