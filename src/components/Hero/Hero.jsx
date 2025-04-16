import React from 'react';

import styles from "./Hero.module.css"
import {getImageUrl} from "../../utils";

export const Hero = () => {
    return (<section className = {styles.container}>
        <div className = {styles.content}>
            <h1 className = {styles.title}>Hi, I'm Jaden</h1>
            <p className={styles.description}>I am a sophomore CS Student at the University of Waterloo.</p>
            <a className={styles.contactBtn} href="mailto:j28leung@uwaterloo.ca">Contact me</a>
        </div>
        <img className = {styles.heroImg} src={getImageUrl('hero/jaden.jpeg')} alt="Hero image of me"/>
        <div className={styles.topBlur}/>
        <div className={styles.bottomBlur}/>
    </section>);
}
