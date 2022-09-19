const express = require("express");
const createError = require("http-errors");
const morgan = require("morgan");
//const { Json } = require("sequelize/types/utils");
const sequelize = require("./Helpers/database");
require("dotenv").config();

const Cart = require("./Models/Cart");
const CartFoodItem = require("./Models/CartFooItem");
const CartTable = require("./Models/CartTable");

const Area = require("./Models/Area");
const Table = require("./Models/Table");

Cart.hasMany(CartFoodItem, { as: "cartFoodItems"});
Cart.hasMany(CartTable,{as:"cartTables"})
CartFoodItem.belongsTo(Cart, {
  foreignKey: "cartId",
  targetKey: "id",
  as: "cart",
});

CartTable.belongsTo(Cart,{
  foreignKey:"cartId",
  targetKey:"id",
  as:"cart" 
})


Area.hasMany(Table, { as: "tables" });
Table.belongsTo(Area, {
  foreignKey:"areaId",
  targetKey:"id",
  as:"area",
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

app.use(express.static("public"));
app.use("/images", express.static("images"));
app.set("view engine", "ejs");

sequelize.sync({ force: true}).then(
  () => {
    console.log("db is ready");
  },
  (error) => {
    console.log(error);
  }
);

app.get("/", async (req, res, next) => {
  res.send({ message: "GulfAppDeveloper", success: true, error: null });
});

app.post("/test", async (req, res, next) => {
  try {
    const list = req.body.person;
    console.log(list);
    for (var i in list) {
      console.log(list[i].name);
    }
    list.array.forEach((element) => {});
  } catch (error) {
    console.log(error.message);
  }

  res.send("My test");
});

app.use("/admin", require("./routes/admin"));

app.use("/auth", require("./routes/auth.route"));
app.use("/itemsForSaleList", require("./routes/itemsForSale.route"));
app.use("/cart", require("./routes/cart.route"));

app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.send({
    success: false,
    message: null,
    error: err.message,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));
