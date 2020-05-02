export const PlayerSchema = {
    name: 'Player',
    properties: {
        name: 'string',
        golfCourse: 'string',
        scores: 'double[]',
        date: 'string'
    }
}

export const GolfCourseSchema = {
    name: 'GolfCourse',
    properties: {
        name: 'string',
        par: 'double[]',
        hcp: 'double[]'
    }
}
