const { Model, DataTypes } = require("sequelize");
const sequelize = require("../Helpers/database");

class Cart extends Model {}

Cart.init(
  {
    customerName: {
      type: DataTypes.STRING,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      require: true,
    },
    invoiceNumber: {
      type: DataTypes.INTEGER,
    },
    itemsInCart: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      require: true,
    },
    orderedPrice: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
      allowNull: false,
      require: true,
    },
    totalPrice: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
    tax: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
    discount: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
    paymentMethod: {
      type: DataTypes.STRING,
      defaultValue: "Cash",
    },
    isPaid: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      require:false
    },
    modeOfDelivery:{
      type:DataTypes.STRING,
      defaultValue:"Take Away",
      require:false
    },
    deviceId: {
      type: DataTypes.STRING,
      allowNull: false,
      require: true,
    },
  },
  {
    sequelize,
    modelName: "cart",
    timestamps: false,
  }
);

module.exports = Cart;
