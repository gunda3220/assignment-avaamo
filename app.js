const fetch = require('node-fetch');

const API_KEY = "dict.1.1.20210216T114936Z.e4989dccd61b9626.373cddfbfb8a3b2ff30a03392b4e0b076f14cff9";

let matchingWord = "test";

let matchedWords = [];

let wordCountArr = [];

const fetchText = async(matchingWord) => {
    let response = await fetch('http://norvig.com/big.txt',{headers:{"Content-Type":"application/json"}});
    let text = await response.text();
    text = text.toLowerCase();
    let words = text.split(/[^A-Za-z]/);
    let count = 0;
    for(let i = 0;i < words.length;i++){
        if(words[i].includes(matchingWord.toLowerCase())){
            count++;
        }
    }
    console.log(`word count of ${matchingWord} is ${count}`);

    words = words.filter(word => word != '');

    words = words.slice(0,2000);
    
    words = words.sort();
    let currentLetter = "a";
    let prevJ = 0;

    for(let i = 0;i<words.length;i++){
        let wordCount = 1;
        if(words[i][0] > currentLetter){
            currentLetter = words[i][0];
            prevJ = i;
        }
        if(!matchedWords.includes(words[i])){
            matchedWords.push(words[i]);
            for(let j = prevJ; j< words.length;j++){
                if( i != j ){
                    if(words[i][0] != words[j][0]){
                        break;
                    }
                    else if(words[i] === words[j]){
                        wordCount++;
                    }
                }
            }
            let obj = {"text":words[i],"count":wordCount};
            wordCountArr.push(obj);
        }   
    }
    wordCountArr = wordCountArr.sort(function(a, b) {
        return parseFloat(b.count) - parseFloat(a.count);
    });
    let topWords = wordCountArr.slice(0,10)
    // console.log(topWords);
    for(let i = 0;i<topWords.length;i++){
        let url = `https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=${API_KEY}&lang=en-en&text=${topWords[i].text}`;
        let response = await fetch(url,{headers:{"Content-Type":"application/json"}});
        response = await response.json();
        console.log(`word : "${response.def[0].text}"`);
        console.log(`count: ${topWords[i].count}`)

        console.log(`parts of speech : ${response.def[0].pos}`)
        // console.log(response.def[0].tr.length);
        for(let j = 0; j < response.def[0].tr.length;j++){
            console.log(`Translations: ${response.def[0].tr[j].text}`);
            if(response.def[0].tr[j].syn){
                console.log("Synonyms: ")
                for(let k = 0;k<response.def[0].tr[j].syn.length;k++){
                    console.log("\t",response.def[0].tr[j].syn[k].text)
                }
            }
            else{
                console.log("No synonyms");
            }
        }
        console.log("\n");
    }
}

fetchText(matchingWord);




