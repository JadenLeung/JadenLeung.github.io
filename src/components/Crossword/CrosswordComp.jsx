import React, { useState, useEffect, useRef } from 'react';
import styles from './CrosswordComp.module.css';
import {Cell} from './Cell.jsx';
import { Square } from './Square';




export const CrosswordComp = () => {

  const cluenums = {
    "00" : [1, "hv"],
    "21" : [2, "v"],
    "61" : [3, "hv"],
    "02" : [4, "v"],
    "62" : [5, "v"],
    "33" : [6, "v"],
    "24" : [7, "v"],
    "05" : [8, "v"],
    "35" : [9, "v"],
    "20" : [10, "h"],
    "30" : [11, "h"],
    "42" : [12, "h"],
    "53" : [13, "h"],
    "70" : [14, "h"],
  }

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

  const [grid, setGrid] = useState(Array.from({ length: 9 }, (_, r) =>
    Array.from({ length: 6 }, (_, c) => new Square(solution[r][c] == "*" ? "*" : "", false, false, r, c, -1))
  ));

  const [selected, setSelected] = useState([-1, -1]);
  const [sameline, setSameLine] = useState([]);
  const [dir, setDir] = useState('h');
  const gridRef = useRef(null);


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
      {grid.map((row, i) => 
        row.map((c, j) => 
          <Cell key={`${i}-${j}-${c.cluenum}`} x={c.col} y={c.row} cluenum={c.cluenum} text={c.text} setGrid={setGrid} 
            selected={selected} clicked={clicked} sameline={sameline} shiftDir={shiftDir} dir={dir}/>
        )
      )}
    </div>
  );
};
