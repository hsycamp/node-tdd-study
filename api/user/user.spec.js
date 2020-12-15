const request = require("supertest");
const chai = require("chai");
const app = require("../../");
const models = require("../../models");
const expect = chai.expect;

describe("GET /users는", () => {
  const users = [{ name: "alice" }, { name: "bek" }, { name: "chris" }];
  before(() => models.sequelize.sync({ force: true }));
  before(() => models.User.bulkCreate(users));

  describe("성공시", () => {
    it("유저 객체를 담은 배열로 응답한다", async () => {
      const res = await request(app).get("/users");
      expect(res.body).to.be.an("array");
    });

    it("최대 limit 갯수만큼 응답한다", async () => {
      const res = await request(app).get("/users?limit=2");
      expect(res.body).to.have.lengthOf(2);
    });
  });
  describe("실패시", () => {
    it("limit이 숫자형이 아니면 400을 응답한다", async () => {
      const res = await request(app).get("/users?limit=two");
      expect(res.status).to.eql(400);
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
      expect(res.body).to.have.property("id", 1);
    });
  });
  describe("실패시", () => {
    it("id가 숫자가 아닐 경우 400으로 응답한다.", async () => {
      const res = await request(app).get("/users/one");
      expect(res.status).to.eql(400);
    });
    it("id로 유저를 찾을 수 없을 경우 400으로 응답한다.", async () => {
      const res = await request(app).get("/users/999");
      expect(res.status).to.eql(404);
    });
  });
});

describe("DELETE /users/:id는", () => {
  const users = [{ name: "alice" }, { name: "bek" }, { name: "chris" }];
  before(() => models.sequelize.sync({ force: true }));
  before(() => models.User.bulkCreate(users));

  describe("성공시", () => {
    it("204를 응답한다", async () => {
      const res = await request(app).delete("/users/1");
      expect(res.status).to.eql(204);
    });
  });
  describe("실패시", () => {
    it("id가 숫자가 아닐경우 400으로 응답한다", async () => {
      const res = await request(app).delete("/users/one");
      expect(res.status).to.eql(400);
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
      const res = await request(app).post("/users").send({ name });
      expect(res.status).to.eql(201);
      body = res.body;
    });
    it("생성된 유저 객체를 반환한다", () => {
      expect(body).to.have.property("id");
    });
    it("입력한 name을 반환한다", () => {
      expect(body).to.have.property("name", name);
    });
  });
  describe("실패시", () => {
    it("name 파라매터 누락시 400을 반환한다", async () => {
      const res = await request(app).post("/users").send({});
      expect(res.status).to.eql(400);
    });
    it("name이 중복일 경우 409를 반환한다", async () => {
      const res = await request(app).post("/users").send({ name: "daniel" });
      expect(res.status).to.eql(409);
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
      expect(res.body).to.have.property("name", name);
    });
  });
  describe("실패시", () => {
    it("정수가 아닌 id일 경우 400을 응답한다", async () => {
      const res = await request(app).put("/users/one");
      expect(res.status).to.eql(400);
    });
    it("name이 없을 경우 400을 응답한다", async () => {
      const res = await request(app).put("/users/1").send({});
      expect(res.status).to.eql(400);
    });
    it("없는 유저일 경우 404를 응답한다", async () => {
      const res = await request(app).put("/users/999").send({ name: "foo" });
      expect(res.status).to.eql(404);
    });
    it("이름이 중복일 경우 409를 응답한다", async () => {
      const res = await request(app).put("/users/3").send({ name: "bek" });
      expect(res.status).to.eql(409);
    });
  });
});
