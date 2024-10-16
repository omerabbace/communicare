import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert,
  Image, KeyboardAvoidingView, Platform, Keyboard
} from 'react-native';
import { getDatabase, ref, onValue, push, set, update } from 'firebase/database';
import { AuthContext } from '../helpers/Auth'; 
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons'; // For icons like arrows

const ForumDiscussion = ({ route }) => {
  const { userSession, sessionLoaded } = useContext(AuthContext);
  const { category, categoryName } = route.params;
  const isVolunteer = userSession?.role === 'volunteer';
  const db = getDatabase();

  const [messages, setMessages] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [showReplies, setShowReplies] = useState({});
  const flatListRef = useRef(null);

  useEffect(() => {
    const messagesRef = ref(db, `forumMessages/${category}`);
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      const messageList = data ? Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      })) : [];
      setMessages(messageList);
    });
  }, [category]);

  const handleAddCommentOrReply = () => {
    if (!sessionLoaded) {
      Alert.alert('Loading', 'Please wait while your session is being validated.');
      return;
    }

    if (!userSession || !userSession._id) {
      Alert.alert('Error', 'You need to be logged in to add a comment.');
      return;
    }

    if (newComment.trim()) {
      if (replyingTo) {
        // Add a reply to a specific comment
        const repliesRef = ref(db, `forumMessages/${category}/${replyingTo}/replies`);
        const newReplyRef = push(repliesRef);
        const reply = {
          content: newComment,
          email: userSession.email,
          userId: userSession._id,
          timestamp: new Date().toLocaleString(),
          deleted: false,
        };

        set(newReplyRef, reply)
          .then(() => {
            setNewComment('');
            setReplyingTo(null); // Clear the replying state
          })
          .catch((error) => {
            console.error('Error adding reply:', error);
            Alert.alert('Error', 'Failed to add the reply.');
          });
      } else {
        // Add a new comment
        const messageRef = ref(db, `forumMessages/${category}`);
        const newMessageRef = push(messageRef);
        const newMessage = {
          content: newComment,
          email: userSession.email,
          userId: userSession._id,
          timestamp: new Date().toLocaleString(),
          replies: {},  // Default empty replies object
          deleted: false,
          deletedByVolunteer: false,
        };

        set(newMessageRef, newMessage)
          .then(() => {
            setNewComment('');
            flatListRef.current?.scrollToEnd({ animated: true }); // Scroll to the latest comment
          })
          .catch((error) => {
            console.error('Error adding message:', error);
            Alert.alert('Error', 'Failed to add the comment.');
          });
      }
    } else {
      Alert.alert('Error', 'Comment cannot be empty.');
    }
  };

  const handleDeleteComment = (messageId, messageUserId) => {
    if (userSession._id === messageUserId || isVolunteer) {
      const messageRef = ref(db, `forumMessages/${category}/${messageId}`);
      const updateData = isVolunteer
        ? { deleted: true, deletedByVolunteer: true }
        : { deleted: true };
      update(messageRef, updateData);
    } else {
      Alert.alert('Error', 'You cannot delete this message');
    }
  };

  const handleDeleteReply = (messageId, replyId) => {
    const replyRef = ref(db, `forumMessages/${category}/${messageId}/replies/${replyId}`);
    update(replyRef, { deleted: true })
      .catch((error) => {
        console.error('Error deleting reply:', error);
        Alert.alert('Error', 'Failed to delete the reply.');
      });
  };

  const handleReply = (messageId) => {
    setReplyingTo(messageId);
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  const toggleReplies = (messageId) => {
    setShowReplies((prevState) => ({
      ...prevState,
      [messageId]: !prevState[messageId],
    }));
  };

  const renderRightActions = (messageId, messageUserId) => (
    <View style={styles.swipeButtonsContainer}>
      <TouchableOpacity onPress={() => handleReply(messageId)}>
        <View style={styles.replyButton}>
          <Text style={styles.replyButtonText}>Reply</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDeleteComment(messageId, messageUserId)}>
        <View style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderRightActionsForReplies = (messageId, replyId) => (
    <TouchableOpacity onPress={() => handleDeleteReply(messageId, replyId)}>
      <View style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </View>
    </TouchableOpacity>
  );

  const renderReplies = (replies, messageId) => {
    return Object.keys(replies || {}).map((key) => {
      const reply = replies[key];
      return (
        <Swipeable
          key={key}
          renderRightActions={() => renderRightActionsForReplies(messageId, key)}
        >
          <View style={styles.replyContainer}>
            {reply.deleted ? (
              <Text style={styles.deletedText}>Reply deleted</Text>
            ) : (
              <>
                <Text style={styles.replyText}>{reply.content}</Text>
                <Text style={styles.replyEmail}>{reply.email}</Text>
                <Text style={styles.replyDate}>{reply.timestamp}</Text>
              </>
            )}
          </View>
        </Swipeable>
      );
    });
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 60}
        style={{ flex: 1 }}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{categoryName}</Text>
        </View>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Swipeable renderRightActions={() => renderRightActions(item.id, item.userId)}>
              <View style={styles.commentContainer}>
                <Image source={{ uri: item.profilePhoto || '../assets/img/profile.png' }} style={styles.profilePhoto} />
                <View style={styles.commentContent}>
                  {item.deleted ? (
                    <Text style={styles.deletedText}>
                      {item.deletedByVolunteer ? 'Message deleted by a volunteer' : 'Message deleted by the user'}
                    </Text>
                  ) : (
                    <>
                      <Text style={styles.commentText}>{item.content}</Text>
                      <Text style={styles.commentEmail}>{item.email}</Text>
                      <Text style={styles.commentDate}>{item.timestamp}</Text>
                      {Object.keys(item.replies || {}).length > 0 && (
                        <TouchableOpacity onPress={() => toggleReplies(item.id)}>
                          <Icon
                            name={showReplies[item.id] ? 'chevron-up-outline' : 'chevron-down-outline'}
                            size={20}
                            color='#007BFF'
                          />
                        </TouchableOpacity>
                      )}
                      {showReplies[item.id] && (
                        <View>
                          {renderReplies(item.replies, item.id)}
                        </View>
                      )}
                    </>
                  )}
                </View>
              </View>
            </Swipeable>
          )}
        />
        {replyingTo && (
          <View style={styles.replyingToContainer}>
            <Text style={styles.replyingToText}>Replying to comment...</Text>
            <TouchableOpacity onPress={() => setReplyingTo(null)}>
              <Icon name="close-outline" size={20} color="red" />
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={replyingTo ? "Type your reply" : "Add a comment"}
            value={newComment}
            onChangeText={setNewComment}
            multiline={true}
            numberOfLines={4}
            placeholderTextColor="#666"
            returnKeyType="send"
            onSubmitEditing={handleAddCommentOrReply}
          />
          <TouchableOpacity style={styles.button} onPress={handleAddCommentOrReply}>
            <Text style={styles.buttonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  titleContainer: {
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    marginBottom: 18,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#f8f8f8',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 20,
    fontSize: 16,
    color: '#333',
  },
  button: {
    padding: 10,
    backgroundColor: '#aa18ea',
    borderRadius: 50,
    marginLeft: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  commentContainer: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
    flexDirection: 'row',
  },
  commentContent: {
    marginLeft: 10,
    flex: 1,
  },
  commentText: {
    fontSize: 16,
    marginBottom: 5,
  },
  commentEmail: {
    fontSize: 12,
    color: '#555',
  },
  commentDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
  },
  toggleRepliesText: {
    color: '#007BFF',
    marginBottom: 10,
  },
  replyContainer: {
    marginLeft: 20,
    marginBottom: 10,
    flexDirection: 'column',
  },
  replyText: {
    fontSize: 14,
    marginBottom: 5,
  },
  replyEmail: {
    fontSize: 12,
    color: '#555',
    marginBottom: 5,
  },
  replyDate: {
    fontSize: 12,
    color: '#999',
  },
  deleteReplyText: {
    color: '#ff0000',
    marginLeft: 10,
    fontSize: 12,
  },
  profilePhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  swipeButtonsContainer: {
    flexDirection: 'row',
  },
  replyButton: {
    padding: 10,
    backgroundColor: '#aa18ea',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
  },
  replyButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  deleteButton: {
    padding: 10,
    backgroundColor: '#f44336',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  replyingToContainer: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  replyingToText: {
    fontSize: 14,
    color: '#333',
  },
});

export default ForumDiscussion;
