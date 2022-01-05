const request = require("supertest");
const app = require("../index");
const { user, sequelize } = require("../models");
const { queryInterface } = sequelize;
const { encrypt, decrypt, verifyToken, createToken } = require("../utils");

const hashedPass = encrypt("testTest123*");
console.log(hashedPass, "<<<<< HASHED");

beforeAll(async () => { });

// afterAll(async () => {
//   await queryInterface.bulkDelete("users");
// });

describe("Register", () => {
    test("Register success", (done) => {
        request(app)
            .post("/user/register")
            .send({
                firstName: "Daniel",
                lastName: "Doe",
                email: "daniels1@mail.com",
                password: hashedPass,
            })
            .end((err, res) => {
                if (err) {
                    done(err);
                }

                const { body, status } = res;
                console.log(body, "<<<<< BODY");
                expect(status).toBe(201);
                expect(body).toHaveProperty("data");
                expect(body.data).toHaveProperty("firstName", "Daniel");
                expect(body.data).toHaveProperty("lastName", "Doe");
                expect(body.data).toHaveProperty("email", "daniels1@mail.com");
                done();
            });
    });
    // apabila firstName kosong/null
    test("Register not success", (done) => {
        request(app)
            .post("/user/register")
            .send({
                firstName: "",
                lastName: "Doe",
                email: "daniels1@mail.com",
                password: hashedPass,
            })
            .end((err, res) => {
                if (err) {
                    done(err);
                }

                const { body, status } = res;
                console.log(body, "<<<<< BODY");
                expect(status).toBe(400);
                done();
            });
    });
    // apabila email tidak sesuai dengan kaidah email yang benar
    test("Register not success", (done) => {
        request(app)
            .post("/user/register")
            .send({
                firstName: "Daniel",
                lastName: "Doe",
                email: "daniels1@mail.haha",
                password: hashedPass,
            })
            .end((err, res) => {
                if (err) {
                    done(err);
                }

                const { body, status } = res;
                console.log(body, "<<<<< BODY");
                expect(status).toBe(400);
                done();
            });
    });
    // apabila password tidak mengandung salah satu dari :
    // 1. huruf kecil
    // 2. huruf kapital
    // 3. special character
    // 4. angka
    test("Register not success", (done) => {
        const wrongPass = encrypt("123456");
        request(app)
            .post("/user/register")
            .send({
                firstName: "Daniel",
                lastName: "Doe",
                email: "daniels1@mail.haha",
                password: wrongPass,
            })
            .end((err, res) => {
                if (err) {
                    done(err);
                }

                const { body, status } = res;
                console.log(body, "<<<<< BODY");
                expect(status).toBe(400);
                done();
            });
    });
});
