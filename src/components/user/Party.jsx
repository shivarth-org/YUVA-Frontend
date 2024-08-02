import React from "react";
import Confetti from "react-confetti";

const Party = () => {
  const width = window.screen.width;
  const height = window.screen.height;
  return (
    <Confetti
      width={width}
      height={height}
      numberOfPieces={200}
      gravity={0.2}
    />
  );
};

export default Party;
