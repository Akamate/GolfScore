const defaultStore = {
	courseName: "jhkjhj",
	par : [],
	hcp: [],
}

const golfApp = (state = defaultStore, action) => {
	console.log(state, action)
	switch (action.type) {
		case 'SET_COURSE_NAME':
			return {
				...state,
				courseName: action.courseName
			}
		case 'SET_PAR':
			return {
				...state,
				par: action.par
			}
		case 'SET_HCP':
			return {
				...state,
				hcp: action.hcp
			}
		default:
			return state
	}
}

export default golfApp