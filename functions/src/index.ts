import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

const stripe = require('stripe')(functions.config().stripe.secret);

export const createStripeCustomer = functions.auth
  .user().onCreate(async (userRecord) => {
    const firebaseUID = userRecord.uid;

    const customer = await stripe.customers.create({
      email: userRecord.email,
      metadata: {
        firebaseUID: firebaseUID,
      }
    });

    const sub = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{
        price: 'gopulse',
      }],
      collection_method: 'send_invoice',
      days_until_due: 30,
    })

    return db.doc("customers/" + firebaseUID).update({
      stripeId: customer.id,
      status: sub.status,
      subId: sub.id
    });
  });

  export const onUserDeleted = functions.auth.user().onDelete(async (user) => {
    
    const customer = ( await db.collection('customers').doc(user.uid).get()).data();
    
      if (customer) {
        await stripe.customers.del(customer.stripeId);
      }

    return db.doc("customers/" + user.uid).delete();
  });