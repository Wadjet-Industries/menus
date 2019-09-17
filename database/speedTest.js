/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
/* eslint-disable no-loop-func */
const { performance } = require('perf_hooks');
const Chance = require('chance');
const postgreSQL = require('./postgreSQL.js');
const cassandra = require('./query.js');

const chance = Chance();

const cassTimes = [];
let cassErrorCount = 0;

const postTimes = [];
let postErrorCount = 0;

const numberOfRuns = 10000;

const test = async () => {
  for (let i = 0; i < numberOfRuns; i++) {
    const id = chance.integer({ min: 0, max: 10000000 });
    // console.log(id);

    const postStartTime = performance.now();

    await new Promise((resolve) => {
      postgreSQL.getMenu(id, (err) => {
        if (err) {
          postErrorCount++;
        } else {
          const time = performance.now() - postStartTime;
          postTimes.push(time);
        }
        resolve();
      });
    });

    await new Promise((resolve) => {
      const cassStartTime = performance.now();
      cassandra.getMenu(id, (err) => {
        if (err) {
          cassErrorCount++;
        } else {
          const time = performance.now() - cassStartTime;
          cassTimes.push(time);
        }
        resolve();
      });
    });
  }
  const totalPostTimes = postTimes.reduce((acc, val) => acc + val);
  const totalCassTimes = cassTimes.reduce((acc, val) => acc + val);

  console.log('number of runs', numberOfRuns);
  console.log('total postgreSQL times', totalPostTimes);
  console.log('total cassandra times', totalCassTimes);
  console.log('-------------------------------------');
  console.log('average postgreSQL times', totalPostTimes / numberOfRuns);
  console.log('average cassandra times', totalCassTimes / numberOfRuns);
  console.log('-------------------------------------');
  console.log('total postgreSQL errors', postErrorCount);
  console.log('tatal cassandra errors', cassErrorCount);
  postgreSQL.client.end();
  cassandra.models.close();
};

test();
