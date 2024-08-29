import styles from './App.module.css';
import { Navbar } from '../components/Navbar/Navbar';
import { Chess } from '../components/AIchess/AIchess';

function AIchess() {


  return (
    <div className={styles.App}>
      <Navbar/>
      <Chess/>
    </div>
  );
}

export default AIchess;

// npm run dev