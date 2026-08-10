import React, { useState, useEffect, useRef } from 'react';
import styles from './CrosswordComp.module.css';
import {Cell} from './Cell.jsx';
import {Clue} from './Clue.jsx';
import { Square } from './Square';
import { isObstacle, computeHighlightedSquares, getCellFromClueNumber, getGroupedHighlightSet } from './gridHelpers';
import {data} from './data';
import Keyboard from 'react-simple-keyboard';
import { useParams } from 'react-router-dom';
import 'simple-keyboard/build/css/index.css';

export const CrosswordComp = ({crosswordName, board, setBoard}) => {
  const [cluenums, setClueNums] = useState({});
  const [selected, setSelected] = useState([-1, -1]);
  const [highlighted, setHighlighted] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState(data[board]);
  const [dir, setDir] = useState('h');
  const [mode, setMode] = useState("normal");
  const [solved, setSolved] = useState(false);
  const [startanimation, setStartAnimation] = useState(0);
  const gridRef = useRef(null);
  const [solution, setSolution] = useState(null);
  const [across, setAcross] = useState({});
  const [down, setDown] = useState({});
  const [grid, setGrid] = useState([]);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [selectedclue, setSelectedClue] = useState(0);
  const [cheat, setCheat] = useState(false);
  const [extraElapsed, setExtraElapsed] = useState(0);
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const initialWindow = useRef({ width: window.innerWidth, height: window.innerHeight });
  const MAX_WIDTH = "767px";
  const isthin = window.matchMedia("(max-width: " + MAX_WIDTH + ")").matches;
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) && isthin;
  const WIDTH_MULT = isMobile ? 1.1 : 1.25;
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  let colnum = 1;

  // Main timer loop
  useEffect(() => {
    let timer;
    if (!solved && isRunning) {
      timer = setInterval(() => {
        setElapsed(Date.now() - startTime);
      }, 1);
    }

    return () => clearInterval(timer);
  }, [isRunning, solved, startTime]);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");
    return Math.round(ms / 10) / 100.0;
  };

  const totalElapsed = elapsed + extraElapsed;

  const fetchCrossword = async (url, boardname) => {
    setLoading(true);
    setSolved(false);
    setSolution(null)
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const res = await response.json();
      data[boardname] = res;
      setIsRunning(true);
      setStartTime(Date.now());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (board == "NYT Mini Crossword" && Object.keys(data["NYT Mini Crossword"]).length < 3) {
      fetchCrossword(data.CROSSWORD_URL, "NYT Mini Crossword");
    }
    if (board == "AI Generated Mini Crossword" && Object.keys(data["AI Generated Mini Crossword"]).length < 3) {
      fetchCrossword(data.AI_URL, "AI Generated Mini Crossword");
    }
  }, [board]);

  useEffect(() => {
    console.log(data, data[board]);
    if (loading || !data[board]?.solution) return;

    const puzzle = data[board];
    setStartTime(Date.now());
    setIsRunning(true);
    setSolution(puzzle.solution);
    setAcross(puzzle.across);
    setDown(puzzle.down);
    setInfo(puzzle);
    setSelected([-1, -1]);
    setHighlighted(new Set());
    setSelectedClue(0);
    setExtraElapsed(0);

    setGrid(prevGrid => {
      const solution = puzzle.solution;
      const rowsCount = solution.length;
      const colsCount = solution[0].length;

      const newGrid = Array.from({ length: rowsCount }, (_, r) =>
        Array.from({ length: colsCount }, (_, c) => 
          new Square(solution[r][c] === "*" ? "*" : "", false, false, r, c, -1)
        )
      );

      let colnum = 1;
      const temp = {};

      for (let rows = 0; rows < rowsCount; ++rows) {
        for (let cols = 0; cols < colsCount; ++cols) {
          if (isObstacle(newGrid, rows, cols)) continue;

          const key = `${rows},${cols}`; // Use a delimiter

          const startsDown = isObstacle(newGrid, rows - 1, cols) && !isObstacle(newGrid, rows + 1, cols);
          const startsAcross = isObstacle(newGrid, rows, cols - 1) && !isObstacle(newGrid, rows, cols + 1);

          if (startsDown && startsAcross) {
            temp[key] = [colnum, "vh"];
            colnum++;
          } else if (startsDown) {
            temp[key] = [colnum, "v"];
            colnum++;
          } else if (startsAcross) {
            temp[key] = [colnum, "h"];
            colnum++;
          }
        }
      }

      for (const key in temp) {
        const [num] = temp[key];
        const [i, j] = key.split(",").map(Number); // Parse multi-digit indices properly
        newGrid[i][j].cluenum = num;
      }

      // Try to restore saved board state from localStorage for this board
      try {
        const saveKey = getSaveKey(board, puzzle);
        const saved = localStorage.getItem(saveKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && Array.isArray(parsed.grid) && parsed.grid.length === rowsCount && parsed.grid[0].length === colsCount) {
            for (let r = 0; r < rowsCount; r++) {
              for (let c = 0; c < colsCount; c++) {
                // only overwrite non-block cells
                if (newGrid[r][c].text !== '*') {
                  newGrid[r][c].text = parsed.grid[r][c] || "";
                }
              }
            }
            // restore selected/dir/cheat if present
            if (parsed.selected && parsed.selected.length === 2) {
              setSelected(parsed.selected);
              setDir(parsed.dir || 'h');
              const derived = computeHighlightedSquares(newGrid, parsed.selected[0], parsed.selected[1], parsed.dir || 'h');
              setHighlighted(new Set(derived.map(([r, c]) => `${r},${c}`)));
              setSelectedClue(derived.length ? newGrid[derived[0][0]][derived[0][1]].cluenum : 0);
            }
            if (typeof parsed.cheat === 'boolean') {
              setCheat(parsed.cheat);
            }
            if (typeof parsed.extraElapsed === 'number') {
              setExtraElapsed(parsed.extraElapsed);
            } else if (typeof parsed.elapsed === 'number') {
              setExtraElapsed(parsed.elapsed);
            }
          }
        }
      } catch (e) {
        console.warn('Failed to restore saved crossword state', e);
      }

      setClueNums(temp);
      return newGrid;
    });
  }, [loading, data, board]);

  const cleanupOldNytSaves = (currentDay) => {
    if (!currentDay) return;
    try {
      const prefix = `crossword_save_${encodeURIComponent('NYT Mini Crossword')}_`;
      const allowedKey = `${prefix}${encodeURIComponent(currentDay)}`;
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix) && key !== allowedKey) {
          localStorage.removeItem(key);
        }
      }
    } catch (e) {
      console.warn('Failed to cleanup old NYT saves', e);
    }
  };

  const getSaveKey = (boardName, puzzleInfo) => {
    const base = `crossword_save_${encodeURIComponent(boardName)}`;
    if (boardName === 'NYT Mini Crossword' && puzzleInfo?.day) {
      return `${base}_${encodeURIComponent(puzzleInfo.day)}`;
    }
    return base;
  };

  // Persist current grid to localStorage per-board. Nullify when solved or cleared.
  useEffect(() => {
    if (!solution || loading) return;
    if (board === 'NYT Mini Crossword') {
      cleanupOldNytSaves(info.day);
    }

    const saveKey = getSaveKey(board, info);
    try {
      if (solved || mode === 'solved') {
        localStorage.removeItem(saveKey);
        return;
      }
      const gridToSave = grid.map(row => row.map(cell => cell.text));
      const payload = { grid: gridToSave, selected, dir, cheat, extraElapsed: totalElapsed };
      localStorage.setItem(saveKey, JSON.stringify(payload));
    } catch (e) {
      console.warn('Failed to save crossword state', e);
    }
  }, [grid, board, selected, dir, solved, mode, loading, solution, info, cheat, totalElapsed]);


  useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) {
      return;
    }
    moveSelected(e); // call your existing logic
  };

  document.addEventListener('keydown', handleKeyDown);

  // cleanup on unmount
  return () => {
    document.removeEventListener('keydown', handleKeyDown);
  };
}, [selected, dir, grid]);

  useEffect(() => {

    if (loading || !solution) return;

    let solved = true;
    for (let rows = 0; rows < solution.length; ++rows) {
      for (let cols = 0; cols < solution[0].length; ++cols) {
        if (grid[rows][cols].text != solution[rows][cols]) {
          solved = false;
        }
      }
    }
    if (solved) {
      setMode("solved");
      setShowKeyboard(false);
      setSelected([-1, -1]);
      setHighlighted(new Set())
      setSelectedClue(0);
      setSolved(true);
    }
  }, [grid, loading, solution])

  useEffect(() => {
    if (mode === "solved") {
      if (!cheat && board == "NYT Mini Crossword" && localStorage.lastSolutionDate != data[board].day) {
        if ((!localStorage.bestTime || totalElapsed < localStorage.bestTime)) {
          localStorage.bestTime = totalElapsed;
        }
        if ((localStorage.lastRecordedWeek != getWeeksSince() || totalElapsed < localStorage.bestWeekTime)) {
          localStorage.bestWeekTime = totalElapsed;
          localStorage.lastRecordedWeek = getWeeksSince();
        }
      }
      if (board == "NYT Mini Crossword") {
        localStorage.lastSolutionDate = data[board].day
      }
      const animations = [1000, 1200, 5000, 6500];
      const ids = [];
      animations.forEach((times, i) => {
          const t = setTimeout(() => {
            setStartAnimation(i + 1);
          }, times);
          ids.push(t)
      })

      let period = 0;
      let timeoutId;

      function animate() {
        solvedAnimation(period);
        period = (period + 1) % (100 * Square.numbg);

        const delay = 30 + 200 / (period + 1);
        if (period < 200)
          timeoutId = setTimeout(animate, delay);
      }
      if (period < 150)
        animate();

      // cleanup: stop animation when mode changes/unmounts
      return () => {
        ids.forEach((t) => {
          clearTimeout(t);
        })
        clearTimeout(timeoutId);
      };
    }
  }, [solved, mode]);

  // Auto-scroll selected clue into view
  function scrollClue(cluenum, dir) {
    if (!cluenum) return;
    const id = `clue-${dir}-${cluenum}`;
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check if the key pressed is "Shift"
      if (event.key === 'Shift') { /* shift pressed */ }
    };

    // Add listener to the window
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup function: removes listener when component is destroyed
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  function solvedAnimation(frame) {
    setGrid(prevGrid => {
    const newGrid = prevGrid.map(row =>
      row.map(cell => new Square(cell.text, cell.horizontal, cell.vertical, cell.row, cell.col, cell.cluenum, cell.bg))
    );

    // newGrid[0][0].bg = (newGrid[0][0].bg + 1) % Square.numbg; 
    console.log("frame is", frame, mode, solved);
    for (let blank = 0; blank < newGrid.length; blank++) {
      if (solution[0][blank] != '*') {
        newGrid[0][blank].bg = 1 + (frame % Square.numbg);
        break;
      }
    }
    let needschange = new Set()
    for (let r = 0; r < newGrid.length; r++) {
      for (let c = 0; c < newGrid[0].length; c++) {
        let bg = newGrid[r][c].bg;
        if (BGbelow(r, c + 1, bg)) needschange.add([r, c + 1, bg]);
        if (BGbelow(r, c - 1, bg)) needschange.add([r, c - 1, bg]);
        if (BGbelow(r + 1, c, bg)) needschange.add([r + 1, c , bg]);
        if (BGbelow(r - 1, c - 1, bg)) needschange.add([r - 1, c, bg]);
      }
    }
    for (const arr of needschange) {
      if (arr[2] == 1 && newGrid[arr[0]][arr[1]].bg == Square.numbg - 1) {
        newGrid[arr[0]][arr[1]].bg = 1;
      } else {
        newGrid[arr[0]][arr[1]].bg = Math.max(newGrid[arr[0]][arr[1]]?.bg, arr[2]);
      }
    }

    function BGbelow(r, c, bg) {
      if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c].text == '*') {
        return false;
      }
      return grid[r][c].bg < bg;
    }

    return newGrid;
    });
  }

  function clicked(row, col, d) {
    if (solved) return;
    setShowKeyboard(true);

    let curdir = d ? d : dir;
    if (!d && selected[0] === row && selected[1] === col) {
      curdir = dir === 'h' ? 'v' : 'h';
    }
    if (!d) {
      if (isObstacle(grid, row + 1, col) && isObstacle(grid, row - 1, col)) curdir = 'h';
      else if (isObstacle(grid, row, col + 1) && isObstacle(grid, row, col - 1)) curdir = 'v';
    }

    setDir(curdir);
    setSelected([row, col]);

    const derived = computeHighlightedSquares(grid, row, col, curdir);
    const setVals = getGroupedHighlightSet(grid, info, row, col, curdir);
    const clueNum = derived.length ? grid[derived[0][0]][derived[0][1]].cluenum : 0
    setHighlighted(setVals);
    setSelectedClue(clueNum);
    scrollClue(clueNum, curdir)
  }

  function moveSelected(e) {
    if (mode != "normal" && mode != "autocheck") return;
    if (selected[0] == -1) return;
    let dr = 0
    let dc = 0;
    const map = {
      "ArrowRight" : [0, 1],
      "ArrowLeft" : [0, -1],
      "ArrowUp" : [-1, 0],
      "ArrowDown" : [1, 0]
    }
    if (map.hasOwnProperty(e.key)) {
      [dr, dc] = map[e.key];
      if (!isObstacle(grid, selected[0] + dr, selected[1] + dc)) {
        clicked(selected[0] + dr, selected[1] + dc)
      }
    } else {
        setGrid(prevGrid => {
            console.log("herere")
            const newGrid = prevGrid.map(row =>
                row.map(cell => new Square(cell.text, cell.horizontal, cell.vertical, cell.row, cell.col, cell.cluenum, cell.bg))
            );
            let typed = e.key;
            if (typed == "Backspace") {
              typed = ""
            }
            let y = selected[0]
            let x = selected[1]
            if (typed.length < 2 && ('A' <= typed && typed <= 'Z' || 'a' <= typed && typed <= 'z' || typed == '')) {
                newGrid[y][x].text = typed.toUpperCase();
                if (typed.length == 1) {
                    if (dir == "h") shiftDir(y, x + 1); else shiftDir(y + 1, x);
                } else if (typed == "") {
                    if (dir == "h") shiftDir(y, x - 1); else shiftDir(y - 1, x);
                }
            }
            return newGrid;
        });
    }
  }

  function shiftDir(newrow, newcol) {
    if (!isObstacle(grid, newrow, newcol)) {
      clicked(newrow, newcol)
    }
  }

  function getWeeksSince(startDateString = "04/19/2026") {
    const target = new Date(data[board].day);
    const start = new Date(startDateString);

    // Difference in milliseconds
    const diffInMs = target - start;

    // Convert ms to weeks: (ms / 1000ms / 60s / 60m / 24h / 7d)
    const weeks = diffInMs / (1000 * 60 * 60 * 24 * 7);

    return Math.floor(weeks);
  }

  function clearGrid() {
    if (solved) return;
    const result = confirm("Are you sure you want to clear your grid?");
    if (result) {
      // remove saved state for this board
      try { localStorage.removeItem(getSaveKey(board, info)); } catch(e) {}
      setMode("normal");
      setGrid(prevGrid => {
            console.log("herere")
            const newGrid = prevGrid.map(row =>
                row.map(cell => new Square(cell.text, cell.horizontal, cell.vertical, cell.row, cell.col, cell.cluenum, cell.bg))
            );
            for (let r = 0; r < newGrid.length; r++) {
              for (let c = 0; c < newGrid[0].length; c++) {
                newGrid[r][c].text = newGrid[r][c].text == "*" ? "*" : "";
              }
            }
            return newGrid;
        });
    } else {
      console.log("Cancelled.");
    }
  }

  function inRange() {
    console.log(selected)
    return selected[0] >= 0 && selected[0] < solution.length && selected[1] >= 0 && selected[1] < solution[0].length;
  }

  function revealCell() {
    if (!inRange()) {
      return;
    }
    const event = { key: solution[selected[0]][selected[1]] };
    localStorage.lastSolutionDate = data[board].day
    setCheat(true);
    moveSelected(event);
  }

  function solveGrid() {
    if (solved) return;
    const result = confirm("Are you sure you want the solution?");
    if (result) {
      try { localStorage.removeItem(getSaveKey(board, info)); } catch(e) {}
      localStorage.lastSolutionDate = data[board].day
      setCheat(true);
      setMode("normal");
      setGrid(prevGrid => {
            const newGrid = prevGrid.map(row =>
                row.map(cell => new Square(cell.text, cell.horizontal, cell.vertical, cell.row, cell.col, cell.cluenum, cell.bg))
            );
            for (let r = 0; r < newGrid.length; r++) {
              for (let c = 0; c < newGrid[0].length; c++) {
                newGrid[r][c].text = solution[r][c];
              }
            }
            return newGrid;
        });
    } else {
      console.log("Cancelled.");
    }
  }

  function changeBoard(b) {
    setStartAnimation(0);
    setSolved(false);
    setBoard(b);
    setMode("normal");
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }

  function handleTitleClick() {
    if (board == "AI Generated Mini Crossword") {
      if (confirm("Generate New AI Crossword?")) {
        setLoading(true);
        fetchCrossword(data.AI_URL, "AI Generated Mini Crossword");
      }
    }
  }

  if (loading || !solution) {
    return (
    <div className={styles.page}>
       <h4 className={styles.title}>{board == "NYT Mini Crossword" ? "Loading today's NYT Mini Crossword..." : board == "AI Generated Mini Crossword" ? "Generating AI Crossword..." : "Error"}</h4>
    </div>);
  }

  
  return (
    <div className={styles.page}
        ref={gridRef}
        tabIndex={0} 
    >
      <div className={styles.navbar}>
        {!isMobile && <h4 className={styles.title} onClick={handleTitleClick}>{info.title}</h4>}
        <div className={styles.autocheck}>
          <button className={styles.clear} onClick={clearGrid}>Clear</button>
          {!info.noSolution &&
            <>
              <button onClick={(e) => {
                if (solved) return;
                localStorage.lastSolutionDate = data[board].day
                setCheat(true);
                setMode(mode != "autocheck" ? "autocheck" : "normal");
              }} className={styles.clear}
              style={{
                backgroundColor: mode == "autocheck" ? "#a7d8ff" : ""
              }}
              >Autocheck</button>
              <button className={styles.clear}onClick={revealCell}>Reveal Cell</button>
              <button className={styles.clear}onClick={solveGrid}>Solution</button>
            </>
          }
          <select className={styles.select} onChange={(e) => {changeBoard(e.target.value)}} value={board}>
            <option value="NYT Mini Crossword">NYT Mini Crossword</option>
            <option value="AI Generated Mini Crossword">AI Generated Crossword</option>
            <option value="Father's Day 2025">Father's Day 2025</option>
            <option value="Joley's Crossword">Joley's Crossword</option>
            <option value="Charlotte's Birthday Crossword">Charlotte's Birthday Crossword</option>
            <option value="Ally's STR Crossword">Ally's STR Crossword</option>
          </select>
        </div>
      </div>
      <div className={styles.container}>
        <div className={styles.rec} style={{
          '--cols': grid[0].length,
          '--width': `${(Math.min(initialWindow.current.height, initialWindow.current.width) / (Math.max(grid.length, grid[0].length) * WIDTH_MULT)) * grid[0].length}px`,
          '--height': `${(Math.min(initialWindow.current.height, initialWindow.current.width) / (Math.max(grid.length, grid[0].length) * WIDTH_MULT)) * grid.length}px`,
        }}>
              {grid.map((row, i) => 
            row.map((c, j) => 
              <Cell key={`${i}-${j}-${c.cluenum}`} x={c.col} y={c.row} cluenum={c.cluenum} text={c.text} grid={grid} 
                selected={selected} clicked={clicked} highlighted={highlighted.has(`${i},${j}`)} shiftDir={shiftDir} dir={dir} expected={solution[i][j]}
                mode={mode} WIDTH_MULT={WIDTH_MULT} moveSelected={moveSelected}
                initialWidth={initialWindow.current.width} initialHeight={initialWindow.current.height} />
            )
          )}
        </div>
        {startanimation > 0 && startanimation < 4 && solved &&
            <div className={styles.winnercontainer}
              style={{
                transform: startanimation != 2 ? '' : 'translateX(0)'
              }}
            >
              <h1 className={styles.winnerText}>{`You solved the crossword in ${formatTime(totalElapsed)} secs.`}</h1>
              <h1 className={styles.winnerText}>{info.message}</h1>
            </div>
        }
        {!isMobile && (startanimation < 1 || startanimation == 4) && <div className={styles.cluecontainer} style={{
          opacity: solved && startanimation < 4 ? '0' : '1',
        }}>
          <div className={styles.col1}>
            <p style={{marginBottom: 20}}>ACROSS</p>
            <div>
              {Object.keys(across).map(key => (
                <Clue key={key} num={key} grid={grid} direction="h" curdir={dir} 
                    clicked={clicked} setDir={setDir} isMobile={isMobile} selectedclue={selectedclue}>{across[key]}</Clue>
              ))}
              </div>
          </div>
          <div className={styles.col2}>
           <p style={{marginBottom: 20}}>DOWN</p>
            <div>
              {Object.keys(down).map(key => (
                <Clue key={key} num={key} grid={grid} direction="v" curdir={dir} 
                clicked={clicked} setDir={setDir} isMobile={isMobile} selectedclue={selectedclue}>{down[key]}</Clue>
              ))}
              </div>
          </div>
          {solved && startanimation >= 4 &&
            <div className={styles.displayTime}>
              <p>Time: {formatTime(totalElapsed)}s{cheat ? " (with hints)" : ""}</p>
              {localStorage.lastRecordedWeek == getWeeksSince() && board == "NYT Mini Crossword" && <p>Best Time This Week: {formatTime(localStorage.bestWeekTime)}s</p>}
              {localStorage.bestTime && board == "NYT Mini Crossword" && <p>Best Ever Time: {formatTime(localStorage.bestTime)}s</p>}
            </div>
          }
        </div>}
      </div>
      {/* Mobile custom keyboard */}
      {selectedclue != 0 && isMobile && (
  <div style={{
    position: 'fixed',
    bottom: 5,
    left: 0,
    width: '100%',
    zIndex: 1000,          // make sure it’s above other elements
    backgroundColor: '#fff', // optional: match page background
  }}>
    {selectedclue && <Clue num={selectedclue} grid={grid} direction={dir} curdir={dir} 
                clicked={clicked} setDir={setDir} isMobile={isMobile} selectedclue={selectedclue}>{dir == "h" ? across[selectedclue] : down[selectedclue]}</Clue>}
    <Keyboard
      layout={{
        default: ['Q W E R T Y U I O P', 'A S D F G H J K L', 'Z X C V B N M {bksp}'],
      }}
      display={{
        '{bksp}': '⌫',
      }}
      theme={'hg-theme-default hg-layout-default'}
      onKeyPress={(button) => {
        let key = button;
        if (button === '{bksp}') key = 'Backspace';
        moveSelected({ key });
      }}
    />
  </div>
)}
    </div>
  );
};
