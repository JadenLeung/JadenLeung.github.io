import styles from './App.module.css';
import { Navbar } from '../components/Navbar/Navbar';
import { Chess } from '../components/AIchess/AIchess';
import {useEffect} from "react";
import {modeData} from '../backend/backend';

function AIchess() {
  useEffect(() => {
    modeData("AIchess");
  }, []);

  return (
    <div className={styles.App}>
      <Navbar/>
      <Chess/>
    </div>
  );
}

export default AIchess;

// npm run dev