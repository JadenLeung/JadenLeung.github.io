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

// Returns a Set of "r,c" strings representing all squares to highlight for
// the clicked cell including any grouped clues defined in `info.groupedClues`.
export function getGroupedHighlightSet(g, info, row, col, curdir) {
  const result = new Set();
  if (!g || !g.length) return result;

  // base derived for the clicked cell
  const base = computeHighlightedSquares(g, row, col, curdir);
  base.forEach(([r, c]) => result.add(`${r},${c}`));

  if (!info || !Array.isArray(info.groupedClues) || base.length === 0) return result;

  const startCell = g[base[0][0]][base[0][1]];
  const curClueNum = startCell?.cluenum;
  if (!curClueNum) return result;

  const curLabel = `${curClueNum}${curdir === 'h' ? 'A' : 'D'}`;

  info.groupedClues.forEach(group => {
    if (!Array.isArray(group)) return;
    if (group.includes(curLabel)) {
      group.forEach(label => {
        if (label === curLabel) return;
        const m = String(label).match(/(\d+)([AaDd])?/);
        if (!m) return;
        const num = parseInt(m[1], 10);
        const dirLetter = m[2] ? m[2].toUpperCase() : null;
        const otherDir = dirLetter === 'A' ? 'h' : dirLetter === 'D' ? 'v' : null;
        const cell = getCellFromClueNumber(g, num);
        if (!cell) return;
        const [r, c] = cell;
        const otherDerived = computeHighlightedSquares(g, r, c, otherDir || curdir);
        otherDerived.forEach(([rr, cc]) => result.add(`${rr},${cc}`));
      });
    }
  });

  return result;
}
