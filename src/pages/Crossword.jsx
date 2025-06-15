import styles from './App.module.css';
import { CrosswordComp } from '../components/Crossword/CrosswordComp';

function Crossword() {

  return (
    <div className={styles.App}>
      <CrosswordComp/>
    </div>
  );
}

export default Crossword;

// npm run dev