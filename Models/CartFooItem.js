const { Model, DataTypes } = require("sequelize");
const sequelize = require("../Helpers/database");

class CartFoodItem extends Model {}

CartFoodItem.init({
  name: {
    type: DataTypes.STRING,
    require:true,
    allowNull:false
  },
  price: {
    type: DataTypes.FLOAT,
    require:true,
    allowNull:false
   
  },
  category: {
    type: DataTypes.STRING,
    defaultValue:"All",
    allowNull:false,
    require:true
   
  },
  image: {
    type: DataTypes.STRING,
   
  },
  qty: {
    type: DataTypes.INTEGER,
    defaultValue:1,
    allowNull:false
   
  },
  date:{
    type:DataTypes.DATE,
    allowNull:false,
    require:true
  }
  
},{
    sequelize,
    modelName:'cartFoodItem',
    timestamps:false
});

module.exports = CartFoodItem;
