const Faker = require('faker');

function generateRandomId(userContext, events, done) {
  const id = Faker.random.number(10000000000);
  userContext.vars.id = id;
  return done();
}


module.exports = {
  generateRandomId,
};
