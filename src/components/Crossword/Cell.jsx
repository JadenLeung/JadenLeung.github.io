import React, { useState, useEffect, useRef } from 'react';
import styles from './Cell.module.css';
import { Square } from './Square';


export const Cell = ({x, y, cluenum, text, setGrid, selected, clicked, sameline, shiftDir, dir}) => {
    const inputRef = useRef(null);
    useEffect(() => {
    if (selected[0] == y && selected[1] == x && inputRef.current) {
      inputRef.current.focus();
    }
  }, [selected]); // runs whenever `selected` changes
  const MARGIN = 15;
  const WIDTH = window.innerHeight / 12;

  function changeText(retext) {
    setGrid(prevGrid => {
        console.log("herere")
        const newGrid = prevGrid.map(row =>
            row.map(cell => new Square(cell.text, cell.horizontal, cell.vertical, cell.row, cell.col, cell.cluenum))
        );
        let typed = retext.replace(text, "");
        if (('A' <= typed && typed <= 'Z' || 'a' <= typed && typed <= 'z' || typed == '')) {
            newGrid[y][x].text = typed.toUpperCase();
            if (typed.length == 1) {
                if (dir == "h") shiftDir(y, x + 1); else shiftDir(y + 1, x);
            } else if (text == "") {
                if (dir == "h") shiftDir(y, x - 1); else shiftDir(y - 1, x);
            }
        }
        return newGrid;
    });
  }

  return (
    <div>
    <p className={styles.text} style={{
        '--posx2': `${x * WIDTH + MARGIN}px`,
        '--posy2': `${y * WIDTH + MARGIN}px`,
      }}>{cluenum != -1 ? cluenum : ""}
    </p>


    <input
      className={styles.rectangle}
       ref={inputRef}
      style={{
        '--posx': `${x * WIDTH + MARGIN}px`,
        '--posy': `${y * WIDTH + MARGIN}px`,
        '--bg-color': `${text == "*" ? "black" : (selected[0] == y && selected[1] == x) ? "#ffd902" : (sameline.some(n => n[0] == y && n[1] == x)) ? "#a7d8ff" : "white"}`,
        width: `${WIDTH}px`,
        height: `${WIDTH}px`,
      }}
      value={text != "*" ? text : ""}
      onClick={(e) =>
        clicked(y, x)
      }
      onKeyDown={(e) => {
        if (e.key === 'Backspace') {
            changeText("");
        }
      }}
      onMouseDown={(e) => e.preventDefault()} 
        onChange={(e) => changeText(e.target.value)}
    />
    </div>
  );
};
