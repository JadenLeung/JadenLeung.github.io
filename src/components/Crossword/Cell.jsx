import React, { useState, useEffect, useRef } from 'react';
import styles from './Cell.module.css';
import { Square } from './Square';


export const Cell = ({x, y, cluenum, text, grid, selected, clicked, sameline, shiftDir, dir, expected, mode}) => {
    const inputRef = useRef(null);
    useEffect(() => {
    if (selected[0] == y && selected[1] == x && inputRef.current) {
      inputRef.current.focus();
    }
  }, [selected]); // runs whenever `selected` changes
  const MARGIN = 15;
  const WIDTH = window.innerHeight / (grid.length * 1.25);

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
        '--bg-color': `${text == "*" ? "black" : (selected[0] == y && selected[1] == x) ? "#ffd902" : (sameline.some(n => n[0] == y && n[1] == x)) ? "#a7d8ff" : Square.colors[grid[y][x].bg % Object.keys(Square.colors).length]}`,
        color: `${text == expected && mode == "autocheck" ? "#2860d7" : mode == "autocheck" ? "red" : "black"}`,
        width: `${WIDTH}px`,
        height: `${WIDTH}px`,
      }}
      value={text != "*" ? text : ""}
      onClick={(e) =>
        clicked(y, x)
      }
      onMouseDown={(e) => e.preventDefault()} 
    />
    </div>
  );
};
