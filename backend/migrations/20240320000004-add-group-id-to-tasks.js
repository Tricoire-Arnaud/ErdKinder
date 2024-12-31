module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('tasks', 'group_id', {
            type: Sequelize.INTEGER,
            references: {
                model: 'groups',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
            allowNull: true
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('tasks', 'group_id');
    }
}; 