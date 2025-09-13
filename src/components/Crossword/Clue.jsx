import React, { useState, useEffect, useRef } from 'react';
import styles from './Clue.module.css';
import { Square } from './Square';


export const Clue = ({num, children, sameline, grid, direction, curdir, setDir, clicked, isMobile}) => {
    if (isMobile && !(sameline[0] && grid[sameline[0][0]][sameline[0][1]].cluenum == num && direction == curdir)) {
        return;
    }
  return (
    <div className={styles.cluerec} 
        style={{
            backgroundColor:`${sameline[0] && grid[sameline[0][0]][sameline[0][1]].cluenum == num && direction == curdir ? "#a7d8ff" : "white"}`,
        }}
        onClick={(e) => {
            console.log("hererere")
            for (let r = 0; r < grid.length; r++) {
                for (let c = 0; c < grid[0].length; c++) {
                    if (grid[r][c].cluenum == num) {
                        clicked(r, c, direction);
                        console.log("setting direction to", direction)
                        setDir(direction);
                    }
                }
            }
        }}
    >
        <div className={styles.numcol}>
            <p className={styles.numcoltext}>{isMobile ? num + (curdir == "h" ? "A" : "D") : num}</p>
        </div>
        <div className={styles.cluecol}>
            <p className={styles.cluetext}>{children}</p>
        </div>
    </div>
  );
};
