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

console.log(getDeck());

/*---------------------------------------------------*/
// CHECKS
const deck = getDeck();
console.log(`Deck length equals 52? ${deck.length === 52}`)

const randomCard = deck[Math.floor(Math.random() * 52)]

const cardHasVal =
  randomCard && randomCard.val && typeof randomCard.val === 'number'
console.log(`Random card has val? ${cardHasVal}`)

const cardHasSuit =
  randomCard && randomCard.suit && typeof randomCard.suit === 'string'
console.log(`Random card has suit? ${cardHasSuit}`)

const cardHasDisplayVal =
  randomCard &&
  randomCard.displayVal &&
  typeof randomCard.displayVal === 'string'
console.log(`Random card has display value? ${cardHasDisplayVal}`)
