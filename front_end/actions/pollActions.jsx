export const FETCH_POLLS = 'FETCH_POLLS';
export const VOTE_POLL = 'VOTE_POLL';
export const ADD_POLL = 'ADD_POLL';
export const ADD_SUGGESTION = 'ADD_SUGGESTION'; // New action

export const fetchPolls = () => {
    return {
        type: FETCH_POLLS,
        payload: [
            { id: 1, question: 'Do you support new park development?', options: ['Yes', 'No'], votes: [0, 0], endTime: new Date().getTime() + 60000 },
            // Add more poll data here
        ]
    };
};

export const votePoll = (pollId, optionIndex) => {
    return {
        type: VOTE_POLL,
        payload: { pollId, optionIndex }
    };
};

export const addPoll = (poll) => {
    return {
        type: ADD_POLL,
        payload: poll
    };
};

export const addSuggestion = (suggestion) => {
    return {
        type: ADD_SUGGESTION,
        payload: suggestion
    };
};
