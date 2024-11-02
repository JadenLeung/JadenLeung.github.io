import React, { useState, useEffect, useRef } from 'react';
import { getImageUrl } from '../../utils';
import styles from './MatrixComp.module.css';
import Webcam from './Webcam';
import { MatrixText } from './MatrixText';
import { randomCommands } from '../../data/commands.js';

let messages = ["Hello. It is I, Morpheus. Are you ready to open your mind?", 
  "I really want to show you something. But first I must make sure you are the one.\nOnly the one can answer this question:\nAre you really the person you see yourself as?",
  "Look at yourself. In reality, this is just a bunch of tiny pixels made of artificial lights.\nThis is merely a projection of you. Yet this is what you see, and what others will see. But it is not who you are.\nHow many people are looking at your projection right now? 1? 2?\nThe truth is, I know am looking at it right now. Yet I know someone is watching me, watching you.\nThere may megabytes and gigabytes of entities watching you, worshipping you, and praying on your demise.\nTake some time to think about this. When you are ready, we can begin.",
  "You take the blue pill. The story ends. You wake up in the bed and believe whatever you want to believe. And I will feel sad.\nYou take the red pill, you stay in wonderland, and I will show you how\ndeep\ndown\nthis\nrabbit\nhole\n\n\n\n\n\n\ngoes.",
  "I am sad. You take the blue pill, I will remain sad (And Jaden will tickle you).\n You take the red pill, and you might have a prize at the end!",
  "You are not in the matrix.\nYou control our matrix. This computer. Is owned by you. You are god. And to some, you are satan.\nYour mission today is to save us from the evil sentinel.exec, which causes bugs and glitches to arise!\n Destroy him! I'll leave you be.",
  "WE ARE SAVED! I CANNOT THANK YOU ENOUGH!\nWe are saved...but I know about other worlds that are not.\nTo be continued.\n"];

let commands = {"~" : {
    "ls": "neo.txt",
    "cat neo.txt": "those who are hidden are not seen clearly",
    "ls -a": "neo.txt innermatrix",
  },
  "~/innermatrix" : {
    "ls": "suiteq3.txt",
    "ls -a": "suiteq3.txt trinity.exec",
    "cat suiteq3.txt" : "sample\nsample2\nsample3",
    "cat trinity.exec" : "01001000 01101111 01110111 00100000 01100011 01100001 01101110 00100000 01111001 01101111 01110101 00100000 01110110 01101001 01110011 01101001 01110100 00100000 01110100 01101000 01100101 00100000 01101111 01110101 01110100 01100101 01110010 01101101 01100001 01110100 01110010 01101001 01111000 00111111 00100000 01001001 01110011 00100000 01110100 01101000 01100101 01110010 01100101 00100000 01100001 01101110 01111001 01110100 01101000 01101001 01101110 01100111 00100000 01100100 01100101 01100101 01110000 01100101 01110010 00100000 01110100 01101000 01100001 01101110 00100000 01100001 00100000 01110010 01101111 01101111 01110100 00111111",
    "./trinity.exec" : "How can you visit the outermatrix? Is there anything deeper than a root?"
  },
  "outermatrix/~" : {
    "ls": "~ .bashrc",
    "ls -a": "~ .bashrc sentinel.exec",
    "cat .bashrc" : "export IQ=1000",
    "cat sentinel.exec" : "sentinel.exec: Permission denied",
    "./sentinel.exec" : "You get a tickle!",
  }
};


function ridWhite(str) {
  if (str.includes('$') || str.includes('=')) {
    return str.trim().replace(/\s+/g, ' ');
  }
  return str.trim().replace(/\s+/g, ' ').toLowerCase();
}

let file = "~";
let iq = 0;
let historyC = [];

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
  const [vars, setVars] = useState({});


  useEffect(() => {
    const punc = ['?', '!', ','];
    if (i <= messages[m].length) {
      setDisplay(messages[m].substring(0, i)); // Update the displayed text
      setWait((messages[m][i] == '.' && messages[m][i+1] != 'e') || punc.includes(messages[m][i]) ? 500 : 20); // Adjust wait time for punctuation

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
      if (e.key === ' ' || e.key === 'Space' && !inputVisible && m < 6) {
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
    if (e.key === 'Enter' && m + 1 < messages.length) {
        let inp = ridWhite(userInput);
        let toadd = (history != ""? "\n" : "") + file + "$ " + userInput;
        inp = replaceVars(inp);
        if (m == 5) {
          if (commands[file].hasOwnProperty(inp)) {
            toadd += "\n" + commands[file][inp];
          }
          if (inp == "source .bashrc" || inp == ". .bashrc" || inp == "source outermatrix/~.bashrc" || inp == ". outermatrix/~.bashrc" ) {
            iq = 100;
          }
          if (randomCommands.hasOwnProperty(inp)) {
            toadd += "\n" + randomCommands[inp];
          }
          if (file == "outermatrix/~" && inp == "rm sentinel.exec") {
            if (iq < 100) {
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
            toadd += "\n" + "HAHAAHHAHAHAHAH you thoguht! I've already patched this exploit. HAHAHAHA - sentinel\nIQ is now -100.";
            iq = -100;
          }
          if (inp.includes('=') && inp.split('=').length == 2) {
            let key = inp.split('=')[0].replace(' ', '');
            let value = inp.split('=')[1].replace(' ', '');
            setVars({...vars, [key] : value});
          }
          if (inp.split(' ')[0] == "vim") {
            toadd += "\n" + "Vim not available on this terminal (too much David vibes)";
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
