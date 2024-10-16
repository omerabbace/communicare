// forumReducer.js
import {
    FETCH_FORUM_POSTS,
    ADD_FORUM_POST,
    ADD_COMMENT,
    DELETE_COMMENT,
    ADD_REPLY,
    UPDATE_PROFILE_PHOTO_IN_COMMENTS,
  } from '../actions/forumActions';
  
  const initialState = {};
  
  const forumReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_FORUM_POSTS:
        return {
          ...state,
          [action.payload]: state[action.payload] || [],
        };
      case ADD_FORUM_POST:
        const { issueId, content, email, profilePhoto, date } = action.payload;
        return {
          ...state,
          [issueId]: [
            ...state[issueId],
            { id: new Date().getTime(), content, email, profilePhoto, date, replies: [] },
          ],
        };
      case DELETE_COMMENT:
        return {
          ...state,
          [action.payload.category]: state[action.payload.category].filter(
            (comment) => comment.id !== action.payload.commentId
          ),
        };
      case ADD_REPLY:
        return {
          ...state,
          [action.payload.category]: state[action.payload.category].map((comment) =>
            comment.id === action.payload.commentId
              ? {
                  ...comment,
                  replies: [
                    ...comment.replies,
                    { content: action.payload.reply, email: action.payload.email, profilePhoto: action.payload.profilePhoto, date: action.payload.date },
                  ],
                }
              : comment
          ),
        };
      case UPDATE_PROFILE_PHOTO_IN_COMMENTS:
        return {
          ...state,
          [action.payload.category]: state[action.payload.category].map((comment) => ({
            ...comment,
            profilePhoto: action.payload.profilePhoto,
            replies: comment.replies.map((reply) => ({
              ...reply,
              profilePhoto: action.payload.profilePhoto,
            })),
          })),
        };
      default:
        return state;
    }
  };
  
  export default forumReducer;
  