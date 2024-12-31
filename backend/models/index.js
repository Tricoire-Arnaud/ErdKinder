const sequelize = require("../config/sequelize");
const User = require("./User");
const Task = require("./Task");
const Group = require("./Group");
const GroupUser = require("./GroupUser");
const Article = require("./Article");

// Configuration globale pour tous les modèles
const models = [User, Task, Group, GroupUser, Article];

models.forEach((model) => {
  if (model.init) {
    model.init(
      {
        ...model.rawAttributes,
      },
      {
        ...model.options,
        sequelize,
        underscored: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
      }
    );
  }
});

// Associations
User.belongsToMany(Group, {
  through: GroupUser,
  foreignKey: "user_id",
  otherKey: "group_id",
  as: "groups",
});

Group.belongsToMany(User, {
  through: GroupUser,
  foreignKey: "group_id",
  otherKey: "user_id",
  as: "members",
});

Task.belongsTo(User, { as: "assignedUser", foreignKey: "assigned_to_id" });
Task.belongsTo(User, { as: "createdByUser", foreignKey: "created_by_id" });
Task.belongsTo(Group, { as: "group", foreignKey: "group_id" });
Group.hasMany(Task, { as: "tasks", foreignKey: "group_id" });

Article.belongsTo(User, {
  as: "author",
  foreignKey: "author_id",
});

User.hasMany(Article, {
  as: "articles",
  foreignKey: "author_id",
});

module.exports = {
  sequelize,
  User,
  Task,
  Group,
  GroupUser,
  Article,
};
