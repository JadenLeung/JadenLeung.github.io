import React from 'react';
import styles from './CTitleCard.module.css';
import { getImageUrl } from '../../utils';

export default function CTitleCard({ selectCrossword, children, src }) {
    console.log(src)
    return (
        <div className={styles.titlecontainer}>
            <button
                className={styles.cardButton}
                onClick={() => selectCrossword(children)}
            >
                <img src={getImageUrl(`crossword/${src}`)} className={styles.cImage}/>
                {children}
            </button>
        </div>
    );
}