export default (calculateHeight = numberPlayer => {
    if (numberPlayer >= 4) {
        return numberPlayer * 92
    } else if (numberPlayer == 1) {
        return 120
    } else {
        return numberPlayer * 120 - 14 * numberPlayer
    }
})
