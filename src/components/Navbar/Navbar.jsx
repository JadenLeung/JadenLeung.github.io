import React, {useState, useEffect} from 'react';
import styles from "./Navbar.module.css";
import {getImageUrl} from "../../utils";

const projects = [
    {
        name: "Sleepy Chess",
        link: "https://chess.com/",
    },
    {
        name: "Fruit Tower Defense",
        link: "https://turbowarp.org/412656358/fullscreen",
    },
    {
        name: "Wordle",
        link: "https://replit.com/@JadenLeung2/Wordle",
    },

];

export const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [projectOpen, setProjectOpen] = useState(false);
    const [linksOpen, setLinksOpen] = useState(false);

    addEventListener("resize", (event) => {
        if (window.innerWidth >= 830) {
            setMenuOpen(false);
        }
    });

    return (
        <nav className={styles.navbar}>
            <a className={styles.title} href="/">Jaden's Website</a>
            <div className={styles.menu}>
                <img 
                    className =  {menuOpen? styles.menuClose : styles.menuBtn} 
                    src={menuOpen? getImageUrl("nav/closeIcon.png") : getImageUrl("nav/menuIcon.png")} 
                    alt="menu-button"
                    height="50"
                    onClick = {() => {
                        setMenuOpen(!menuOpen);
                    }}
                />
                <ul className={`${styles.menuItems} ${menuOpen && styles.menuOpen}`}
                    onClick={() => setMenuOpen(false)}>
                    <li key={10}><a href={"https://virtual-cube.net/"} target="_blank">Virtual-Cube</a></li>
                    <div className={styles.dropDown}>
                        <li key={1} onMouseOver={()=>{
                            setProjectOpen(true);
                        }}
                        onMouseLeave={()=>{
                            setProjectOpen(false);
                        }}
                        >
                        <a href={"/#Projects"} className={styles.projects}>Projects</a></li>
                        <div className={projectOpen || linksOpen ? styles.dropDown2 : styles.dropDownClose}
                            onMouseOver={()=>{
                                setLinksOpen(true);
                            }}
                            onMouseLeave={()=>{
                                setLinksOpen(false);
                            }}>
                            {projects.map((item, id) => {
                                return <a key={id} href={item.link} target="_blank" className={styles.link}>{item.name}</a>
                            }
                            )}
                        </div>
                    </div>
                    <li key={0}><a href={"/resume"} target="_blank">Resume</a></li>
                    <li key={0}><a href={"#Contact"}>Contacts</a></li>
                </ul>
            </div>
        </nav>
    );
};