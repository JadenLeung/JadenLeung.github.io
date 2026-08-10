import { Square } from './Square';

// Compute a new grid for a given animation frame.
export function solvedAnimationFrame(frame, prevGrid, solution) {
  const newGrid = prevGrid.map(row =>
    row.map(cell => new Square(cell.text, cell.horizontal, cell.vertical, cell.row, cell.col, cell.cluenum, cell.bg))
  );

  // color first non-block in the first row (preserve original behavior)
  for (let blank = 0; blank < newGrid.length; blank++) {
    if (solution[0] && solution[0][blank] != '*') {
      newGrid[0][blank].bg = 1 + (frame % Square.numbg);
      break;
    }
  }

  const needschange = new Set();
  const rows = newGrid.length;
  const cols = newGrid[0]?.length || 0;

  function BGbelow(r, c, bg) {
    if (r < 0 || r >= rows || c < 0 || c >= cols || prevGrid[r][c].text == '*') {
      return false;
    }
    return prevGrid[r][c].bg < bg;
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const bg = newGrid[r][c].bg;
      if (BGbelow(r, c + 1, bg)) needschange.add(`${r},${c+1},${bg}`);
      if (BGbelow(r, c - 1, bg)) needschange.add(`${r},${c-1},${bg}`);
      if (BGbelow(r + 1, c, bg)) needschange.add(`${r+1},${c},${bg}`);
      if (BGbelow(r - 1, c - 1, bg)) needschange.add(`${r-1},${c},${bg}`);
    }
  }

  for (const entry of needschange) {
    const parts = entry.split(',').map(Number);
    const rr = parts[0], cc = parts[1], bg = parts[2];
    if (bg == 1 && newGrid[rr][cc].bg == Square.numbg - 1) {
      newGrid[rr][cc].bg = 1;
    } else {
      newGrid[rr][cc].bg = Math.max(newGrid[rr][cc]?.bg, bg);
    }
  }

  return newGrid;
}
