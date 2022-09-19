const { Model, DataTypes } = require("sequelize");
const sequelize = require("../Helpers/database");

class CartTable extends Model {}

CartTable.init(
  {
    tableName: {
      type: DataTypes.STRING,
      require: true,
    },
    tableId: {
      type: DataTypes.INTEGER,
      require: true,
    },
    image:{
      type:DataTypes.STRING,
    },
    areaId: {
      type: DataTypes.INTEGER,
      require: true,
    },
    areaName: {
      type: DataTypes.STRING,
    },
    noOfSeats: {
      type: DataTypes.INTEGER,
      require: true,
      defaultValue: 4,
    },
    requiredSeats: {
      type: DataTypes.INTEGER,
      require: false,
      defaultValue:0
    },
  },
  {
    sequelize,
    modelName: "cartTable",
    timestamps: false,
  }
);

module.exports = CartTable;
