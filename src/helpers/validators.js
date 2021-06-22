
// Function below was pulled from a Geeks for Geeks article on validating and ISBN number
export const isValidISBN = (isbn) => {  
    
    //Length must be 10 digits   
      let n = isbn.length;
    //Calculates weighted sum of first 9 numbers
      if(n === 10) {
        let sum = 0;
        for (let i = 0; i < 9; i++) {
          let digit = isbn[i] - '0';
              
          if (0 > digit || 9 < digit)
              return false;
                  
          sum += (digit * (10 - i));
        }
    
      // Checking last digit.
        let last = isbn[9];
        if (last !== 'X' && (last < '0' || last > '9'))
            return false;
    
      // If last digit is 'X', add 10
      // to sum, else add its value.
        sum += ((last === 'X') ? 10 : (last - '0'));
    
      // Return true if weighted sum
      // of digits is divisible by 11.
        return (sum % 11 === 0);
      } else if(n === 13) {
        let sum = 0;

        for (let i = 0; i < 12; i++) {
          if(i % 2 === 0) {
            let digit = isbn[i] - '0';
                
            if (0 > digit || 12 < digit)
                return false;
                    
            sum += (digit * 1);
          } else {
            let digit = isbn[i] - '0';
                
            if (0 > digit || 12 < digit)
                return false;
                    
            sum += (digit * 3);
          }
        }
    
      // Checking last digit.
        let last = isbn[12];
        if (last !== 'X' && (last < '0' || last > '9'))
            return false;
    
      // If last digit is 'X', add 10
      // to sum, else add its value.
        sum += ((last === 'X') ? 10 : (last - '0'));
    
      // Return true if weighted sum
      // of digits is divisible by 11.
        return (sum % 10 === 0);
      } else {
        return false
      }
  }