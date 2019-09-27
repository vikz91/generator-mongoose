const debug = require('debug')('App:Plugin:Payment');
const uuidv4 = require('uuid/v4');
const _ = require('lodash');

const API = {};

API.Config = {};
API.sharedConfig = {};
API.productConfig = {};
API.sdk = {};
API.Charges = {};
API.Orders = {};
API.Skus = {};

API.Init = async (Config, sharedConfig, productConfig) => {
  API.sharedConfig = sharedConfig;
  API.Config = Config;
  API.productConfig = productConfig;

  API.sdk = require('stripe')(Config.secret);
};

// Sugar-coated process.
// API.QuickPay = async (user, token, amount, description) => {
//   const charge = await API.sdk.charges.create({
//     amount: amount * API.sharedConfig.multiplier,
//     currency: API.sharedConfig.currency,
//     source: token,
//     description: description || `Charged ${API.sharedConfig.currency} ${amount * API.sharedConfig.multiplier} by Stripe`,
//     receipt_email: user.email
//   }, {
//     idempotency_key: uuidv4()
//   });

//   return _.pick(charge, ['id', 'amount', 'balance_transaction', 'charge', 'receipt_email', 'receipt_url', 'status']);
// };

/**
 * Do upfront payment
 *  Step 1. Create unpaid order
 *  Step 2. Pay for the order
 *  */
API.QuickPay = async (orderBody, token) => {
  console.log(token);
  const orderUnpaid = await API.Orders.CreateOrder(orderBody);
  return await API.Orders.PayOrder(orderUnpaid, token);
};

// #============== Charges API ===================#

API.Charges.GetCharge = async (chargeId) => {
  const charge = await API.sdk.charges.retrieve(chargeId);
  return _.pick(charge, ['id', 'receipt_url', 'receipt_email', 'amount', 'status']);
};

// #============== Orders API ===================#

API.Orders.CreateOrder = async (orderBody) => {
  const orderUnpaid = await API.sdk.orders.create(orderBody);
  return _.pick(orderUnpaid, ['id', 'amount', 'items', 'charge', 'status', 'customer', 'email']);
};

API.Orders.PayOrder = async (order, token) => {
  console.log(order.id, order.email, token);
  const orderPaid = await API.sdk.orders.pay(order.id, {
    // customer: order.customer,
    source: token, // source should correspond the customer Id provided
    email: order.email
  }, {
    idempotency_key: uuidv4()
  });
  return _.pick(orderPaid, ['id', 'amount', 'items', 'charge', 'status', 'customer']);
};

API.Orders.GetOrder = async (orderId) => {
  return await API.sdk.orders.retrieve(orderId);
};

// #============== Products API ===================#

API.Skus.GetSku = async (skuId) => {
  const sku = await API.sdk.skus.retrieve(skuId);
  return _.pick(sku, ['id', 'product', 'price', 'currency', 'active']);
};

module.exports = API;
