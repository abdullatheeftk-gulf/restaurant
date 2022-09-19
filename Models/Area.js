const { Model, DataTypes } = require("sequelize");
const sequelize = require("../Helpers/database");

class Area extends Model{}

Area.init({
    areaName:{
        type:DataTypes.STRING,
        require:true,
        unique:true
    },
    specialization:{
        type:DataTypes.STRING,
    },
    specialCharge:{
        type:DataTypes.FLOAT,
        defaultValue:0.0
    }
},{
    sequelize,
    modelName:'area',
    timestamps:false
})


module.exports = Area