import React, { useState, useContext } from 'react';
// import logo from './logo.svg';
import './App.css';
import {createContext} from 'react';


const initData =  createContext(require('./filtered.json'));
// var max = 0;
// let lengthX = Object.keys(initData).length;


const Hint = ()=>{
  return (
    <div>
        <p className='hint'> how to play: </p>
        <p className='hint'> you'll be given a set of 8 to 10 character </p>
        <p className='hint'> so guess any word that include some ~or better~ all of those characters </p>
        <p className='hint'> the game's answer contains only word of length 4 to 10 </p>
        <p className='hint'> longer word, means more point, and  don't guess the word(s) you guessed before </p>  
        <p className='hint'> and when you're burned out, just try another word  </p>  
    </div>      
  )
}

function chooseAWord(initData) {
  let max = Object.keys(initData).length;
  let randomVar = Math.floor(Math.random() * (Math.floor(max) / 2))
  let result = '';
  for (let n in initData) {
    if (initData[n] > 8) {
      if (Math.floor(randomVar / 2) < 10) {
        result = n;
        break;
      } else {
        randomVar = randomVar - Math.floor(Math.random() * 4);
      }
    }
  }
  result = (result.length == 0) ? 'anagram' : result;
  //shuffle
  let shuffle = result.split('');
  for (let i = 0; i < shuffle.length; i++) {
    let rmVar = Math.floor(Math.random() * Math.floor(shuffle.length - 1));
    [shuffle[i], shuffle[rmVar]] = [shuffle[rmVar], shuffle[i]]
  }
  result = shuffle.join('');
  return result;
}

function checkIfItContain(question, answer) {
  // answer = answer.toLowerCase();
  let p = answer.split('');
  // console.log('input =>',p);
  for (let i = 0; i < question.length; i++) {
    // console.log('now it\'s input =>',p,'matching it against', question[i]);
    if (p.length == 0) {      
      // console.log('this should stop');
      break;
    }
    let j = p.indexOf(question[i]);
    // console.log('found at: ', j);
    if (j > -1) {
      // console.log('splicing this one', p[j], 'currently p is at length: ', p.length );
      p.splice(j, 1);
      // console.log('new length: ',p.length, p );
    }
  }
  // console.log('length of p is', p.length, (p.length == 0) ? true : false);
  return (p.length == 0) ? true : false;
}


const Game =  props => {
  const dictionary = useContext(initData);

  const [question, setQuestion] = useState(()=>chooseAWord(dictionary));
  const [score, setScore] = useState(0);
  const [tracker, setTrack] = useState([]);
  const [answer, setAnswer] = useState('');
  const [gameStatus, setStatusG] = useState("write down your answer below, then press ENTER");

  function newGame() {
    setTrack([]);
    setAnswer('');
    setScore(0);
    return chooseAWord(dictionary);
  }

  function pressEnter(e) {
    console.log(e.target.value);
    if (e.key == "Enter") {
      
      if (answer == '') return;
      if (answer.length < 4) {
        setStatusG('the answer contain 4 letter at minimum');
        return;
      }
      if (answer.length > question.length) {
        setStatusG('the answer should not contain more letter than the question');
        return;
      }
      let lowerCaseAnswer= answer.toLowerCase();
      if(!dictionary[lowerCaseAnswer] ){
        setStatusG('that word is not in dictionary');
        return;
      }
      // console.log('checking for these:', question,answer);
      if (checkIfItContain(question, lowerCaseAnswer)) {
        if (tracker.length == 0 ) {
          setTrack([lowerCaseAnswer]);
          setAnswer('');
          setScore(score + dictionary[lowerCaseAnswer]);
          setStatusG("you found the first one... can you find the next one?");
        } else if (!tracker.includes(lowerCaseAnswer)) {
          setTrack([...tracker, lowerCaseAnswer]);
          setScore(score + dictionary[lowerCaseAnswer]);
          setAnswer('');
          setStatusG("you found the next one... can you find the other?");
        } else {
          setStatusG("you've guessed that one... so no score");
        }
      } else {
        setStatusG("the word you've written, has a character or more that aren't in question characters ");
      } 
    }
  }

  // function setHelp (x){
  //   setAnswer(x);
  //   if(answer.length==0){
  //     setStatusG("write down your answer below, then press ENTER");
  //   } else if(answer.length==0){
  //     setStatusG("press ENTER, to have your answer checked");
  //   }
  // }
  // yes https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif
  // nono https://media.giphy.com/media/l1J9COnlFRcnkIn8Q/giphy.gif
  // setQuestion('TEST');
  // question = 'TEST';
  
  return (
    <div>
      <p>find word that contain these letters: </p>
      <p className="question">{question}</p>
      <p className="helper">{gameStatus}</p>      
      <input type= 'text' value={answer} onChange={e=>setAnswer(e.target.value)} onKeyPress={pressEnter}></input>

      <p>your score : {score} </p>
      <button onClick={()=> setQuestion(newGame())}>let me try another one</button>
      {(tracker.length==0)
        ?<Hint/>
        :<Answer track = {tracker}/>}
    </div>
  )
}
const Answer = props => {
  return (
    <div>
      <h3>these are what you've answered</h3>
      <p className="answered"> {props.track.map((x,i)=>(<span>{x} </span>))}
      </p>
    </div>
  )
}
const App = props=> {
   
  const initState = useContext(initData);
  const [wordCount] = useState(()=>Object.keys(initState).length);
  
    return (
      <div className="App">
        <header className="App-header">
   
        <p>{wordCount} words </p>          
        <Game />
        {/* <img src={logo} className="App-logo" alt="logo" />           */}
         </header>
      </div>
    );  
}

export default App;
