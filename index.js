const fs = require('fs')
const _ = require('lodash')

var replaceFwords = {};
var shaksPeareFile = fs.readFileSync('t8.shakespeare.txt', 'utf8').toString();
var ocurrenceCount = (str, value) => (str.match(new RegExp(value, "gi")) || []).length

const msToMnts = (millis) => `${Math.floor(millis / 60000)} minutes ${((millis % 60000) / 1000).toFixed(0)} seconds`;
let startTime = new Date();

(async function () {
    fs.appendFileSync('./frequency.csv', `English,French,Frequency\n`);
    
    let getFrenchDictionary = fs.readFileSync('french_dictionary.csv', 'utf8').toString().split('\n')

    await getFrenchDictionary.forEach(replaceFrenchWords);

    let getFindWords = fs.readFileSync('find_words.txt', 'utf8').toString().split('\n')   

    await getFindWords.forEach(findWords);

    fs.appendFileSync('./t8.shakespeare.translated.txt', shaksPeareFile);

    console.log(replaceFwords)
    let processTime = new Date() - startTime;
    fs.appendFileSync('./performance.txt', `Time to process: ${msToMnts(processTime)}\n`);

    memoryUsed = Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100;
    fs.appendFileSync('./performance.txt', `Memory used: ${memoryUsed} MB\n`);

})();


function replaceFrenchWords(item,index){
    if(item !== null && item !== '') {
        let words = item.split(',');
        replaceFwords[_.get(words, '0')] = _.get(words, '1');
     }
}

function findWords(item,index){
    if(item !== null && item !== '') {
        let wordFound = _.get(replaceFwords, item, item);
        fs.appendFileSync('./frequency.csv', `${item},${wordFound},${ocurrenceCount(shaksPeareFile, item)}\n`);
        shaksPeareFile = shaksPeareFile.replace(new RegExp(item, 'g'), wordFound)
     }
}