const { Model, DataTypes } = require("sequelize");
const sequelize = require("../Helpers/database");

class FoodItem extends Model {}

FoodItem.init({
  name: {
    type: DataTypes.STRING,
    require:true,
    allowNull:false,
    unique:true
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


  itemTax:{
    type:DataTypes.FLOAT,
    defaultValue:0
  },
  isAvailable:{
      type:DataTypes.BOOLEAN,
      defaultValue:true
  },
  availableQuantity:{
      type:DataTypes.INTEGER,
      require:false,
      defaultValue:1
  },
  isItSpecial:{
      type:DataTypes.BOOLEAN,
      require:false,
      defaultValue:false
  },
  favorite:{
    type:DataTypes.BOOLEAN,
    defaultValue:false,
  },
  menuCardNumber:{
    type:DataTypes.INTEGER,
    require:true,
    unique:true
  },


  orderCount: {
    type: DataTypes.INTEGER,
    defaultValue:0,
    allowNull:false
   
  },
  date:{
    type:DataTypes.DATE,
    allowNull:false,
    require:true
  }
  
},{
    sequelize,
    modelName:'foodItem',
    timestamps:false
});

module.exports = FoodItem;
