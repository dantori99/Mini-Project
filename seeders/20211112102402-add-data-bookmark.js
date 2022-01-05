'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        for (let i = 1; i <= 10; i++) {
            await queryInterface.bulkInsert('bookmarks', [
                {
                    id_user: Math.floor(Math.random() * 10) + 1,
                    id_event: Math.floor(Math.random() * 10) + 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }
            ], {});
        }
    },

    down: async (queryInterface, Sequelize) => {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * 
         */
        await queryInterface.bulkDelete('bookmarks', null, {});
    }
};
