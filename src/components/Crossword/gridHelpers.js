export function isObstacle(g, r, c) {
  if (!g || r < 0 || r >= g.length || c < 0 || c >= g[0].length) return true;
  return g[r][c].text === '*';
}

export function computeHighlightedSquares(g, row, col, curdir) {
  const result = [];
  if (!g || !g.length) return result;
  if (row < 0 || row >= g.length || col < 0 || col >= g[0].length) return result;
  if (g[row][col].text == '*') return result;

  if (curdir === 'h') {
    let c = col;
    while (c - 1 >= 0 && g[row][c - 1].text != '*') c--;
    while (c < g[0].length && g[row][c].text != '*') {
      result.push([row, c]);
      c++;
    }
  } else {
    let r = row;
    while (r - 1 >= 0 && g[r - 1][col].text != '*') r--;
    while (r < g.length && g[r][col].text != '*') {
      result.push([r, col]);
      r++;
    }
  }
  return result;
}

export function getCellFromClueNumber(g, cluenum) {
  if (!g) return null;
  for (let i = 0; i < g.length; i++) {
    for (let j = 0; j < g[i].length; j++) {
      if (g[i][j].cluenum == cluenum) return [i, j];
    }
  }
  return null;
}
