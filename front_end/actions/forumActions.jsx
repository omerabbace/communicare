// forumActions.js
export const FETCH_FORUM_POSTS = 'FETCH_FORUM_POSTS';
export const ADD_FORUM_POST = 'ADD_FORUM_POST';
export const ADD_COMMENT = 'ADD_COMMENT';
export const DELETE_COMMENT = 'DELETE_COMMENT';
export const ADD_REPLY = 'ADD_REPLY';
export const UPDATE_PROFILE_PHOTO_IN_COMMENTS = 'UPDATE_PROFILE_PHOTO_IN_COMMENTS';

export const fetchForumPosts = (issueId) => ({
  type: FETCH_FORUM_POSTS,
  payload: issueId,
});

export const addForumPost = (issueId, content, email, profilePhoto) => ({
  type: ADD_FORUM_POST,
  payload: { issueId, content, email, profilePhoto, date: new Date().toLocaleString() },
});

export const addComment = (category, comment) => ({
  type: ADD_COMMENT,
  payload: { category, comment },
});

export const deleteComment = (category, commentId) => ({
  type: DELETE_COMMENT,
  payload: { category, commentId },
});

export const addReply = (category, commentId, reply, email, profilePhoto) => ({
  type: ADD_REPLY,
  payload: { category, commentId, reply, email, profilePhoto, date: new Date().toLocaleString() },
});

export const updateProfilePhotoInComments = (category, profilePhoto) => ({
  type: UPDATE_PROFILE_PHOTO_IN_COMMENTS,
  payload: { category, profilePhoto },
});
