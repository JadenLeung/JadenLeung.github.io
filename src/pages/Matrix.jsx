import styles from './App.module.css';
import { Navbar } from '../components/Navbar/Navbar';
import { MatrixComp } from '../components/MatrixComp/MatrixComp';

function Matrix() {

  return (
    <div className={styles.App}>
      <MatrixComp/>
    </div>
  );
}

export default Matrix;

// npm run dev