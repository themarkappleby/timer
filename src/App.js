import { useState } from 'react';
import './App.css';
import bell from './boxing-bell.mp3';

const sfx = new Audio();
sfx.autoplay = true;
const TWEAK = 5;
let interval = null;

async function preventScreenDim () {
  if ('wakeLock' in navigator) {
    let wakeLock = null;
    try {
      wakeLock = await navigator.wakeLock.request('screen');
    } catch (err) {
      console.log(err);
    }
  }
}
preventScreenDim();

const getProgress = (current, total) => {
  const progress = (current - 1) / ( total - 1) * 100;
  return `${progress}%`;
}

function App() {
  const [startTime, setStartTime] = useState(60);
  const [seconds, setSeconds] = useState(startTime);
  const [running, setRunning] = useState(false);

  const startTimer = () => {
    if (running) {
      setRunning(false);
      setSeconds(startTime);
      clearInterval(interval);
    } else {
      // ref: https://stackoverflow.com/a/57547943/918060
      sfx.src = 'data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyMzUAVFNTRQAAAA8AAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
      setRunning(true);
      interval = setInterval(() => {
        setSeconds(seconds => {
          const newSeconds = seconds - 1;
          if (newSeconds === 0) {
            sfx.src = bell;
          } else if (newSeconds < 0) {
            setRunning(false);
            setSeconds(startTime);
            clearInterval(interval);
            return 0;
          }
          return newSeconds;
        });
      }, 1000);
    }
  }

  return (
    <div className="app">
      <div className="container" style={{gap: running ? '0' : '2px'}}>
        <div className="time" onClick={startTimer}>
          { running && (
            <div className="progress" style={{height: getProgress(seconds, startTime)}} />
          )}
          <span>{seconds}</span>
        </div>
        <div className="controls" style={{height: running ? '0%' : '50%'}}>
          <button onClick={() => {
            if (startTime > 5) {
              setSeconds(startTime - TWEAK)
              setStartTime(startTime - TWEAK)
            }
          }}>-</button>
          <button onClick={() => {
            setSeconds(startTime + TWEAK)
            setStartTime(startTime + TWEAK)
          }}>+</button>
        </div>
      </div>
    </div>
  );
}

export default App;
