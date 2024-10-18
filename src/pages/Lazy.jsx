import styles from './App.module.css';
import { Navbar } from '../components/Navbar/Navbar';
import { Lazychess } from '../components/Lazychess/Lazychess';
import {useEffect} from "react";
import {modeData} from '../backend/backend';

function Lazy() {

  useEffect(() => {
    modeData("Lazychess");
  }, []);

  return (
    <div className={styles.App}>
      <Navbar/>
      <Lazychess/>
    </div>
  );
}

export default Lazy;

// npm run dev