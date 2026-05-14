import styles from './App.module.css';
import CrosswordTitle from '../components/Crossword/CrosswordTitle';

function Crossword() {

  return (
    <div className={styles.App}>
      <CrosswordTitle/>
    </div>
  );
}

export default Crossword;

// npm run dev