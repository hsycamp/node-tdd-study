const request = require("supertest");
const should = require("should");
const app = require("../../");
const models = require("../../models");

describe("GET /users는", () => {
  const users = [{ name: "alice" }, { name: "bek" }, { name: "chris" }];
  before(() => models.sequelize.sync({ force: true }));
  before(() => models.User.bulkCreate(users));

  describe("성공시", () => {
    it("유저 객체를 담은 배열로 응답한다", async () => {
      const res = await request(app).get("/users");
      res.body.should.be.instanceOf(Array);
    });

    it("최대 limit 갯수만큼 응답한다", async () => {
      const res = await request(app).get("/users?limit=2");
      res.body.should.have.lengthOf(2);
    });
  });
  describe("실패시", () => {
    it("limit이 숫자형이 아니면 400을 응답한다", async () => {
      await request(app).get("/users?limit=two").expect(400);
    });
  });
});

describe("GET /users/:id는", () => {
  const users = [{ name: "alice" }, { name: "bek" }, { name: "chris" }];
  before(() => models.sequelize.sync({ force: true }));
  before(() => models.User.bulkCreate(users));

  describe("성공시", () => {
    it("id가 1인 유저 객체를 반환한다.", async () => {
      const res = await request(app).get("/users/1");
      res.body.should.have.property("id", 1);
    });
  });
  describe("실패시", () => {
    it("id가 숫자가 아닐 경우 400으로 응답한다.", async () => {
      await request(app).get("/users/one").expect(400);
    });
    it("id로 유저를 찾을 수 없을 경우 400으로 응답한다.", async () => {
      await request(app).get("/users/999").expect(404);
    });
  });
});

describe("DELETE /users/:id는", () => {
  const users = [{ name: "alice" }, { name: "bek" }, { name: "chris" }];
  before(() => models.sequelize.sync({ force: true }));
  before(() => models.User.bulkCreate(users));

  describe("성공시", () => {
    it("204를 응답한다", async () => {
      await request(app).delete("/users/1").expect(204);
    });
  });
  describe("실패시", () => {
    it("id가 숫자가 아닐경우 400으로 응답한다", async () => {
      await request(app).delete("/users/one").expect(400);
    });
  });
});

describe("POST /users는", () => {
  const users = [{ name: "alice" }, { name: "bek" }, { name: "chris" }];
  before(() => models.sequelize.sync({ force: true }));
  before(() => models.User.bulkCreate(users));

  describe("성공시", () => {
    let name = "daniel",
      body;
    before(async () => {
      const res = await request(app).post("/users").send({ name }).expect(201);
      body = res.body;
    });
    it("생성된 유저 객체를 반환한다", () => {
      body.should.have.property("id");
    });
    it("입력한 name을 반환한다", () => {
      body.should.have.property("name", name);
    });
  });
  describe("실패시", () => {
    it("name 파라매터 누락시 400을 반환한다", async () => {
      await request(app).post("/users").send({}).expect(400);
    });
    it("name이 중복일 경우 409를 반환한다", async () => {
      await request(app).post("/users").send({ name: "daniel" }).expect(409);
    });
  });
});

describe("PUT /users/:id는", () => {
  const users = [{ name: "alice" }, { name: "bek" }, { name: "chris" }];
  before(() => models.sequelize.sync({ force: true }));
  before(() => models.User.bulkCreate(users));

  describe("성공시", () => {
    it("변경된 name을 응답한다", async () => {
      const name = "chally";
      const res = await request(app).put("/users/3").send({ name });
      res.body.should.have.property("name", name);
    });
  });
  describe("실패시", () => {
    it("정수가 아닌 id일 경우 400을 응답한다", async () => {
      await request(app).put("/users/one").expect(400);
    });
    it("name이 없을 경우 400을 응답한다", async () => {
      await request(app).put("/users/1").send({}).expect(400);
    });
    it("없는 유저일 경우 404를 응답한다", async () => {
      await request(app).put("/users/999").send({ name: "foo" }).expect(404);
    });
    it("이름이 중복일 경우 409를 응답한다", async () => {
      await request(app).put("/users/3").send({ name: "bek" }).expect(409);
    });
  });
});
