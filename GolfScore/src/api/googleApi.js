import React,{Component} from 'react';
import config from './../../config.json';
class GoogleAPI {
     static postImage = async (data,callback) =>  {
        let googleVisionRes = await fetch(config.googleCloud.api + config.googleCloud.apiKey, {
            method: 'POST',
            body: JSON.stringify({
                "requests": [
                    {
                        "image": {
                            "content": data
                        },
                        features: [
                            { type: "DOCUMENT_TEXT_DETECTION" },
                        ],
                        "imageContext": {
                            "languageHints": ["en-t-i0-handwrit"]
                         }
                    }
                ]
            })
        })
        var score = []
        await googleVisionRes.json()
            .then(googleVisionRes => {
                console.log(googleVisionRes)
                if (googleVisionRes) {
                    lines = googleVisionRes.responses[0].fullTextAnnotation.text.split('\n')
                    console.log(lines)
                     score = this.processTexts1(lines)
                     callback(null,score)
                }
            }).catch((error) => { console.log(error) })

       // score = this.processTexts(lines)
    //    callback(null,score)
    }

      static processTexts = (lines) => {
         var score = []
         isScoreCheck = false
         isComplete = false 
         countSpace = 0
         for(i=0;i<lines.length;i++){
             lines[i] = lines[i].toUpperCase()
             lines[i] = lines[i].replace(/[/[.,]/g,' ')
             words = lines[i].split(/[\s]+/)
             console.log(words)
             count = 0
             for(j=0;j<words.length;j++){
                 if(!isNaN(words[j])){
                     if(parseInt(words[j])>100 && parseInt(words[j])<999){
                         countSpace += 1
                     }
                     if(parseInt(words[j])<99 && countSpace >= 14 || parseInt(words[j])>10000){
                         count+=1
                     }
                     if(parseInt(words[j]) > 10000 && countSpace >= 14 ){
                         count = 4
                     }
                 }
                 else if(words[j] == "X" ){
                         isComplete = true
                 }
                // console.log(words[j])
             }
             console.log(isComplete)
             console.log(count)
             console.log(countSpace)
             if(!lines[i].includes("OUT") && !lines[i].includes("LAKE") && !lines[i].includes("RATING") && !lines[i].includes("SLOPE")){
                if(count>=2 && words.length > 2 && words.length <= 12) {
                    var wordArr = lines[i].split(/[\s]+/)
                    if(!isNaN(wordArr[0])){
                        console.log(wordArr)
                        if(parseInt(wordArr[0])>=10 && wordArr[0][0] == '1' ){
                            console.log('Yess')
                            wordArr[0] = wordArr[0].substring(1)
                        }
                    }
                    var cleanText = ''
                    for(k=0;k<wordArr.length;k++){
                        cleanText = cleanText + wordArr[k] + ' '
                    }
                    cleanText = cleanText.replace(/[a-zA-Z:-|]/g, '')
                    cleanText = cleanText.replace(/\s/g,'')
                    cleanText = cleanText.replace('-','')
                    console.log(cleanText)
                    var cleanTextArr = cleanText.split('')
                    var text = ''
                    for(k=0;k<cleanTextArr.length;k++){
                        text = text + cleanTextArr[k] + ' '
                    }
                 // console.log(text)
                 
                  if(text.length < 30)
                     score.push(text.split(' '))
               }
             }

             if(isComplete)
                break
         }
         
        for(i=0;i<score.length;i++){
            score[i].splice(0,0,`P${i+1}`)
        }
        console.log(score)
        return score
    }

    static processTexts1 = (lines) => {
        var score = []
        for(i=0;i<lines.length;i++){
             lines[i] = lines[i].toUpperCase()
             lines[i] = lines[i].replace(/[a-zA-Z:-|/ .-]/g,'')
             lines[i] = lines[i].replace('-','') 
             lines[i] = lines[i].split('')
             if(lines[i].length >= 3){
                 console.log(lines[i])
                 if(lines[i].length >= 10){
                     lines[i].pop()
                 }
                 score.push(lines[i])
             }
             
         }
         
         for(i=0;i<score.length;i++){
            score[i].splice(0,0,`P${i+1}`)
            console.log(score[i])
        }

        return score;

    }

}

export default GoogleAPI;