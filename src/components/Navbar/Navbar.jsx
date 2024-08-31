import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { animateScroll as scroll, scroller } from 'react-scroll';
import styles from "./Navbar.module.css";
import {getImageUrl} from "../../utils";

const projects = [
    {
        name: "AI Plays Chess",
        link: "/aichess",
    },
    {
        name: "Lunar New Year",
        link: "http://lny2023.caal-ma.org/",
    },
    {
        name: "Lazy Chess",
        link: "/lazychess",
    },
    {
        name: "Symptocare",
        link: "https://devpost.com/software/symptocare",
    },
    {
        name: "Wordle",
        link: "https://replit.com/@JadenLeung2/Wordle",
    },
    {
        name: "Global Pilot UI",
        link: "https://devpost.com/software/global-pilot",
    },
    {
        name: "Fruit Tower Defense",
        link: "https://turbowarp.org/412656358/fullscreen",
    }
];

const scrollToSection = (sectionId) => {
    scroller.scrollTo(sectionId, {
      duration: 800,
      delay: 0,
    });
  };


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
            <Link to="/" className={styles.title}>Jaden's Website</Link>
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
                        <Link to="/" onClick={() => scrollToSection('Projects')} className={styles.projects}>Projects</Link></li>
                        <div className={projectOpen || linksOpen ? styles.dropDown2 : styles.dropDownClose}
                            onMouseOver={()=>{
                                setLinksOpen(true);
                            }}
                            onMouseLeave={()=>{
                                setLinksOpen(false);
                            }}>
                            {projects.map((item, id) => {
                                return item.link[0] == '/' ? <Link key={id} className={styles.link} to={item.link} target="_blank">{item.name}</Link> 
                                : <a key={id} href={item.link} target="_blank" className={styles.link}>{item.name}</a>
                            }
                            )}
                        </div>
                    </div>
                    <li key={10}><Link to="/resume" target="_blank">Resume</Link></li>
                    <li key={12}><Link to="/" onClick={() => scrollToSection('Contact')}>Contacts</Link></li>
                </ul>
            </div>
        </nav>
    );
};