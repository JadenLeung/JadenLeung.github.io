import React, { useState, useEffect, useRef } from 'react';
import { getImageUrl } from '../../utils';
import styles from './MatrixComp.module.css';
import Webcam from './Webcam';
import { MatrixText } from './MatrixText';
import { randomCommands, messages, commands, filesystem } from '../../data/commands.js';


function ridWhite(str, keepcase = false) {
  if (str.includes('$') || str.includes('=') || keepcase) {
    return str.trim().replace(/\s+/g, ' ');
  }
  return str.trim().replace(/\s+/g, ' ').toLowerCase();
}



function autoComplete(str) {
  let tempstr = str;
  let arr = filesystem[file];
  let ans = "";
  let i = str.lastIndexOf("/");
  let before = "";
  if (i != -1) {
    before = str.substring(0, i+1);
    str = str.substring(i + 1);
    console.log(str);
  }
  if (str == "") return before + ans;
  arr.forEach((s) => {
    console.log(s, i);
    if (s.substring(0, str.length) == str) {
      ans = s;
    }
  })
  return ans == "" ? "" : before + ans;
}

let file = "~";
let historyC = [];
console.log(31);

export const MatrixComp = () => {
  const [display, setDisplay] = useState("");
  const [history, setHistory] = useState("");
  // const [m, setM] = useState(6);
  // const [i, setI] = useState(messages[m].length);
  const [m, setM] = useState(0);  
  const [i, setI] = useState(0);
  const [cursor, setCursor] = useState(historyC.length);
  const [wait, setWait] = useState(50);
  const [inputVisible, setInputVisible] = useState(false);
  const [userInput, setUserInput] = useState("");
  const inputRef = useRef(null);
  const [vars, setVars] = useState({IQ : 0});
  const audioRef = useRef(new Audio(getImageUrl("matrix/win.mp3")));

  const [playing, setPlaying] = useState(false);
  const audioContextRef = React.useRef(null); // Store AudioContext as ref to persist it

  useEffect(() => {
    // Create an AudioContext only once
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    return () => audioContextRef.current.close(); // Clean up AudioContext on component unmount
  }, []);

  const playANote = () => {
    if(inputVisible || m == 0 || (m == 6 && i  >= messages[m].length)) return;
    if (playing) return; // If a sound is already playing, do nothing
    setPlaying(true); 

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();
    oscillator.frequency.setValueAtTime(m == 1 || m == 6 ? 391 : Math.floor(Math.random() * (100)) + (m == 3 && i > 200? (i < 230 ? 100: 10) : 250), audioContextRef.current.currentTime); // A note (440 Hz)
    oscillator.type = 'triangle';

    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);

    gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime); // Adjust volume
    oscillator.start();

    setTimeout(() => {
      oscillator.stop();
      setPlaying(false); // Allow new sound to play
    }, 80); // Play for 0.5 seconds
  };

  useEffect(() => {
    if (m == 6 && i >= messages[m].length) {
      audioRef.current.play();
    }
  },[m, i])

  useEffect(() => {
    const punc = ['?', '!', ','];
    if (i <= messages[m].length) {
      setDisplay(messages[m].substring(0, i)); // Update the displayed text
      setWait((messages[m][i] == '.' && messages[m][i+1] != 'e') || punc.includes(messages[m][i]) ? 500 : 20); // Adjust wait time for punctuation
      playANote();
      const timeout = setTimeout(() => {
        setI(i + 1); // Increment index after the specified wait
      }, wait);

      return () => clearTimeout(timeout); // Cleanup timeout on unmount or re-render
    } else if (m < 6) {
      setInputVisible(true); // Show input field after message is complete
    }
  }, [i, messages[m]]);


  useEffect(() => {
    if (inputVisible && inputRef.current) {
      inputRef.current.focus(); 
    }
  }, [inputVisible]);

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  function replaceVars(str) {
    let arr = str.split(' ');
    arr = arr.map((s) => {
      return s[0] == '$' && vars.hasOwnProperty(s.substring(1)) ? vars[s.substring(1)] : s[0] == '$' ? "" : s;
    })
    return arr.join(' ');
  }

  useEffect(() => {
    const handleKeyPress = (e) => {
      inputRef.current?.scrollIntoView();
      if ((e.key === ' ' || e.key === 'Space') && i < messages[m].length) {
        setI(messages[m].length);
      }
    };
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [m]);

    const handleDivClick = (e) => {
      if (inputRef.current) {
        inputRef.current.focus(); // Focus on the input when the div is clicked
    }
  }

  const handleKeyDown = (e) => {
    if (!e.key.includes("Arrow"))
      playANote();
    if (e.key === 'Enter' && m + 1 < messages.length) {
        let inp = ridWhite(userInput);
        let toadd = (history != ""? "\n" : "") + file + "$ " + userInput;
        inp = replaceVars(inp);
        if (m == 5) {
          if (commands[file].hasOwnProperty(inp)) {
            toadd += "\n" + commands[file][inp];
          }
          if (inp == "source .bashrc" || inp == ". .bashrc" || inp == "source outermatrix/~.bashrc" || inp == ". outermatrix/~.bashrc" ) {
            setVars({...vars, IQ:100});
          }
          if (inp == "make" && file == "~/innermatrix") {
            console.log(filesystem)
            if (!filesystem["~/innermatrix"].includes("trinity.exec")) {
              commands["~/innermatrix"]["./trinity.exec"] = "How can you visit the outermatrix? Is there anything deeper than a root?";
              commands["~/innermatrix"]["ls"] += " trinity.exec";
              commands["~/innermatrix"]["ls -a"] += " trinity.exec";
              filesystem["~/innermatrix"].push("trinity.exec");
              commands["~/innermatrix"]["ls -al"] += "\n-r-xr-xr-x@ trinity.exec";
              commands["~/innermatrix"]["cat trinity.exec"] = "Hehe no way ur trying to print out an executable :)";
            } 
            toadd+= "\ncreated trinity.exec";
            console.log(commands);
          }
          if (randomCommands.hasOwnProperty(inp)) {
            toadd += "\n" + randomCommands[inp];
          }
          if (file == "outermatrix/~" && inp == "rm sentinel.exec") {
            if (vars["IQ"] < 100) {
              toadd += "\nyour IQ is too low to remove me! Proof: do command [echo $IQ]";
            } else if (!vars.hasOwnProperty("one") || vars["one"] != "true") {
              if (vars.hasOwnProperty("one")) {
                toadd += "\nEverything in this world is a boolean.\nEither you are kind, or not\nEither you are sinful, or not\nEither you are the one, or you are not.";
              } else {
                toadd += "\nSorry, you are not the one. You thought all this time you were, right? Well, too bad.\nYOU ARE NOT THE $one";
              }
            } else {
              setInputVisible(false);
              setM(m + 1);
              setI(0);
              setUserInput("");
            }
          }
          if (inp.includes('=') && inp.split('=')[0].replace(' ', '') == "IQ") {
            toadd += "\n" + "HAHAAHHAHAHAHAH you thought! I've already patched this exploit. (A trusty source told me you'd do this) HAHAHAHA - sentinel\nIQ is now -100.";
            setVars({...vars, IQ : -100});
          } else if (inp.includes('=') && inp.split('=').length == 2) {
            let key = inp.split('=')[0].replace(' ', '');
            let value = inp.split('=')[1].replace(' ', '');
            setVars({...vars, [key] : value});
          }
          const editors = ["nano", "vi", "vim"];
          if (editors.includes(inp.split(' ')[0])) {
            toadd += "\n" + inp.split(' ')[0] + " is not available on this terminal (too much David vibes)";
          }
          const actions = ["touch", "mkdir"];
          if (actions.includes(inp.split(' ')[0])) {
            toadd += "\nPermission denied. You actually thought!";
          }
          if (inp.split(' ')[0] == "echo" && inp.split(' ').length > 1 && ridWhite(inp.split(' ')[1]) != "") {
              toadd += "\n" + inp.substring(5);
          }
          if (inp == "cd ~/innermatrix" || file == "~" && inp == "cd innermatrix") {
              file = "~/innermatrix";
          } else if (inp == "cd ~" || file == "~/innermatrix" && (inp == "cd ..")) {
            file = "~";
          } else if (inp == "cd outermatrix/~" || file == "~" && inp == "cd .." ) {
            file = "outermatrix/~";
          }
          if (inp == "pwd") {
            toadd += "\n" + file;
          }
          if (historyC.length > 0) {
            historyC.push(userInput); 
          } else {
            historyC[0] = userInput;
          }
          if (inp == "clear") {
            setHistory("");
          } else {
            setHistory(history + toadd);
          }
          setUserInput("");
        } else if (m == 3 || m == 4) {
          if (userInput.toLowerCase().includes("blue")) {
            setInputVisible(false);
            setM(4);
            setI(0);
            setUserInput("");
          } else if (userInput.toLowerCase().includes("red")) {
            setInputVisible(false);
            setM(5);
            setI(0);
            setUserInput("");
          } else {
            setUserInput("");
          }

        } else {
          setInputVisible(false);
          setM(m + 1);
          setI(0);
          setUserInput("");
        }
    }
    if (e.key == 'Tab') {
      e.preventDefault();
      let inp = ridWhite(userInput, true);
      let arr = inp.split(' ');
      if (userInput && m == 5 && arr.length > 0) {
        let s = autoComplete(arr[arr.length - 1]);
        if (s != "") {
          arr[arr.length - 1] = s;
          setUserInput(arr.join(' '));
        }
      }
    }
    if (e.key == 'ArrowUp') {
      e.preventDefault();
      if (historyC.length > 0 && cursor > 0) {
        let c = cursor - 1;
        setUserInput(historyC[c]);
        inputRef.current.setSelectionRange(historyC[c].length, historyC[c].length);
        setCursor(cursor-1);
      }
    } else if (e.key == 'ArrowDown') {
      e.preventDefault();
      if (cursor < historyC.length - 1) {
        let c = cursor + 1;
        setUserInput(historyC[c]);
        inputRef.current.setSelectionRange(historyC[c].length, historyC[c].length);
        setCursor(cursor+1);
      } else {
        setCursor(historyC.length);
        setUserInput("");
      }
    } else {
      if (e.key != 'ArrowLeft' && e.key != 'ArrowRight')
        setCursor(historyC.length);
    }
  };

  return (
    <div className={styles.page} onClick={handleDivClick} >
      {m == 2 && <Webcam />}
      <p className={styles.text}>{display}</p>
      {m == 5 && inputVisible && <p className={styles.text}>{history}</p>}
      <div className={styles.container}>
       {inputVisible && <p className={styles.text}>{file + "$"}&nbsp;</p>}
       {inputVisible &&
          <input
            type="text"
            ref={inputRef}
            value={userInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className={styles.matrixInput}
            style={{ fontSize: '15.6px' }} // Change font size directly
          />
        } 
      </div>
      {m == 6 && i >= messages[m].length && <MatrixText />}
    </div>
  );
};
