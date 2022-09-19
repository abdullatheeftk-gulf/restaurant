const {Model,DataTypes} = require('sequelize');
const sequelize = require('../Helpers/database');

class User extends Model {}

User.init({
    deviceId:{
        type:DataTypes.STRING,
        require:true
    },
    userName:{
        type:DataTypes.STRING,
        require:true
    },
    password:{
        type:DataTypes.STRING,
        require:true
    }
},{
    sequelize,
    modelName:'user',
    timestamps:false
});

module.exports = User;