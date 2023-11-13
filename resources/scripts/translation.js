//translation script for matching from NetLogo Web to Tortoise format
//have to import the paths or files to './en_us' file and './Errors_en.properties' file, as well as the other language (ex. ./Errors_es.properties)
const fs = require('fs');


const bundle = require('../../engine/target/classes/js/tortoise/i18n/en_us.js');

const stringSimilarity = require('string-similarity');

const identifier = bundle.identifier;

const PropertiesReader = require('properties-reader');
const reader_en = PropertiesReader('./Errors_en.properties');
const errors_en = Object.keys(reader_en._properties);

const readline = require('readline');


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
function askForFilePath() {

  rl.question('Enter the path to the file after importing it to the same folder (ex. ./Errors_es.properties ) ', (filePath) => {
    if (fs.existsSync(filePath)){
      const reader_zh = PropertiesReader(filePath);
      // Do something with reader

      //const reader_zh = PropertiesReader('./Errors_es.properties');
      //edit the above for different .properties files
      const errors_zh = Object.keys(reader_zh._properties);

      let count = 0;
      let needChange = [];
      let noMatchFound = ["org.nlogo.agent.ImportPatchColors.unsupportedImageFormat",  ];

      for (const key in bundle) {



        try {
          parameterName  = '';
          parameterArray = []
          if (typeof bundle[key] === 'function') {
            const logFunction = bundle[key];

            const match = logFunction.toString().match(/\(([^)]+)\)/);

          if (match){
            parameterName = match[1];
            parameterArray = parameterName.split(', ');
          }
          else{
          }

          const value = bundle[key]("_","_", "_", "_", "_");

          let mostSimilarKey = '';
          let highestSimilarity = 0;
          let tempMessage = '';
          let tempValue = value;


          for (const errorKey of errors_en) {
            const errorMessage = reader_en._properties[errorKey];

            const similarity = stringSimilarity.compareTwoStrings(value, errorMessage);
            if (similarity > highestSimilarity) {
              tempMessage = errorMessage;
              tempValue = value;
              highestSimilarity = similarity;
              mostSimilarKey = errorKey;
            }
          }
          if (highestSimilarity < 0.69){
            needChange.push(mostSimilarKey);
            count = count + 1
          }
          else{
            count = count + 1
            if (bundle.hasOwnProperty(key) && count != 8) {
            //console.log(`Identifier: ${key}`);
              if (typeof bundle[key] === 'function') {
                const value = bundle[key];
                returnMessage = reader_zh._properties[mostSimilarKey];
                if (returnMessage != undefined){
                  replacedErrorMessage = returnMessage.replace(/\{(\d+)\}/g, (match, index) => `#{${parameterArray[index]}}`);

                  tempValue = tempValue.replace(/can't/g, 'can_t');
                  tempValue = tempValue.replace(/Can't/g, 'Can_t');
                  tempValue = tempValue.replace(/isn't/g, 'isn_t');
                  tempValue = tempValue.replace(/random-normal's/g, 'random-normal_s');
                  tempValue = tempValue.replace(/world's/g, 'world_s');

                  console.log(`, '${tempValue}': (${parameterName}) -> \n      "${replacedErrorMessage}" \n`);
                  //console.log(`${count}. Value: ${value}`);

                }
                else{
                  needChange.push(mostSimilarKey);

                }
              }
            }
          }

          const errorMessage = reader_zh._properties[mostSimilarKey];

          }
        }

        catch (error) {
          console.error(`Error processing key '${key}': ${error.message}`);
          console.log('');
          continue;
        }
      }
      rl.close();
    }
    else{
      console.log("File doesn't exist. Please enter a valid path.");
      askForFilePath();  // Ask again for a valid path

    }
  });
}

askForFilePath();
