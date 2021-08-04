const fetch = require('node-fetch');

const API_KEY = "dict.1.1.20210216T114936Z.e4989dccd61b9626.373cddfbfb8a3b2ff30a03392b4e0b076f14cff9";

const matchingWord = "test"; //word of which count is to be found

const getCount = (matchingWord,words) => {
    let count = 0;

    for(let i = 0;i < words.length;i++){
        if(words[i].includes(matchingWord.toLowerCase())){ // This condition checks if the matching word is a subset of a word. For example the word "test" is a subset of "testing". To do exact comparison use the below commented code.
            count++;
        }
        //Use this code to do exact comparison
        // if(words[i] === matchingWord){ 
        //     count++
        // }
    }
    return count;
}

const getTopWords = (words) => {
    let wordCountArr = [];
    words = words.filter(word => word.length >= 4); //Filtering out all the words with length less than 4 to eliminate the words like the, is, of etc

    words = words.sort();

    let currentWord = words[0];
    let prevJ = 0;

    for(let i = 0;i<words.length;i++){
        let wordCount = 1;
        if(words[i] > currentWord){
            currentWord = words[i];
            prevJ = i;
        }

        for(let j = prevJ; j< words.length;j++){
            if( i != j ){
                if(words[i] != words[j]){
                    i = j-1;
                    break;
                }
                else{
                    wordCount++;
                }
            }
        }

        let obj = {"text":words[i],"count":wordCount};
        wordCountArr.push(obj);  
    }
    wordCountArr = wordCountArr.sort(function(a, b) {
        return parseFloat(b.count) - parseFloat(a.count);
    });
    // console.log(wordCountArr.slice(0,10));
    return wordCountArr.slice(0,10);
}


const printDetails = async (topWords) => {
    for(let i = 0;i<topWords.length;i++){
        let url = `https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=${API_KEY}&lang=en-en&text=${topWords[i].text}`;
        let response = await fetch(url,{headers:{"Content-Type":"application/json"}});
        response = await response.json();
        console.log(`word : "${topWords[i].text}"`);
        if(response.def.length > 0){
            console.log(`parts of speech : ${response.def[0].pos}`)
            for(let j = 0; j < response.def[0].tr.length;j++){
                console.log(`\t Translations: ${response.def[0].tr[j].text}`);
                if(response.def[0].tr[j].syn){
                    console.log("\t\t Synonyms: ")
                    for(let k = 0;k<response.def[0].tr[j].syn.length;k++){
                        console.log("\t\t\t",response.def[0].tr[j].syn[k].text)
                    }
                }
                else{
                    console.log("\t\t No synonyms");
                }
            }
            console.log("\n");
        }
        else{
            console.log("no data for this word");
        }      
    }
}

const getJson = async(topWords) => {
    let jsonArr = [];
    for(let i = 0;i<topWords.length;i++){
        let url = `https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=${API_KEY}&lang=en-en&text=${topWords[i].text}`;
        let response = await fetch(url,{headers:{"Content-Type":"application/json"}});
        response = await response.json();
        let wordObject = {};
        wordObject.Word = topWords[i].text;
        wordObject.Output = {};
        wordObject.Output.count = topWords[i].count;
        if(response.def.length > 0){
            wordObject.Output.Pos = response.def[0].pos;
            let synonyms = [];
            for(let k = 0;k<response.def[0].tr.length;k++){
                if(response.def[0].tr[k].syn){
                    for(let l = 0;l<response.def[0].tr[k].syn.length;l++){
                        let syn = response.def[0].tr[k].syn[l].text;
                        synonyms.push(syn);
                    }
                }
            }
            wordObject.Output.Synonyms = synonyms;
        }  
        jsonArr.push(wordObject);     
    }
    return jsonArr;
}

const fetchText = async(matchingWord) => {
    let response = await fetch('http://norvig.com/big.txt',{headers:{"Content-Type":"application/json"}});
    let text = await response.text();
    text = text.toLowerCase();
    let words = text.split(/[^A-Za-z]/);
    
    let matchingCount = getCount(matchingWord,words);

    console.log(`word count of ${matchingWord} is ${matchingCount}`);

    let topWords = getTopWords(words);

    await printDetails(topWords);

    let jsonOutput = await getJson(topWords);
  
    console.log(jsonOutput);
    
}

fetchText(matchingWord);




