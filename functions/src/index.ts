import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
admin.initializeApp();
const db = admin.firestore();

import * as Stripe from 'stripe';
const stripe = new Stripe(functions.config().stripe.secret);

export const createStripeCustomer = functions.auth
  .user()
  .onCreate(async (userRecord, context) => {
    const firebaseUID = userRecord.uid;

    const customer = await stripe.customers.create({
      email: userRecord.email,
      metaData: { firebaseUID }
    });

    const sub = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{plan: 'plan'}]
    })

    return db.doc(`users/${firebaseUID}`).update({
      stripeId: customer.id,
      status: sub.status,
      subId: sub.id
    });
  })