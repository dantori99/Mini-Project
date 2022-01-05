'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {

        await queryInterface.bulkInsert('categories', [
            {
                name: 'Photography',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Design',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Development',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Marketing',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Business',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Lifestyle',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Music',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Others',
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        ], {});
    },

    down: async (queryInterface, Sequelize) => {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete('categories', null, {});
    }
};
