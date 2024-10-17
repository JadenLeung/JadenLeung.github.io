import styles from './App.module.css';
import { About } from '../components/About/About';
import { Contact } from '../components/Contact/Contact';
import { Experience } from '../components/Experience/Experience';
import { Hero } from '../components/Hero/Hero';
import { Navbar } from '../components/Navbar/Navbar';
import { Projects } from '../components/Projects/Projects';
import {useEffect} from "react";

async function getIP() {
	try {
		const response = await fetch('https://api.ipify.org?format=json');
		const data = await response.json();
		return data.ip;
	} catch (error) {
		console.error("Error fetching IP:", error);
		return "unknown";
	}
}

function getDate () {
  // Get the current date and time
  const now = new Date();

  // Format the date and time for the Eastern Time Zone
  const options = { timeZone: 'America/New_York', hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
  const formatter = new Intl.DateTimeFormat('en-US', options);
  const formattedDate = formatter.format(now);

  console.log(formattedDate);  // Output: MM/DD/YYYY, HH:MM:SS

return formattedDate;
}

async function modeData(mode) {
  const IP = await getIP();
  const TIME = getDate();
  // console.log("IP is", IP, "TIME is", TIME);
  fetch("https://elephant4.azurewebsites.net/api/history2", {
    method: "POST",
    body: JSON.stringify([{
      ipaddr: IP,
      mode: mode,
      time: TIME
    }]),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  })
    .then((response) => console.log(response));
}

function App() {
  useEffect(() => {
    modeData("Personal");
  }, []);

  return (
    <div className={styles.App}>
      <Navbar/>
      <Hero/>
      {/*<About/>*/}
      <Experience/>
      <Projects/>
      <Contact/>
    </div>
  );
}

export default App;

// npm run dev