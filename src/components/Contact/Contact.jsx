import React from 'react';
import { getImageUrl } from '../../utils';
import styles from "./Contact.module.css";

export const Contact = () => {
  return (
    <footer id="Contact" className={styles.container}>
        <div className={styles.text}>
            <h2>Contact</h2>
            <p>Feel free to reach out!</p>
        </div>
        <ul className={styles.links}>
            <li className={styles.link}>
            <a href ="mailto:j28leung@uwaterloo.ca"><img src={getImageUrl("contact/emailIcon.png")} alt="Email Icon" width="75px" /></a>
                <a href ="mailto:j28leung@uwaterloo.ca">Email</a>
            </li>
            <li className={styles.link}>
                <a href ="https://www.linkedin.com/in/jaden-leung-8117592a8/"><img src={getImageUrl("contact/linkedin.png")} alt="LinkedIn Icon" width="75px"/></a>
                <a href ="https://www.linkedin.com/in/jaden-leung-8117592a8/">LinkedIn</a>
            </li>
            <li className={styles.link}>
                <a href ="https://github.com/JadenLeung"><img src={getImageUrl("contact/github2.png")} alt="GitHub Icon" width="75px"/></a>
                <a href ="https://github.com/JadenLeung">GitHub</a>
            </li>
        </ul>
    </footer>
  );
};
