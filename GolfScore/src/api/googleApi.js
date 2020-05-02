import config from './../../config.json'
class GoogleAPI {
    static postImage = async (data, callback) => {
        let googleVisionRes = await fetch(config.googleCloud.api + config.googleCloud.apiKey, {
            method: 'POST',
            body: JSON.stringify({
                requests: [
                    {
                        image: {
                            content: data
                        },
                        features: [{ type: 'DOCUMENT_TEXT_DETECTION' }],
                        imageContext: {
                            languageHints: ['en-t-i0-handwrit']
                        }
                    }
                ]
            })
        })
        var score = []
        await googleVisionRes
            .json()
            .then(googleVisionRes => {
                console.log(googleVisionRes)
                if (googleVisionRes) {
                    lines = googleVisionRes.responses[0].fullTextAnnotation.text.split('\n')
                    console.log(lines)
                    score = this.processTexts1(lines)
                    callback(null, score)
                }
            })
            .catch(error => {
                console.log(error)
            })

        // score = this.processTexts(lines)
        //    callback(null,score)
    }

    static processTexts = lines => {
        var score = []
        isScoreCheck = false
        isComplete = false
        countSpace = 0
        for (i = 0; i < lines.length; i++) {
            //lines[i] = lines[i].toUpperCase()
            lines[i] = lines[i].replace(/[/[.,]/g, ' ')
            words = lines[i].split(/[\s]+/)
            console.log(words)
            count = 0
            for (j = 0; j < words.length; j++) {
                if (!isNaN(words[j])) {
                    if (parseInt(words[j]) > 100 && parseInt(words[j]) < 999) {
                        countSpace += 1
                    }
                    if ((parseInt(words[j]) < 99 && countSpace >= 14) || parseInt(words[j]) > 10000) {
                        count += 1
                    }
                    if (parseInt(words[j]) > 10000 && countSpace >= 14) {
                        count = 4
                    }
                } else if (words[j] == 'X') {
                    isComplete = true
                }
                // console.log(words[j])
            }
            console.log(isComplete)
            console.log(count)
            console.log(countSpace)
            if (
                !lines[i].includes('OUT') &&
                !lines[i].includes('LAKE') &&
                !lines[i].includes('RATING') &&
                !lines[i].includes('SLOPE')
            ) {
                if (count >= 2 && words.length > 2 && words.length <= 12) {
                    var wordArr = lines[i].split(/[\s]+/)
                    if (!isNaN(wordArr[0])) {
                        console.log(wordArr)
                        if (parseInt(wordArr[0]) >= 10 && wordArr[0][0] == '1') {
                            console.log('Yess')
                            wordArr[0] = wordArr[0].substring(1)
                        }
                    }
                    var cleanText = ''
                    for (k = 0; k < wordArr.length; k++) {
                        cleanText = cleanText + wordArr[k] + ' '
                    }
                    cleanText = cleanText.replace(/[a-zA-Z:-|]/g, '')
                    cleanText = cleanText.replace(/\s/g, '')
                    cleanText = cleanText.replace('-', '')
                    console.log(cleanText)
                    var cleanTextArr = cleanText.split('')
                    var text = ''
                    for (k = 0; k < cleanTextArr.length; k++) {
                        text = text + cleanTextArr[k] + ' '
                    }

                    if (text.length < 30) score.push(text.split(' '))
                }
            }

            if (isComplete) break
        }

        for (i = 0; i < score.length; i++) {
            score[i].splice(0, 0, `P${i + 1}`)
        }
        console.log(score)
        return score
    }

    static processTexts1 = lines => {
        var score = []
        for (i = 0; i < lines.length; i++) {
            lines[i] = lines[i].replace('g', '9')
            lines[i] = lines[i].replace(/[a-zA-Z:-|/.-]/g, ' ')
            lines[i] = lines[i].replace(/[a-zA-Z:*%|/.+]/g, ' ')
            lines[i] = lines[i].replace(/[0:*%|/()'"]/g, ' ')
            lines[i] = lines[i].replace('-', '')
            lines[i] = lines[i].replace('#', '')
            lines[i] = lines[i].split(' ')
            if (
                isNaN(lines[i][lines[i].length - 1]) &&
                parseInt(lines[i][lines[i].length - 1]) >= 10 &&
                parseInt(lines[i][lines[i].length - 1]) <= 99
            ) {
                if (lines[i][lines[i].length - 1][2] == '1') {
                    lines[i][lines[i].length - 1].splice(0)
                }
            }
            if (parseInt(lines[i][0]) >= 10 && parseInt(lines[i][0][0]) == '1') {
                lines[i][0] = lines[i][0].substring(1)
            } else if (
                parseInt(lines[i][lines[i].length - 1]) >= 10 &&
                parseInt(lines[i][lines[i].length - 1][0]) == '1'
            ) {
                lines[i][lines[i].length - 1] = lines[i][lines[i].length - 1].substring(1)
            }

            lines[i] = lines[i].join('')
            for (j = 0; j < lines[i].length; j++) {
                lines[i] = lines[i].replace(' ', '1')
            }
            if (lines[i].length > 9) {
                for (j = 0; j < lines[i].length - 9; j++) {
                    lines[i] = lines[i].replace('1', ' ')
                }
            }
            lines[i] = lines[i].replace(/[a-zA-Z:-|/. -]/g, '')
            lines[i] = lines[i].split('')
            console.log(lines[i])
            if (lines[i].length >= 3 && lines[i].length <= 15) {
                if (lines[i].length >= 10) {
                    var endIndex = lines[i].length
                    for (j = 0; j < endIndex - 9; j++) lines[i].pop()
                }
                var count = lines[i].length
                for (j = 0; j < 9 - count; j++) lines[i].push('')
                score.push(lines[i])
            }
        }

        return score
    }
}

export default GoogleAPI
