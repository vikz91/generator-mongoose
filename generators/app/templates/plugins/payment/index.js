const debug = require('debug')('App:Plugin');
const API = {};

API.Config = {};
API.provider = {};

API.Init = async (Config) => {
  API.Config = Config;
  API.UseSystem(Config.defaultSystem);

  debug('Loading Plugin : Payment');
};

API.UseSystem = (system) => {
  API.provider = require('./' + system);

  return API.provider.Init(API.Config.systems[system], API.Config.shared, API.Config.products);
};

/**
 * Do upfront payment using order info
 * TO DO LATER: Add tax, discount as items in the order
 *  */
API.QuickPay = async (packageName, email, currency, token, couponId = null) => {
  // Add package as sku
  var items = [{
    type: 'sku',
    parent: API.provider.productConfig[packageName]
  }];
  var orderBody = new API.Order(items, email, currency, couponId);
  console.log(orderBody, token);
  const order = await API.provider.QuickPay(orderBody, token);
  console.log(order);
  return API.provider.Charges.GetCharge(order.charge);
};

/**
 * Payment after delivery
 * Step 1: Creates an unpaid order
 * Step 2: Payment for the order using order ID
 *  */
API.CreateOrder = async (packageName, email, currency, customerId, couponId = null) => {
  const items = [{
    type: 'sku',
    parent: API.provider.productConfig[packageName]
  }];
  var order = new API.Order(items, email, currency, customerId, couponId);
  return API.provider.Orders.CreateOrder(order);
};

API.PayAfterDelivery = async (orderId, token) => {
  const order = await API.provider.Orders.GetOrder(orderId);
  console.log(order);
  const orderPaid = API.provider.Orders.PayOrder(order, token);
  return API.provider.Charges.GetCharge(orderPaid.charge);
};

// to be done later
API.RefundOrder = async () => {
  //
};
API.CouponValidation = async () => {
  //
};

// MODELS
API.Order = class {
  constructor (items, email, currency, couponId, customerId) {
    this.items = items || [];
    this.email = email || null;
    this.currency = currency || 'usd';
    // this.customer = customerId || null;
    // this.coupon = couponId || null;
  }
};

module.exports = API;
