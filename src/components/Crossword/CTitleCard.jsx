import React from 'react'
import styles from './CTitleCard.module.css';
import {data} from './data';

export default function CTitleCard({selectCrossword, children}) {
  return (
    <div className={styles.titlecontainer}>
        <button onClick={() => selectCrossword(children)}>{children}</button>
    </div>
  )
}
