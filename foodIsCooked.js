const foodIsCooked = function(kind, internalTemp, doneness) {
  /**
    * Determines whether meat temperature is high enough
    * @param {string} kind 
    * @param {number} internalTemp 
    * @param {string} doneness
    * @returns {boolean} isCooked
  */
  
  if (typeof kind === "string" && typeof internalTemp == 'number' && (typeof doneness === 'string' || typeof doneness === 'undefined')) {
    
    switch (kind) {

      case 'chicken':
        if (internalTemp > 90) {
          return true;
        } else {
          return false
        };
     
        case 'beef':
          if (internalTemp === 138) {
            if (['medium', 'rare'].includes(doneness)) {
              return true;
            } else {
              return false;
            }
          } else {
            return false
          }
    }

  } else {
    console.log('incorrect parameters passed to foodIsCooked!');
    return null;
  }

}

/*---------------------------------------------------*/
// Test function
console.log(foodIsCooked('chicken', 90)); // should be false
console.log(foodIsCooked('chicken', 190)); // should be true
console.log(foodIsCooked('beef', 138, 'well')); // should be false
console.log(foodIsCooked('beef', 138, 'medium')); // should be true
console.log(foodIsCooked('beef', 138, 'rare')); // should be true
