import styles from './App.module.css';
import { About } from '../components/About/About';
import { Contact } from '../components/Contact/Contact';
import { Experience } from '../components/Experience/Experience';
import { Hero } from '../components/Hero/Hero';
import { Navbar } from '../components/Navbar/Navbar';
import { Projects } from '../components/Projects/Projects';
import { ResumePDF } from '../components/ResumePDF/ResumePDF';

function Resume() {


  return (
    <div className={styles.App}>
      <Navbar/>
      <ResumePDF/>
    </div>
  );
}

export default Resume;

// npm run dev