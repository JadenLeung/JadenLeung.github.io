import React from 'react'
import { getImageUrl } from '../../utils';
import styles from './Lazychess.module.css';

export const Lazychess = () => {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
      <iframe className={styles.iframe} frameborder="0" src="https://itch.io/embed-upload/11330715?color=333333" allowfullscreen="" width="450" height="870"><a href="https://jadenleung.itch.io/lazy-chess">Play Lazy Chess on itch.io</a></iframe>
      </div>
      <p className={styles.text}>In Lazy Chess, you represent the white pieces and are trying to capture the black king! <br/> <br/>Black pieces are lazy, which means they won't move unless it detects a white piece in range. Advance past the enemy pieces in the fewest moves or the lowest pawn budget possible. There will be sacrifices and tactics! This game will help you improve your chess puzzle skills.</p>   
      <iframe className={styles.miniframe} frameborder="0" src="https://itch.io/embed/2928549" width="552" height="167"><a href="https://jadenleung.itch.io/lazy-chess">Lazy Chess by JadenLeung</a></iframe>
    </div>
  )
}

