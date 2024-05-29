import React from 'react';
import styles from "./Projects.module.css";
import projects from "../../data/projects.json";
import { ProjectCard } from './ProjectCard';

export const Projects = () => {
  return (
    <section className={styles.container} id="Projects">
        <h2 className={styles.title}>Featured Projects</h2>
        <div className={styles.projects}>{
            projects.map((project, id) => {
                return <div key = {id}><ProjectCard project={project}></ProjectCard></div>;
            })
            }
        </div>
    </section>
  );
};