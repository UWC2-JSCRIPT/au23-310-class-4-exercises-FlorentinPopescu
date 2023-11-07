"use strict";

/*-------------------------------------------*/
const getDeck = () => {
  /**
    * Returns an array of 52 Cards
    * @returns {Array} deck - a deck of cards
  */

  const deck = []
  const suits = ['hearts', 'spades', 'clubs', 'diamonds']

  for (let index = 0; index < suits.length; index++) {
    // create an array of 13 objects
    for (let j = 2; j <= 14; j++) {
      // for each loop, push a card object to the deck

      // special cases for when j > 10
      let displayVal = '';

      switch (true) {
        case j >= 2 && j <= 10:
          displayVal = j
          break
        case j === 11:
          displayVal = 'Ace'
          break
        case j === 12:
          displayVal = 'Jack'
          break
        case j === 13:
          displayVal = 'Queen'
          break
        case j === 14:
          displayVal = 'King'
          break
      }

      const card = {
        val: j > 11 ? 10 : j,
        displayVal: displayVal,
        suit: suits[index],
      }

      deck.push(card)
    }
  }
  return deck;
}

const blackjackDeck = getDeck();

/*-------------------------------------------*/
class CardPlayer {
  /**
   * Represents a card player (including dealer).
   * @constructor
   * @param {string} name - The name of the player
  */

  constructor(name) {
    this.name = name;
  }

  hand = [];

  drawCard = () => {
    let randomCard = blackjackDeck[Math.floor(Math.random() * blackjackDeck.length)];
    this.hand.push(randomCard);
    return randomCard;
  }
};

/*-------------------------------------------*/
// CREATE TWO NEW CardPlayers
const dealer = new CardPlayer('dealer');
const player = new CardPlayer('player');

/*-------------------------------------------*/
const calcPoints = (hand) => {
  /**
   * Calculates the score of a Blackjack hand
   * @param {Array} hand - Array of card objects with val, displayVal, suit properties
   * @returns {Object} blackJackScore
   * @returns {number} blackJackScore.total
   * @returns {boolean} blackJackScore.isSoft
  */

  let isSoft = false;
  let total = 0;

  if (hand !== null && !Array.isArray(hand) && typeof hand === 'object') {
    /* 
      * hand has only 1 card --> game continues
    */

    // hand has 1 xard  with Ace counted at 11
    if (hand.displayVal === "Ace") {
      isSoft = true;
    }
    // total for 1-card hand
    total += hand.val;
  }

  else if (Array.isArray(hand) && hand.length >= 1 && hand.every(card => typeof card === 'object')) {
    /* 
      * hand contains at least 2 cards --> game continues or stops
    */
    
    // hand has no Ace
    if (hand.every(card => card.displayVal != "Ace")) {
      // compute total
      hand.forEach(card => { total += card.val });

      // hand is strong
      isSoft = false;
    }

    // hand has at leat 1 Ace
    else if (hand.find(card => card.displayVal === "Ace")) {
      // Ace counted as 11 by default 
      isSoft = true;

      // find the position of first Ace
      let firstAce = hand.find(card => card.displayVal === "Ace");
      let firstAceIndex = hand.indexOf(firstAce);

      // get the total number of Aces 
      let presentAce = hand.filter(card => card.displayVal === "Ace");
      let numberAce = presentAce.length;

      // compute total
      hand.forEach(card => { total += card.val });

      // if total is bigger than 21 then set first Ace value to 1
      if (total > 21 && numberAce === 1) {
        // reset total
        total = 0;
        // set firat Ace value to 1
        firstAce.val = 1;
        // update hand after setting first Ace to 1
        hand[firstAceIndex] = firstAce;
        // re-compute total
        hand.forEach(card => { total += card.val });
      }

      else if (Array.isArray(hand) && hand.length === 2 && numberAce === 2) {
        /* hand has exactly 2 cards and both are Aces --> split Aces either as (1, 1) or (1, 11) */
      
        // generate randomly 0 or 1
        let randomNumber = Math.random() < 0.5 ? 0 : 1;

        if (randomNumber === 0) {
          isSoft = false;
          // reset total
          total = 0;
          // set each Ace to 1
          hand.forEach(card => card.val = 1);
          // compute total
          hand.forEach(card => { total += card.val });
          //console.log("TOT", hand);
        } else {
          isSoft = true;
          // reset total
          total = 0;
          // set first Ace to 1
          hand[0].val = 1;
          // compute total
          hand.forEach(card => { total += card.val });
        }
      }
    }
  }

  return {total: total, isSoft: isSoft}
}

/*---------------------------------------------------*/
const dealerShouldDraw = (dealerHand) => {
  /**
    * Determines whether the dealer should draw another card.
    * @param {Array} dealerHand Array of card objects with val, displayVal, suit properties
    * @returns {boolean} whether dealer should draw another card
  */
  let draw = false;

  if (Array.isArray(dealerHand)) {
    let { total, isSoft } = calcPoints(dealerHand);

    if (total <= 16) {
      // drow another card
      draw = true;
    } else if (total === 17 && isSoft === true) {
      //draw another card
      draw = true;
    } else if (total === 21) {
      // stand
      draw = draw;
    }

    return draw;
  }
}

