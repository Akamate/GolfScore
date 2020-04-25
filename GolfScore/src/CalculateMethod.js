export const system36Hcp = (scores, par) => {
    var hcp = 0
    var net = 0
    const newScore = scores
    newScore.map((score, index) => {
        hcp = 0
        score.map((scoreAtHole, index) => {
            if (index != 9 || index < 19) {
                if (scoreAtHole != '') {
                    if (index < 10) {
                        if (parseInt(scoreAtHole) > parseInt(par[index])) {
                            hcp += parseInt(scoreAtHole) - parseInt(par[index]) == 1 ? 1 : 2
                        }
                    } else {
                        if (parseInt(scoreAtHole) > parseInt(par[index - 1])) {
                            hcp += parseInt(scoreAtHole) - parseInt(par[index - 1]) == 1 ? 1 : 2
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
