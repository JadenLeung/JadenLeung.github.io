import React, { useState, useEffect, useRef } from 'react';
import styles from './Cell.module.css';
import { Square } from './Square';


export const Cell = ({x, y, cluenum, text, grid, selected, clicked, highlighted, shiftDir, dir, expected, mode, WIDTH_MULT, isMobile, initialWidth, initialHeight}) => {
    const inputRef = useRef(null);
    useEffect(() => {
    if (selected[0] == y && selected[1] == x && inputRef.current) {
      inputRef.current.focus();
    }
  }, [selected]); // runs whenever `selected` changes

  // Use the initial viewport size supplied by the parent so layout doesn't change on window resize
  const WIDTH = Math.min(initialHeight, initialWidth) / (Math.max(grid.length, grid[0].length) * WIDTH_MULT);

  return (
    <div className={styles.cellWrapper}>
      <p
        className={styles.rectangle}
        ref={inputRef}
        style={{
          '--font-size': `${WIDTH/3}px`,
          '--bg-color': `${text == "*" ? "black" : (selected[0] == y && selected[1] == x) ? "#ffd902" : (highlighted) ? "#a7d8ff" : Square.colors[grid[y][x].bg % Object.keys(Square.colors).length]}`,
          color: `${text == expected && mode == "autocheck" ? "#2860d7" : mode == "autocheck" ? "red" : "black"}`,
          width: `${WIDTH}px`,
          height: `${WIDTH}px`,
        }}
        onClick={(e) =>
          clicked(y, x)
        }
        onMouseDown={(e) => e.preventDefault()} 
        onTouchStart={(e) => e.preventDefault()}
      >
        {text != "*" ? text : ""}
      </p>
        <p className={styles.text} style={{'--font-size': `${WIDTH/6}px`}}>{cluenum != -1 ? cluenum : ""} </p>
    </div>
  );
};