/*---------------------------------------------------*/
const determineWinner = (playerScore, dealerScore) => {
  /**
    * Determines the winner if both player and dealer stand
    * @param {number} playerScore 
    * @param {number} dealerScore 
    * @returns {string} Shows the player's score, the dealer's score, and who wins
  */

  let finalResult = '';
  let gameWinner = '';


  if (playerScore <= 21 && dealerScore <= 21) {

    switch (true) {
      case playerScore === dealerScore:
        gameWinner += 'tie';
        finalResult += `player score: ${playerScore}, dealer score: ${dealerScore}, winner: ${gameWinner}`;
        break;
      case playerScore > dealerScore:
        gameWinner = 'player';
        finalResult += `player score: ${playerScore}, dealer score: ${dealerScore}, winner: ${gameWinner}`;
        break;
      case playerScore < dealerScore:
        gameWinner += 'dealer';
        finalResult += `player score: ${playerScore}, dealer score: ${dealerScore}, winner: ${gameWinner}`;
        break;
      default:
        finalResult = finalResult;
        break;
    }
  }

  else if ((playerScore < 21 && dealerScore > 21) || (playerScore === 21 && dealerScore < 21) || (playerScore === 21 && dealerScore > 21)) {
    gameWinner += 'player';
    finalResult += `player score: ${playerScore}, dealer score: ${dealerScore}, winner: ${gameWinner}`;
  }

  else if ((dealerScore < 21 && playerScore > 21) || (dealerScore === 21 && playerScore < 21) || (dealerScore === 21 && playerScore > 21)) {
    gameWinner += 'dealer';
    finalResult += `player score: ${playerScore}, dealer score: ${dealerScore}, winner: ${gameWinner}`;
  }

  return finalResult;
}

/*---------------------------------------------------*/
const getMessage = (count, dealerCard) => {
  /**
    * Creates user prompt to ask if they'd like to draw a card
    * @param {number} count 
    * @param {string} dealerCard 
  */
  return `Dealer showing ${dealerCard.displayVal}, your count is ${count}.  Draw card?`
}

/*---------------------------------------------------*/
const showHand = (player) => {
  /**
    * Logs the player's hand to the console
    * @param {CardPlayer} player 
  */
  const displayHand = player.hand.map((card) => card.displayVal);
  console.log(`${player.name}'s hand is ${displayHand.join(', ')} (${calcPoints(player.hand).total})`);

  // show player hand in HTML
  document.getElementById("showHand").innerHTML = `${player.name}'s hand is ${displayHand.join(', ')} (${calcPoints(player.hand).total})`;
}

/*---------------------------------------------------*/
const startGame = function () {
  /**
    * Runs Blackjack Game
  */

  let first_player_card = player.drawCard();
  // show card received by player in HTML
  document.getElementById('cardsPlayer').innerHTML += `<li> player get a ${first_player_card.displayVal} valued as ${first_player_card.val}</li>`;

  let first_dealer_card = dealer.drawCard();
  // show card received by dealer in HTML
  document.getElementById('cardsDealer').innerHTML += `<li> dealer get a ${first_dealer_card.displayVal} valued as ${first_dealer_card.val}</li>`;

  let second_player_card = player.drawCard();
  // show card received by player in HTML
  document.getElementById('cardsPlayer').innerHTML += `<li> player get a ${second_player_card.displayVal} valued as ${second_player_card.val}</li>`;

  let second_dealer_card = dealer.drawCard();
  // show card received by dealer in HTML
  document.getElementById('cardsDealer').innerHTML += `<li> dealer get a ${second_dealer_card.displayVal} valued as ${second_dealer_card.val}</li>`;

  /*** player ***/
  let playerScore = calcPoints(player.hand).total;

  showHand(player);  

  try {
    let newCard = {};
    //while (playerScore < 21 && confirm(getMessage(playerScore, dealer.hand[0]))) {
    while (playerScore < 21 && dealer.hand[0]) {
      let player_new_card = player.drawCard();
      playerScore = calcPoints(player.hand).total;
      showHand(player);

      // show player new cards in HTML
      document.getElementById('cardsPlayer').innerHTML += `<li> player get a ${player_new_card.displayVal} valued as ${player_new_card.val}</li>`;
    
      if (playerScore >= 17 && playerScore < 21) {
        break;
      } 
    }
  } catch (error) {
    if (error.name == 'ReferenceError') {
      //console.error(error);
      console.log('ReferenceError: confirm is not defined --> need to run program from HTML');
    } else {
      throw error;
    }
  }
 
  if (playerScore > 21) {
    return 'You went over 21 - you lose!';
  }
  //console.log(`Player stands at ${playerScore}`);
  
  /*** dealer ***/
  let dealerScore = calcPoints(dealer.hand).total;

  //showHand(dealer);

  while (dealerScore < 21 && dealerShouldDraw(dealer.hand)) {
    let dealer_new_card = dealer.drawCard();
    dealerScore = calcPoints(dealer.hand).total;
    showHand(dealer);

    // show dealer new cards in HTML
    document.getElementById('cardsDealer').innerHTML += `<li> dealer get a ${dealer_new_card.displayVal} valued as ${dealer_new_card.val}</li>`;
  }

  if (dealerScore === 21) {
    return 'Dealer has 21 - you lose!';
  } else if (dealerScore > 21) {
    return 'Dealer went over 21 - you win!';
  }
  //console.log(`Dealer stands at ${dealerScore}`);

  return determineWinner(playerScore, dealerScore);
}

/*---------------------------------------------------*/
//console.log(startGame());

/*---------------------------------------------------*/
const displayDraws = () => {
    document.getElementById("display").innerHTML = `${startGame()}`;
    document.getElementById("draw").removeEventListener('click', displayDraws);
}
document.getElementById("draw").addEventListener("click", displayDraws);