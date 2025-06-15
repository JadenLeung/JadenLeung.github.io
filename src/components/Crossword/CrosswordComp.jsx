import React, { useState, useEffect, useRef } from 'react';
import styles from './CrosswordComp.module.css';
import {Cell} from './Cell.jsx';
import {Clue} from './Clue.jsx';
import { Square } from './Square';




export const CrosswordComp = () => {

  let cluenums = {}

  const solution = 
  [
    "RAFAEL",
    "O*O**A",
    "DIR*D*",
    "GITHUB",
    "E*YEAR",
    "R**ELO",
    "*DEL*W",
    "RAZ**N",
    "*D****"
  ]

  const across = {
    1: "Has never broken a racket in his Career",
    3: "Keyword to free malloced memory in C++",
    10: "ls, on Windows",
    11: "Web Application where someone might fork",
    12: "Fiscal ___",
    13: "Jaden has 2000 of this in Rapid",
    14: "__ kids, a terrible website"
  }

  const down = {
    1: "Most Wimbledon wins (as of 2025)",
    2: "Two",
    3: "What Padre means in Spanish",
    4: "COMM's highest stock price, rounded to the tens",
    5: "Teenage slang for something easy",
    6: "High __ boots",
    7: "Consisting of two parts",
    8: "Liga",
    9: "2026 All NBA Second Team, at least",
  }

  const [grid, setGrid] = useState(Array.from({ length: solution.length }, (_, r) =>
    Array.from({ length: solution[0].length }, (_, c) => new Square(solution[r][c] == "*" ? "*" : "", false, false, r, c, -1))
  ));

  const [selected, setSelected] = useState([-1, -1]);
  const [sameline, setSameLine] = useState([]);
  const [dir, setDir] = useState('h');
  const gridRef = useRef(null);

  let colnum = 1;
  for (let cols = 0; cols < solution[0].length; ++cols) {
    for (let rows = 0; rows < solution.length; ++rows) {
      if (!isObstacle(rows, cols) && isObstacle(rows - 1, cols) && !isObstacle(rows + 1, cols)) {
        cluenums[rows + "" + cols] = [colnum, "v"];
        colnum++;
      }
    }
  }
  for (let rows = 0; rows < solution.length; ++rows) {
    for (let cols = 0; cols < solution[0].length; ++cols) {
       if (!isObstacle(rows, cols) && isObstacle(rows, cols - 1) && !isObstacle(rows, cols + 1)) {
        if (cluenums[rows + "" + cols]) {
          cluenums[rows + "" + cols][1] = "vh";
        } else {
          cluenums[rows + "" + cols] = [colnum, "h"];
          colnum++;
        }
      }
    }
  }



       

  useEffect(() => {
    setGrid(prevGrid => {
      const newGrid = prevGrid.map(row =>
        row.map(cell => new Square(cell.text, cell.horizontal, cell.vertical, cell.row, cell.col, cell.cluenum))
      );

      for (const str in cluenums) {
        const [num] = cluenums[str];
        const i = +str[0];
        const j = +str[1];
        newGrid[i][j].cluenum = num;
      }

      console.log("updated grid", newGrid);
      return newGrid;
    });
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (gridRef.current && !gridRef.current.contains(e.target)) {
        setSelected([-1, -1]);
        setSameLine([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  function isObstacle(r, c) {
    if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c].text == '*') {
      return 1;
    }
    return 0;
  }

  function clicked(row, col) {
    let curdir = dir;
    if (isObstacle(row + 1, col) == 1 && isObstacle(row - 1, col) == 1) {
      curdir = "h";
    } else if (isObstacle(row, col + 1) == 1 && isObstacle(row, col - 1) == 1) {
      curdir = "v";
    } else if (selected[0] == row && selected[1] == col) {
      curdir = dir == "h" ? "v" : "h"
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
    }
  }

  function shiftDir(newrow, newcol) {
    if (!isObstacle(newrow, newcol)) {
      clicked(newrow, newcol)
    }
  }




  
  return (
    <div className={styles.page}
        onKeyDown={moveSelected}
        ref={gridRef}
    >
      <h4 className={styles.title}>Father's Day Crossword</h4>
      <div className={styles.rec}>
        {grid.map((row, i) => 
          row.map((c, j) => 
            <Cell key={`${i}-${j}-${c.cluenum}`} x={c.col} y={c.row} cluenum={c.cluenum} text={c.text} setGrid={setGrid} 
              selected={selected} clicked={clicked} sameline={sameline} shiftDir={shiftDir} dir={dir}/>
          )
        )}
      </div>
      <div className={styles.cluecontainer}>
        <div className={styles.col1}>
          <p>ACROSS</p>
          <div style={{marginTop: 20}}>
            {Object.keys(across).map(key => (
              <Clue key={key} num={key} sameline={sameline} grid={grid} direction="h" curdir={dir} clicked={clicked} setDir={setDir}>{across[key]}</Clue>
            ))}
            </div>
        </div>
        <div className={styles.col2}>
          <p>DOWN</p>
          <div style={{marginTop: 20}}>
            {Object.keys(down).map(key => (
              <Clue key={key} num={key} sameline={sameline} grid={grid} direction="v" curdir={dir}>{down[key]}</Clue>
            ))}
            </div>
        </div>
      </div>
    </div>
  );
};
