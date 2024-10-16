import { FETCH_POLLS, VOTE_POLL, ADD_POLL, ADD_SUGGESTION } from '../actions/pollActions';

const initialState = {
    polls: [],
    suggestions: []  // New state for suggestions
};

export default function(state = initialState, action) {
    switch (action.type) {
        case FETCH_POLLS:
            return {
                ...state,
                polls: action.payload
            };
        case VOTE_POLL:
            return {
                ...state,
                polls: state.polls.map(poll =>
                    poll.id === action.payload.pollId
                        ? { ...poll, votes: poll.votes.map((vote, index) => index === action.payload.optionIndex ? vote + 1 : vote) }
                        : poll
                )
            };
        case ADD_POLL:
            return {
                ...state,
                polls: [...state.polls, action.payload]
            };
        case ADD_SUGGESTION:
            return {
                ...state,
                suggestions: [...state.suggestions, action.payload]
            };
        default:
            return state;
    }
}
