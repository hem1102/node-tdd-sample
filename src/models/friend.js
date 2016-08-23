'use strict';
//1.透過 sequelize 設置 friend model : name,facebookId,email (model define)
module.exports = (sequelize, DataTypes) => {
  var Friend = sequelize.define('Friend', {
    name: DataTypes.STRING,
    //facebookId: DataTypes.STRING,
    email: DataTypes.STRING,
  }, {
    classMethods: {
      associate: (models) => {
      }
    }
  });

  return Friend;
};
