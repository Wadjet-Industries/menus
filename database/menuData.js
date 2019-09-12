/* eslint-disable no-plusplus */
const faker = require('faker');
const Chance = require('chance');

const chance = Chance();

const mealOptions = ['Dinner', 'Brunch', 'Lunch'];

const foodCategories = ['Appetizers', 'Sides', 'Main', 'Desserts', 'Drinks'];

// removed id parameter
const createMenu = (id) => {
  const rngArr = (array, max) => chance.pickset(array, chance.integer({ min: 2, max }));
  const rng = () => chance.integer({ min: 2, max: 5 });
  const createDish = () => {
    const name = faker.lorem.word(); // this was not here
    const desc = faker.lorem.sentence();
    const dish = {
      name,
      desc,
      price: chance.floating({ min: 5, max: 200, fixed: 2 }),
    };
    return dish;
  };

  const createCategory = () => {
    // this was an an object
    const category = [];
    const rando = rng();
    for (let i = 0; i < rando; i++) {
      // originally created dishname here
      // const dishName = faker.lorem.word();
      category.push(createDish()); // this originally set the key value pair of category object
    }
    return category;
  };

  const createMeal = () => {
    const meal = [];
    const categories = rngArr(foodCategories, foodCategories.length);

    for (let i = 0; i < categories.length; i++) {
      meal.push({
        name: categories[i],
        dishes: createCategory(),
      });
    }
    return meal;
  };

  const createAMenu = () => {
    const menu = {
      id,
      mealOptions: [],
    };
    const meals = rngArr(mealOptions, mealOptions.length);
    for (let i = 0; i < meals.length; i++) {
      menu.mealOptions.push({
        name: meals[i],
        categories: createMeal(),
      });
    }
    return menu;
  };

  return createAMenu();
};

const createDish = (id) => {
  const name = faker.lorem.word(); // this was not here
  const desc = faker.lorem.sentence();
  const price = chance.floating({ min: 5, max: 200, fixed: 2 });
  const category = chance.pickone(foodCategories);
  const mealOption = chance.pickone(mealOptions);
  const dish = {
    resId: id,
    name,
    desc,
    price,
    category,
    mealOption,
  };
  return dish;
};

const createDishes = (id) => {
  const rng = chance.integer({ min: 10, max: 20 });
  const result = [];
  for (let i = 0; i < rng; i++) {
    result.push(createDish(id));
  }
  return result;
};


// for (let i = 0; i < 2; i++) {
//   console.log(createMenu(i));
//   console.log(JSON.stringify(createMenu(i)));
// }

// for (let i = 0; i < 2; i++) {
//   const dishes = createDishes(i);
//   console.log(dishes);
//   console.log(dishes.length);
// }

module.exports = { createMenu, createDishes };
