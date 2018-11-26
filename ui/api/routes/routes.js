const faker = require("faker");

const appRouter = app => {
  app.get("/", (req, res) => {
    res.status(200).send({ message: "This is the base of the REST API" });
  });

  app.get("/user/:id?", (req, res) => {
    const id = parseInt(req.params.id);

    if (isFinite(id) && id > 0) {
      faker.seed(id);
    } else {
      faker.seed(123);
    }
    const user = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      username: faker.internet.userName(),
      email: faker.internet.email()
    };
    res.status(200).send({ data: [user] });
  });

  app.get("/users/:num", (req, res) => {
    const users = [];
    const num = parseInt(req.params.num);

    if (isFinite(num) && num > 0) {
      for (i = 0; i <= num - 1; i++) {
        users.push({
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          username: faker.internet.userName(),
          email: faker.internet.email()
        });
      }

      res.status(200).send({ data: users });
    } else {
      res.status(400).send({ message: "invalid number supplied" });
    }
  });
};

module.exports = appRouter;
