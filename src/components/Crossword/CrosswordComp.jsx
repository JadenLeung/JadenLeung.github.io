import React, { useState, useEffect, useRef } from 'react';
import styles from './CrosswordComp.module.css';
import {Cell} from './Cell.jsx';
import {Clue} from './Clue.jsx';
import { Square } from './Square';
import {data} from './data';
import Keyboard from 'react-simple-keyboard';
import 'simple-keyboard/build/css/index.css';




export const CrosswordComp = () => {

  const [board, setBoard] = useState("NYT Mini Crossword");
  const [cluenums, setClueNums] = useState({});
  const [selected, setSelected] = useState([-1, -1]);
  const [sameline, setSameLine] = useState([]);
  const [loading, setLoading] = useState(true);
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
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const MAX_WIDTH = "767px";
  const isthin = window.matchMedia("(max-width: " + MAX_WIDTH + ")").matches;
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) && isthin;
  const WIDTH_MULT = isMobile ? 1.25 : 1.25;
  const API_URL = 'https://crossword-fua4bdbycsgrfwfp.eastus-01.azurewebsites.net/crossword';
  let colnum = 1;

  useEffect(() => {
    const fetchCrossword = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const res = await response.json();
        data["NYT Mini Crossword"] = res;
        console.log("data is ", data);
      } finally {
        setLoading(false);
      }
    };

    fetchCrossword();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {

      if (loading) return;

      const puzzle = data[board];
      setSolution(puzzle.solution);
      setAcross(puzzle.across);
      setDown(puzzle.down);
      setInfo(puzzle);

      setSolution(data[board].solution);
      setSelected([-1, -1]);
      setSameLine([])
      setAcross(data[board].across);
      setDown(data[board].down);
      setInfo(data[board]);
      setGrid(prevGrid => {
      const newGrid = Array.from({ length:  data[board].solution.length }, (_, r) =>
      Array.from({ length: data[board].solution[0].length }, (_, c) => new Square(data[board].solution[r][c] == "*" ? "*" : "", false, false, r, c, -1)));
      colnum = 1;
      let temp = {};
      for (let rows = 0; rows < data[board].solution.length; ++rows) {
        for (let cols = 0; cols < data[board].solution[0].length; ++cols) {
          if (!isObstacle(rows, cols, newGrid) && isObstacle(rows - 1, cols, newGrid) && !isObstacle(rows + 1, cols, newGrid)) {
            temp[rows + "" + cols] = [colnum, "v"];
            colnum++;
          }
          if (!isObstacle(rows, cols, newGrid) && isObstacle(rows, cols - 1, newGrid) && !isObstacle(rows, cols + 1, newGrid)) {
            if (temp[rows + "" + cols]) {
              temp[rows + "" + cols][1] = "vh";
            } else {
              temp[rows + "" + cols] = [colnum, "h"];
              colnum++;
            }
          }
        }
      }

      for (const str in temp) {
        const [num] = temp[str];
        const i = +str[0];
        const j = +str[1];
        newGrid[i][j].cluenum = num;
      }
      setClueNums(temp);
      return newGrid;
    });
  }, [board, loading])


  useEffect(() => {
  const handleKeyDown = (e) => {
    console.log(grid)
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
      setSameLine([])
      setSolved(solved);
      if (mode != "solved") {
        setTimeout(() => {
          setStartAnimation(1);
          setTimeout(() => {
            setStartAnimation(2);
          }, 200);
        }, 1000);
        let period = 0;

        function animate() {
          solvedAnimation(period);
          period = (period + 1) % (100 * Square.numbg);

          const delay = 30 + 200 / (period + 1); // avoid divide by 0
          setTimeout(animate, delay);
        }

        animate(); // start it
      }
    }
  }, [grid, loading, solution])

  function solvedAnimation(frame) {
    setGrid(prevGrid => {
    const newGrid = prevGrid.map(row =>
      row.map(cell => new Square(cell.text, cell.horizontal, cell.vertical, cell.row, cell.col, cell.cluenum, cell.bg))
    );

    // newGrid[0][0].bg = (newGrid[0][0].bg + 1) % Square.numbg; 
    console.log("frame is", frame);
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
      console.log(arr[0], arr[1])
      if (arr[2] == 1 && newGrid[arr[0]][arr[1]].bg == Square.numbg - 1) {
        newGrid[arr[0]][arr[1]].bg = 1;
      } else {
        newGrid[arr[0]][arr[1]].bg = Math.max(newGrid[arr[0]][arr[1]].bg, arr[2]);
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

       


  function isObstacle(r, c, g = grid) {
    if (r < 0 || r >= g.length || c < 0 || c >= g[0].length || g[r][c].text == '*') {
      return 1;
    }
    return 0;
  }

  function clicked(row, col, d) {
    let curdir = dir;
    setShowKeyboard(true);
    if (!d) {
      if (isObstacle(row + 1, col) == 1 && isObstacle(row - 1, col) == 1) {
        curdir = "h";
      } else if (isObstacle(row, col + 1) == 1 && isObstacle(row, col - 1) == 1) {
        curdir = "v";
      } else if (selected[0] == row && selected[1] == col) {
        curdir = dir == "h" ? "v" : "h"
      }
    } else {
      curdir = d;
    }
    setDir(curdir);
    let newsameline = []
    function dfs(r, c, set) {
      if (set.has(r * grid[0].length + c)) {
        return
      }
      set.add(r * grid[0].length + c)
      if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c].text == '*') {
        return;
      }
      newsameline.push([r, c]);
      if (curdir == 'h') {
        dfs(r, c + 1, set);
        dfs(r, c - 1, set);
      } else {
        dfs(r + 1, c, set);
        dfs(r - 1, c, set);
      }
    }
    let s = new Set();
    dfs(row, col, s);
    setSelected([row, col]);
    newsameline.sort()
    setSameLine(newsameline);
    console.log(newsameline);
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
      if (!isObstacle(selected[0] + dr, selected[1] + dc)) {
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

  function restart() {
    // setMode("normal");
    // setSolved(false);
    // clearGrid();
  }

  function shiftDir(newrow, newcol) {
    if (!isObstacle(newrow, newcol)) {
      clicked(newrow, newcol)
    }
  }

  function clearGrid() {
    if (solved) return;
    const result = confirm("Are you sure you want to clear your grid?");
    if (result) {
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
    return selected[0] >= 0 && selected[0] < solution[0].length && selected[1] >= 0 && selected[1] < solution.length;
  }

  function revealCell() {
    if (!inRange()) {
      return;
    }
    const event = { key: solution[selected[0]][selected[1]] };
    moveSelected(event);
  }

  function solveGrid() {
    if (solved) return;
    const result = confirm("Are you sure you want the solution?");
    if (result) {
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

  if (loading || !solution) {
    return (
    <div className={styles.page}>
       <h4 className={styles.title}>Loading today's NYT Mini Crossword...</h4>
    
    </div>);
  }

  
  return (
    <div className={styles.page}
        ref={gridRef}
        tabIndex={0} 
    >
      <div className={styles.navbar}>
        {!isMobile && <h4 className={styles.title} onClick={restart}>{info.title}</h4>}
        <div className={styles.autocheck}>
          <button className={styles.clear} onClick={clearGrid}>Clear</button>
          <button onClick={(e) => {
            if (solved) return;
            setMode(mode != "autocheck" ? "autocheck" : "normal");
          }} className={styles.clear}
          style={{
            backgroundColor: mode == "autocheck" ? "#a7d8ff" : ""
          }}
          >Autocheck</button>
          <button className={styles.clear}onClick={revealCell}>Reveal Cell</button>
          <button className={styles.clear}onClick={solveGrid}>Solution</button>
            {!solved && <select className={styles.select} id="fruit" name="fruit" onChange={(e) => {setBoard(e.target.value);}}>
            <option value="NYT Mini Crossword">NYT Mini Crossword</option>
            <option value="Father's Day 2025">Father's Day 2025</option>
            <option value="Joley's Crossword">Joley's Crossword</option>
          </select>}
        </div>
      </div>
      <div className={styles.container}>
        <div className={styles.rec} style={{
          '--cols': grid[0].length,
          '--width': `${(Math.min(window.innerHeight, window.innerWidth) / (grid.length * WIDTH_MULT)) * grid[0].length}px`,
          '--height': `${(Math.min(window.innerHeight, window.innerWidth) / (grid.length * WIDTH_MULT)) * grid.length}px`,
        }}>
          {grid.map((row, i) => 
            row.map((c, j) => 
              <Cell key={`${i}-${j}-${c.cluenum}`} x={c.col} y={c.row} cluenum={c.cluenum} text={c.text} grid={grid} 
                selected={selected} clicked={clicked} sameline={sameline} shiftDir={shiftDir} dir={dir} expected={solution[i][j]}
                mode={mode} WIDTH_MULT={WIDTH_MULT} moveSelected={moveSelected}/>
            )
          )}
        </div>
        {startanimation > 0 && 
            <div className={styles.winnercontainer}
              style={{
                transform: startanimation != 2 ? '' : 'translateX(0)'
              }}
            >
              <h1 className={styles.winnerText}>You solved the crossword!</h1>
              <h1 className={styles.winnerText}>{info.message}</h1>
            </div>
        }
        <div className={styles.cluecontainer} style={{
          opacity: solved ? '0' : '1',
        }}>
          <div className={styles.col1}>
            {!isMobile && <p style={{marginBottom: 20}}>ACROSS</p>}
            <div>
              {Object.keys(across).map(key => (
                <Clue key={key} num={key} sameline={sameline} grid={grid} direction="h" curdir={dir} clicked={clicked} setDir={setDir} isMobile={isMobile}>{across[key]}</Clue>
              ))}
              </div>
          </div>
          <div className={styles.col2}>
           {!isMobile && <p style={{marginBottom: 20}}>DOWN</p>}
            <div>
              {Object.keys(down).map(key => (
                <Clue key={key} num={key} sameline={sameline} grid={grid} direction="v" curdir={dir} clicked={clicked} setDir={setDir} isMobile={isMobile}>{down[key]}</Clue>
              ))}
              </div>
          </div>
        </div>
      </div>
      {/* Mobile custom keyboard */}
      {isMobile && showKeyboard && (
  <div style={{
    position: 'fixed',
    bottom: 5,
    left: 0,
    width: '100%',
    zIndex: 1000,          // make sure it’s above other elements
    backgroundColor: '#fff', // optional: match page background
  }}>
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
