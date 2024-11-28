import { Given, When, Then } from '@cucumber/cucumber';
import axios from 'axios';
import assert from 'assert';

let response: any;
let startTime: number;
let endTime: number;
let firstResponseTime: number;
let secondResponseTime: number;

Given('the API endpoint is available', async function () {
  try {
    const healthCheck = await axios.get('https://api.agify.io/');
    assert(healthCheck.status === 200, 'API endpoint is not available');
  } catch (error) {
    throw new Error('API endpoint is not available');
  }
});

When('I request the age for the name {string}', async function (name: string) {
  if (name === "Alice") {
    startTime = Date.now();
  }
  response = await axios.get(`https://api.agify.io/?name=${name}`);
  if (name === "Alice") {
    endTime = Date.now();
  }
});

When('I request the age for the name {int}', async function (name: number) {
  response = await axios.get(`https://api.agify.io/?name=${name}`);
});

When('I request the age for the name "a" repeated {int} times', async function (times: number) {
  const longName = 'a'.repeat(times);
  response = await axios.get(`https://api.agify.io/?name=${longName}`);
});

When('I request the age for the name {string} twice', async function (name: string) {
  const startTime1 = Date.now();
  await axios.get(`https://api.agify.io/?name=${name}`);
  firstResponseTime = Date.now() - startTime1;

  const startTime2 = Date.now();
  await axios.get(`https://api.agify.io/?name=${name}`);
  secondResponseTime = Date.now() - startTime2;
});

When('I request the age for the names {string}', async function (names: string) {
  const nameArray = names.split(',');
  response = await axios.get(`https://api.agify.io/?name[]=${nameArray.join('&name[]=')}`);
});

Then('the response should be successful', function () {
  assert(response && response.status === 200, 'Expected response status to be 200');
  assert(response.data.age !== null, 'Expected age not to be null');
});

Then('the age should be a number', function () {
  assert(response && typeof response.data.age === 'number', 'Expected age to be a number');
});

Then('the response should indicate an error', function () {
  assert(response && response.data.age === null, 'Expected age to be null');
});

Then('the response time should be less than {int}ms', function (maxTime: number) {
  const responseTime = endTime - startTime;
  assert(responseTime < maxTime, `Expected response time to be less than ${maxTime}ms, but was ${responseTime}ms`);
});

Then('the second response time should be less than the first', function () {
  assert(secondResponseTime < firstResponseTime, `Expected second response time (${secondResponseTime}ms) to be less than first response time (${firstResponseTime}ms)`);
});

Then('the ages should be numbers', function () {
  assert(response && response.data.every((entry: any) => typeof entry.age === 'number'), 'Expected all ages to be numbers');
});