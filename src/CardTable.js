import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./CardTable.css";
import Card from "./Card";
import _ from "lodash";

function CardTable() {
  const [pile, setPile] = useState([]);
  const [autoDrawToggle, setAutoDrawToggle] = useState(false);
  const [deck, setDeck] = useState(null);
  const autoDraw = useRef();

  useEffect(() => {
    // Requests a deck and assigns it the deck state when the component renders
    async function newDeck() {
      let newDeck = await axios.get(
        "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
      );
      setDeck(newDeck.data.deck_id);
    }
    newDeck();
  }, []);

  useEffect(() => {
    autoDraw.current = setInterval(() => {
      async function requestCard() {
        let response = await axios.get(
          `https://deckofcardsapi.com/api/deck/${deck}/draw`
        );
        if (response.data.error) {
          alert("Error: No cards remaining!");
          setAutoDrawToggle(!autoDrawToggle);
        } else {
          let pileCopy = _.cloneDeep(pile);
          let card = response.data.cards[0];
          pileCopy.push(card);
          setPile(pileCopy);
        }
      }

      if (autoDrawToggle) {
        requestCard();
      }
    }, 1000);
    return () => {
      clearInterval(autoDraw.current);
    };
  }, [autoDrawToggle, pile, deck]);

  const toggleAutoDraw = () => {
    setAutoDrawToggle(!autoDrawToggle);
  };

  /*
   *  const drawCard = () => {
   *    // Requests a card and appends it to pile in state
   *
   *    async function requestCard() {
   *      let response = await axios.get(
   *        `https://deckofcardsapi.com/api/deck/${deck}/draw`
   *      );
   *      if (response.data.error) {
   *        alert("Error: No cards remaining!");
   *      } else {
   *        let pileCopy = _.cloneDeep(pile);
   *        let card = response.data.cards[0];
   *        pileCopy.push(card);
   *        setPile(pileCopy);
   *      }
   *    }
   *
   *    if (autoDrawToggle) {
   *      requestCard();
   *    }
   *  };
   */

  return (
    <div className="CardTable" id="card-table">
      {deck ? (
        <button id="draw-card" onClick={toggleAutoDraw}>
          {autoDrawToggle ? "Turn off draw" : "Turn on draw"}
        </button>
      ) : (
        <h1>Loading...</h1>
      )}
      {pile.map((x) => (
        <Card cardFace={x.image} key={x.code} cardCode={x.code} />
      ))}
    </div>
  );
}

export default CardTable;
