const router = require("express").Router();

const e = require("express");
const createError = require("http-errors");
const sequelize = require("sequelize");

const Cart = require("../Models/Cart");
const CartFoodItem = require("../Models/CartFooItem");
const CartTable = require("../Models/CartTable");
const FoodItem = require("../Models/FoodItem");

router.post("/insertCart", async (req, res, next) => {
  try {
    const count = await Cart.count();

    const {
      customerName,
      date,
      itemsInCart,
      orderedPrice,
      totalPrice,
      tax,
      discount,
      paymentMethod,
      deviceId,
      isPaid,
      modeOfDelivery,
    } = req.body;

    const cart = {
      customerName: customerName,
      date: date,
      invoiceNumber: count + 1,
      itemsInCart: itemsInCart,
      orderedPrice: orderedPrice,
      totalPrice: totalPrice,
      tax: tax,
      discount: discount,
      paymmentMethod: paymentMethod,
      isPaid: isPaid,
      deviceId: deviceId,
      modeOfDelivery: modeOfDelivery,
    };
    const result = await Cart.create(cart);
    if (!result)
      throw createError.ExpectationFailed(
        "There have an error when inserting cart"
      );
    res.send({
      success: true,
      cartId: result.id,
      invoiceNumber: result.invoiceNumber,
      error: null,
    });
  } catch (error) {
    res.send({
      success: false,
      cartId: 0,
      invoiceNumber: 0,
      error: error.message,
    });
  }
});

router.post("/insertFoodItem", async (req, res, next) => {
  try {
    const cartFoodItem = {
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
      image: req.body.image,
      qty: req.body.qty,
      date: req.body.date,
      cartId: req.body.cartId,
    };

    // console.log(req.body.qty);
    await FoodItem.increment(
      { orderCount: 1 },
      { where: { name: req.body.name } }
    );

    const result = await CartFoodItem.create(cartFoodItem);
    if (!result)
      throw createError.ExpectationFailed("There have an error when inserting");
    res.send({
      success: true,
      cartItemId: result.id,
      error: null,
    });
  } catch (error) {
    res.send({
      success: false,
      cartItemId: 0,
      error: error.message,
    });
  }
});

router.post("/insertCartTable", async (req, res, next) => {
  try {
    const insertedCartTable = await CartTable.create(req.body);
    if (!insertedCartTable)
      throw createError.ExpectationFailed("Can't insert CartTable");
    res.send({
      success: true,
      cartTableId: insertedCartTable.id,
      error: null,
    });
  } catch (error) {
    // console.log(error);
    res.send({
      success: false,
      cartTableId: 0,
      error: error.message,
    });
  }
});

router.get("/getAll", async (req, res, next) => {
  try {
    const list = await Cart.findAll({
      include: ["cartTables", "cartFoodItems"],
      order: [["invoiceNumber", "DESC"]],
    });
    res.send(list);
  } catch (error) {
    next(error);
  }
});

router.get(
  "/getAllOrderForADeviceIdUnPaid/:deviceId",
  async (req, res, next) => {
    const deviceId = req.params.deviceId;

    if (!deviceId) throw createError.BadRequest("No device id in request");
    try {
      const list = await Cart.findAll({
        where: {
          deviceId: deviceId,
          isPaid: false,
        },
        order: [["id", "DESC"]],
      });
      res.send({
        success: true,
        historyCarts: list,
        error: null,
      });
    } catch (error) {
      res.send({
        success: false,
        historyCarts: [],
        error: error.message,
      });
    }
  }
);

router.get("/getAllOrderForADeviceIdPaid/:deviceId", async (req, res, next) => {
  const deviceId = req.params.deviceId;

  if (!deviceId) throw createError.BadRequest("No device id in request");
  try {
    const list = await Cart.findAll({
      where: {
        deviceId: deviceId,
        isPaid: true,
      },
      order: [["id", "DESC"]],
    });

    // console.log(list);

    res.send({
      success: true,
      historyCarts: list,
      error: null,
    });
  } catch (error) {
    res.send({
      success: false,
      historyCarts: [],
      error: error.message,
    });
  }
});

router.get("/getOne", async (req, res, next) => {
  try {
    const id = req.query.cartId;
    if (!id) throw createError.BadRequest("No id in request");
    const result = await Cart.findByPk(id, {
      include: ["cartFoodItems", "cartTables"],
    });
    res.send({
      success: true,
      soldCart: result,
      error: null,
    });
  } catch (error) {
    res.send({
      success: false,
      soldCart: null,
      error: e.message,
    });
  }
});

