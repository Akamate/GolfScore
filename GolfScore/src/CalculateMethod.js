export const system36Hcp = (scores, par) => {
    var hcp = 0
    var net = 0
    const newScore = scores
    newScore.map((score, index) => {
        hcp = 0
        if (score.length == 12) {
            score.pop()
            score.pop()
        } else if (score.length == 23) {
            score.pop()
            score.pop()
        }
        score.map((scoreAtHole, index) => {
            if (index != 9 && index < 19) {
                if (scoreAtHole != '') {
                    if (index < 10) {
                        if (parseInt(scoreAtHole) > parseInt(par[index])) {
                            hcp += parseInt(scoreAtHole) - parseInt(par[index]) == 1 ? 1 : 2
                        }
                    } else {
                        if (parseInt(scoreAtHole) > parseInt(par[index - 1])) {
                            hcp += parseInt(scoreAtHole) - parseInt(par[index]) == 1 ? 1 : 2
                        }
                    }
                }
            }
        })
        if (score.length > 13) {
            net = score[score.length - 1] - hcp
        } else {
            net = score[9] - hcp
        }
        score.push(hcp)
        score.push(net)
    })
    return newScore
}

export const strokePlay = (scores, hcp) => {
    const newScore = scores
    newScore.map((score, index) => {
        if (score.length == 12) {
            score.pop()
            score.pop()
        } else if (score.length == 23) {
            score.pop()
            score.pop()
        }
        if (score.length > 13) {
            net = score[score.length - 1] - hcp
            console.log(net)
            console.log(score[score.length - 1])
            console.log(hcp)
        } else {
            net = score[9] - hcp
        }
        score.push(hcp)
        score.push(net)
    })
    return newScore
}

export const stableFord = (scores, par, hcp) => {
    var hcpPlayer = 0
    var net = 0
    const newScore = scores
    newScore.map((score, index) => {
        hcpPlayer = 0
        net = 0
        if (score.length == 12) {
            score.pop()
            score.pop()
        } else if (score.length == 23) {
            score.pop()
            score.pop()
        }
        score.map((scoreAtHole, index) => {
            if (index != 9 && index < 19) {
                if (scoreAtHole != '') {
                    if (index < 10) {
                        if (parseInt(scoreAtHole) > parseInt(par[index])) {
                            hcpPlayer += parseInt(scoreAtHole) - parseInt(par[index]) == 1 ? 1 : 2
                        }
                    } else {
                        if (parseInt(scoreAtHole) > parseInt(par[index])) {
                            hcpPlayer += parseInt(scoreAtHole) - parseInt(par[index]) == 1 ? 1 : 2
                        }
                    }
                }
            }
        })

        score.map((scoreAtHole, index) => {
            if (index != 9 && index < 19) {
                if (scoreAtHole != '') {
                    if (index < 10) {
                        net += calculatePoint(scoreAtHole, par[index], hcp[index], hcpPlayer)
                    } else {
                        net += calculatePoint(scoreAtHole, par[index], hcp[index - 1], hcpPlayer)
                    }
                }
            }
        })
        score.push(hcpPlayer)
        score.push(net)
    })

    return newScore
}

const calculatePoint = (scoreAtHole, parAtHole, hcpAtHole, hcp) => {
    scoreAtHole = hcpAtHole <= hcp ? scoreAtHole - 1 : scoreAtHole
    diff = parAtHole - scoreAtHole
    point = 0
    point = diff == -1 ? 1 : point
    point = diff == 0 ? 2 : point
    point = diff == 1 ? 3 : point
    point = diff == 2 ? 4 : point
    point = diff == 3 ? 5 : point
    return point
}

export const doublePeoria = (scores, holeLists) => {
    sum = 0
    newScore = scores
    newScore.map((score, index) => {
        sum = 0
        if (score.length == 12) {
            score.pop()
            score.pop()
        } else if (score.length == 23) {
            score.pop()
            score.pop()
        }
        holeLists.map(holeNumber => {
            sum += parseInt(score[holeNumber > 8 ? holeNumber + 1 : holeNumber])
        })
        hiddenHole = score[score.length - 1] - sum
        hcp = (hiddenHole * 1.5 - 72) * 0.8
        net = score[score.length - 1] - hcp
        score.push(hcp.toFixed(1))
        score.push(net.toFixed(1))
    })
    return newScore
}

export const modifiedPeoria = (scores, par, holeLists) => {
    sum = 0
    newScore = scores
    newScore.map((score, index) => {
        sum = 0
        if (score.length == 12) {
            score.pop()
            score.pop()
        } else if (score.length == 23) {
            score.pop()
            score.pop()
        }
        holeLists.map(holeNumber => {
            if (holeNumber >= 9) {
                diff = parseInt(score[holeNumber + 1]) - parseInt(par[holeNumber + 1])
                console.log(parseInt(score[holeNumber + 1]), parseInt(par[holeNumber + 1]))
            } else {
                diff = score[holeNumber] - par[holeNumber]
                console.log(parseInt(score[holeNumber]), parseInt(par[holeNumber]))
            }
            console.log(diff)
            sum += diff > 3 ? 3 : diff
        })
        console.log(sum)
        hcp = sum * 2.8
        net = score[score.length - 1] - hcp
        score.push(hcp.toFixed(1))
        score.push(net.toFixed(1))
    })
    return newScore
}

export const matchPlay = scores => {
    newScore = scores
    sumPlayer1 = 0
    sumPlayer2 = 0
    newScore[0].pop()
    newScore[0].pop()
    newScore[1].pop()
    newScore[1].pop()
    for (i = 0; i < newScore[0].length; i++) {
        if (parseInt(newScore[0][i]) > parseInt(newScore[1][i])) {
            sumPlayer2 += 1
        } else if (parseInt(newScore[0][i]) < parseInt(newScore[1][i])) {
            sumPlayer1 += 1
        }
    }
    newScore[0].push(0)
    newScore[1].push(0)
    newScore[0].push(sumPlayer1)
    newScore[1].push(sumPlayer2)
    return newScore
}
