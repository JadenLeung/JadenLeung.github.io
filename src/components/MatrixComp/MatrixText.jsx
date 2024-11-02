import React, { useState, useEffect, useRef } from 'react';
import { getImageUrl } from '../../utils';
import styles from './MatrixComp.module.css';


export const MatrixText = () => {
  const [text, setText] = useState('nopersnopers');
  const [length, setLength] = useState(6);
  useEffect(() => {
    let newtext = "";
    const timeout = setTimeout(() => {
        for (let i = 0; i < length; i++) {
            if (i % 150 == 0) {
                newtext += "\n";
            }
            newtext += String.fromCharCode((Math.floor(Math.random() * (126 - 32 + 1)) + 32));
        }
        setText(newtext);
        if (length < 1500) {
            setLength(length + ((length / 150) + 1) * 5);
        } else if (length < 5000)  {
            setLength(length + 150);
        }
    }, 50);
    return () => clearTimeout(timeout);
  }, [text]);
  
  return (
      <p className={styles.text}>{text}</p>
  );
};
