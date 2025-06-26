function notBad(str) {
  const notIndex = str.indexOf("not");
  const badIndex = str.indexOf("bad");

  // Check if both 'not' and 'bad' exist, and 'bad' comes after 'not'
  if (notIndex !== -1 && badIndex !== -1 && badIndex > notIndex) {
    // Replace from 'not' to 'bad' with 'good'
    return str.slice(0, notIndex) + "good" + str.slice(badIndex + 3);
  }

  // Otherwise, return the original string
  return str;
}

console.log(notBad("This dinner is not that bad!"));  // "This dinner is good!"
console.log(notBad("This dinner is bad!"));           // "This dinner is bad!"
console.log(notBad("It's not so bad after all."));    // "It's good after all."
console.log(notBad("Nothing is bad here."));          // "Nothing is bad here."
