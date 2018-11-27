const faker = require("faker");

const redis = require("redis");
const { promisify } = require("util");

const { REDIS_HOST } = process.env;

const appRouter = app => {
  app.get("/api/", async (req, res) => {
    try {
      const client = redis.createClient({
        host: REDIS_HOST,
        retry_strategy: options => new Error("Fail")
      });

      const getAsync = promisify(client.get).bind(client);
      const message = await getAsync("messagekey");

      res.status(200).send({ message });
    } catch (err) {
      console.error(err);
      res.status(200).send({ message: "No redis" });
    }
  });

  app.get("/api/user/:id?", (req, res) => {
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

  app.get("/api/users/:num", (req, res) => {
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
