import React from 'react';

import styles from "./About.module.css"
import {getImageUrl} from "../../utils";

export const About = () => {
    return (<section className = {styles.container} id="About">
        <h2 className={styles.title}>ABOUT</h2>
        <div className={styles.content}>
            <img className = {styles.bigImage} src={getImageUrl('hero/heroImage.png')} alt="Me sitting with a laptop"/>
            <ul className = {styles.aboutItems}>
                <li className = {styles.aboutItem}>
                    <img src = {getImageUrl('hero/heroImage.png')} 
                        alt = "cursor icon"
                        className = {styles.aboutImage}/>
                    <div className = {styles.aboutItemText}>
                        <h3>Frontend Developr</h3>
                        <p>I'm a frontend developer with many experiences</p>
                    </div>
                </li>
                <li className = {styles.aboutItem}>
                    <img src = {getImageUrl('hero/heroImage.png')} 
                        alt = "Server icon"
                        className = {styles.aboutImage}/>
                    <div className = {styles.aboutItemText}>
                        <h3>Backend Developr</h3>
                        <p>I'm a backend developer with many experiences</p>
                    </div>
                </li>
                <li className = {styles.aboutItem}>
                    <img src = {getImageUrl('hero/heroImage.png')} 
                        alt = "UI icon"
                        className = {styles.aboutImage}/>
                    <div className = {styles.aboutItemText}>
                        <h3>UI Designer</h3>
                        <p>I'm a UI Designer with many experiences</p>
                    </div>
                </li>
            </ul>
        </div>
    </section>);
}