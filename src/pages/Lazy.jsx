import styles from './App.module.css';
import { Navbar } from '../components/Navbar/Navbar';
import { Lazychess } from '../components/Lazychess/Lazychess';

function Lazy() {


  return (
    <div className={styles.App}>
      <Navbar/>
      <Lazychess/>
    </div>
  );
}

export default Lazy;

// npm run dev