const { Model, DataTypes } = require("sequelize");
const sequelize = require("../Helpers/database");

class Table extends Model{}

Table.init({
    tableName:{
        type:DataTypes.STRING,
        require:true,
        unique:true
    },
    areaName:{
        type:DataTypes.STRING,
        require:true,
    },
    image:{
        type:DataTypes.STRING,
        require:true,
    },
    noOfSeats:{
        type:DataTypes.INTEGER,
        require:true
    },
    occupied:{
        type:DataTypes.INTEGER,
        defaultValue:0
    }
},{
    sequelize,
    modelName:'table',
    timestamps:false
})


module.exports = Table