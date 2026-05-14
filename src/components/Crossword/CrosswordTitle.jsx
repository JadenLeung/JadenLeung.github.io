import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import styles from './CrosswordTitle.module.css';
import { CrosswordComp } from './CrosswordComp';
import CTitleCard from './CTitleCard';
import { data } from './data';


export default function CrosswordTitle() {
    const [board, setBoard] = useState("Title");
    const { id } = useParams();

    function selectCrossword(c) {
        setBoard(c);
    }

    useEffect(() => {
        let keywordmap = {};
        Object.keys(data).forEach((key) => {
            keywordmap[data[key].keyword] = data[key].title;
        });

        if (id && id in keywordmap) {
            setBoard(keywordmap[id]);
        }
    }, [id]);

    if (board == "Title") {
        return (
            <div className={styles.page}>
                <h1 className={styles.title}>Select a Crossword to Play</h1>
                <div className={styles.cardcontainer}>
                    {
                        data.Order.map(key => (
                            <CTitleCard selectCrossword={selectCrossword} key={key}>{key}</CTitleCard>
                        ))
                    }
                </div>
            </div>
        );
    } else {
        return <CrosswordComp board={board} setBoard={setBoard}/>
    }
}
