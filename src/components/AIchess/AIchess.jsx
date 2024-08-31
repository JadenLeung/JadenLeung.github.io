import React from 'react'
import { getImageUrl } from '../../utils';
import styles from './AIchess.module.css';

export const Chess = () => {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
      <iframe className={styles.iframe} frameborder="0" src="https://itch.io/embed-upload/11346597?color=333333" allowfullscreen="" width="450" height="870"><a href="https://jadenleung.itch.io/ai-chess">Play AI Plays: Chess on itch.io</a></iframe>
      </div>
      <p className={styles.text}>Select between GPT-4o-mini, Gemini, Stockfish 15, Randombot, and yourself to compete in a chess game! <br/>Additionally, you can strengthen both Gemini/GPT by adjusting the stockfish percentage, representing the chance that stockfish takes over Gemini/GPT's moves. </p>   
      <iframe className={styles.miniframe} frameborder="0" src="https://itch.io/embed/2932756" width="552" height="167"><a href="https://jadenleung.itch.io/ai-chess">AI Plays: Chess by JadenLeung</a></iframe>
    </div>
  )
}

