const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const GroupUser = sequelize.define('GroupUser', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
}, {
    tableName: 'group_users',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = GroupUser; 