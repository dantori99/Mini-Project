'use strict';
const faker = require('faker');
module.exports = {
    up: async (queryInterface, Sequelize) => {
        for (let i = 0; i <= 10; i++) {
            await queryInterface.bulkInsert('comments', [
                {
                    id_user: Math.floor((Math.random() * 10) + 1),
                    id_event: Math.floor((Math.random() * 10) + 1),
                    comment: faker.lorem.sentence(),
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
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete('comments', null, {});
    }
};