router.get("/getOneByInvoiceNumber", async (req, res, next) => {
  try {
    const invoiceNumber = req.query.invoiceNumber;
    if (!invoiceNumber)
      throw createError.BadRequest("No invoiceNumber in request");
    const result = await Cart.findOne({
      where: {
        invoiceNumber: invoiceNumber,
      },
      include: ["cartFoodItems", "cartTables"],
    });
    res.send({
      success: true,
      soldCart: result,
      error: null,
    });
  } catch (error) {
    res.send({
      success: false,
      soldCart: null,
      error: e.message,
    });
  }
});

router.get("/getOneByCustomerName", async (req, res, next) => {
  try {
    const customerName = req.query.customerName;
    if (!customerName)
      throw createError.BadRequest("No invoiceNumber in request");
    const result = await Cart.findAll({
      where: {
        customerName: customerName,
      },
      include: ["cartFoodItems", "cartTables"],
    });
    //console.log(result);
    res.send({
      success: true,
      soldCarts: result,
      error: null,
    });
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      soldCarts: null,
      error: e.message,
    });
  }
});

router.put("/editOneCart", async (req, res, next) => {
  try {
    const serverId = req.query.serverId;

    const customerName = req.body.customerName;
    const itemsInCart = req.body.itemsInCart;
    const orderedPrice = req.body.orderedPrice;
    const totalPrice = req.body.totalPrice;
    const tax = req.body.tax;
    const discount = req.body.discount;
    const paymentMethod = req.body.paymentMethod;
    const deviceId = req.body.deviceId;
    const date = req.body.date;
    const modeOfDelivery = req.body.modeOfDelivery;

    await CartFoodItem.destroy({
      where: {
        cartId: serverId,
      },
    });

    await CartTable.destroy({
      where: {
        cartId: serverId,
      },
    });

    const log = await Cart.update(
      {
        customerName: customerName,
        itemsInCart: itemsInCart,
        orderedPrice: orderedPrice,
        totalPrice: totalPrice,
        tax: tax,
        discount: discount,
        paymentMethod: paymentMethod,
        modeOfDelivery: modeOfDelivery,
      },
      {
        where: {
          id: serverId,
        },
      }
    );
    // console.log(log);
    res.send({
      success: true,
      message: "Updated",
      error: null,
    });
  } catch (error) {
    res.send({
      success: false,
      message: "",
      error: error.message,
    });
  }
});

router.get("/getAllSoldItems", async (req, res, next) => {
  try {
    const list = await CartFoodItem.findAll({
      order: [["id", "DESC"]],
    });
    res.send(list);
  } catch (error) {
    next(error);
  }
});

router.delete("/deleteOne", async (req, res, next) => {
  try {
    await Cart.destroy(
      {
        where: {
          id: 24,
        },
      },
      {
        truncate: true,
        cascade: true,
      }
    );
    res.send("deleted");
  } catch (error) {
    next(error);
  }
});

router.delete("/deleteOneCartFoodItem/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    await CartFoodItem.destroy({
      where: {
        id: id,
      },
    });
    res.send("deleted");
  } catch (error) {
    next(error);
  }
});

router.delete("/deleteTest", async (req, res, next) => {
  try {
    const listOfIds = req.body.listOfIds;
    console.log(listOfIds);
    res.send("test");
  } catch (error) {
    next(error);
  }
});

router.delete("/deleteFoodItemsAndCartTables", async (req, res, next) => {
  try {
    const cartId = req.query.cartId;
    console.log(cartId);

    await CartFoodItem.destroy({
      where: {
        cartId: cartId,
      },
    });

    await CartTable.destroy({
      where: {
        cartId: cartId,
      },
    });

    res.send({
      success: true,
      message: "deleted",
      error: null,
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/deleteCartFoodItems", async (req, res, next) => {
  try {
    const listOfIds = req.body.listOfIds;
    console.log(listOfIds);
    if (!listOfIds)
      throw createError.BadRequest("Not send list of ids of food item");
    const result = await CartFoodItem.destroy({
      where: {
        id: listOfIds,
      },
    });
    console.log(result);
    res.send({
      success: true,
      message: "Deleted Cart Food items",
      error: null,
    });
  } catch (error) {
    res.send({
      success: false,
      message: "",
      error: error.message,
    });
  }
});

router.delete("/deleteCartTables", async (req, res, next) => {
  try {
    const listOfIds = req.body.listOfIds;
    console.log(listOfIds);
    if (!listOfIds)
      throw createError.BadRequest("Not send list of ids of cart table");
    const result = await CartTable.destroy({
      where: {
        id: listOfIds,
      },
    });
    res.send({
      success: true,
      message: "Deleted Cart Tables",
      error: null,
    });
  } catch (error) {
    res.send({
      success: false,
      message: "",
      error: error.message,
    });
  }
});

router.delete("/deleteAll", async (req, res, next) => {
  try {
    await Cart.destroy({
      truncate: true,
      cascade: true,
    });

    res.send("Deleted All");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
