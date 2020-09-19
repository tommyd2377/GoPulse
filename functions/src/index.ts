import { database } from 'firebase-admin';
import * as functions from 'firebase-functions';

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

export const newUser = functions.auth.user().onCreate((user, context) => {

})

export const getNewArticles = functions.https.onCall((data, context) => {
  let reqType = data.hh
})