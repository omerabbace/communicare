// firebase.js
const admin = require('firebase-admin');

const serviceAccount = require('./keys/serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://communi-care-589c5-default-rtdb.firebaseio.com'
});

const db = admin.database();
module.exports = {db};
