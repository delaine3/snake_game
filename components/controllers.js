export const start = () => {
    setStart_called(true);
    setGameOver(false);
    setInprogress(true);
  };
  export const pause = () => {
    setPause_called(true);
    setInprogress(false);
  };
  export const resume = () => {
    setPause_called(false);

    setInprogress(true);
  };