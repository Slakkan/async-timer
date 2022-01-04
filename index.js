// A map of all timers with their respective stop function
const activeTimers = new Map();

const registerTimer = (id, reject) => {
  // The stop function, when called, will reject the promise stopping the timer
  // and remove this timer from the activeTimers Map
  const stop = () => {
    reject();
    unregisterTimer(id);
  };
  // We add the timer to the Map
  activeTimers.set(id, stop);
};

const unregisterTimer = (id) => {
  // We remove the timer with identifider id from the Map
  // Note that we don't need error handling as the timer with identifier id will always exist in the Map at this time. 
  // I leave the exercise for the viewer.
  activeTimers.delete(id);
};

const getTimer = (ms = 0) => {
  // we give this timer a unique identifier
  const id = uid.uid();
  const timer = new Promise((resolve, reject) => {
    // we register this timer to the list of active timers
    registerTimer(id, reject);
    //
    setTimeout(() => {
      // when the time is up we unregister it and resolve the promise
      unregisterTimer(id);
      resolve();
    }, ms);
  });
  // we get the stop function for the identifier id from the activeTimers Map
  const stop = activeTimers.get(id);
  return [timer, stop];
};

// Usage example
const [timerOne, stopTimerOne] = getTimer(1000);
const [timerTwo, stopTimertwo] = getTimer(2000);

const timerOneFunction = async () => {
  await timerOne;
  stopTimertwo();
  return "timerOne has finished";
};

const timerTwoFunction = async () => {
  await timerTwo;
  return "timerTwo has finished";
};

const timerStopped = () => console.log("A timer was stopped before finishing");

timerOneFunction().then(console.log).catch(timerStopped);

timerTwoFunction().then(console.log).catch(timerStopped);
