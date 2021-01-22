import React, { useRef, useEffect } from "react";

function Card({ cardFace, cardCode }) {
  const cardRef = useRef();
  useEffect(() => {
    const degrees = Math.floor(20 - (Math.random() * 40 + 1));
    cardRef.current.style.transform = `rotate(${degrees}deg)`;
  }, []);

  return (
    <img src={cardFace} className="playingCard" alt={cardCode} ref={cardRef} />
  );
}

export default Card;
