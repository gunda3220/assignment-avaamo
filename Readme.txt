Packages to install 
node-fetch
nodemon (optional)

Steps to run the code.
Open terminal or command prompt. Navigate to the project folder. And enter any one of the following commands.
node app.js or nodemon app.js

It will start the code execution. 
Initially the matchingWord variable is initialized to "test" and the count is logged on the terminal for the word "test". This variable can be initialized to any word.

Next, details of top 10 occuring words are fetched from https://dictionary.yandex.net/api/v1/dicservice.json/lookup and logged on to the terminal.
As per my understanding of the api, it's a dictionary to translate words from one language to another which can be chosen using "lang" parameter. I have set the lang parameter to en-en. The response does not have synonyms for the word queried instead the response has translations to the word which have synonyms.

The word, it's translations and their synonyms are logged onto the terminal.
For a few words no data is returned from the api, in this case "no data for this word" is logged on to the terminal.
For a few words even the translations doesn't have synonyms. In that case "no synonyms" is logged onto the terminal.

Next JSON output is logged on to the terminal.

I have a made the following assumptions while working on this.
1. Finding the count of subsets rather than exact match.
2. Getting the synonyms of translations of the word instead of the word.
3. Considering only the words whose length is greater than 3.

In case the code does not meet the requirements, Please let me know and give me a chance to fix it.


 



 

