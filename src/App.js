import { useState } from 'react';
import './App.css';
import bell from './boxing-bell.mp3';

const sfx = new Audio(bell);
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
  const progress = (total - current) / total * 100;
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
      setRunning(true);
      interval = setInterval(() => {
        setSeconds(seconds => {
          const newSeconds = seconds - 1;
          if (newSeconds < 0) {
            sfx.play();
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
      <div className="progress" style={{height: getProgress(seconds, startTime)}} />
      <div className="time">
        {seconds}
      </div>
      <button onClick={startTimer} className="touchTarget" />
      { !running && (
        <div className="controls">
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
      )}
    </div>
  );
}

export default App;
