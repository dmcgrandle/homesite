/* -----------------        token-service.test.js          --------------------
  Unit testing for methods in token-service.js
-----------------------------------------------------------------------------*/

// const jwt = require('jsonwebtoken');
import * as jwt from 'jsonwebtoken';
// const tokenSvc = require('./token-service');
import { tokenSvc } from 'src/services/token-service';

test('test: create new token and verify', async () => {
  expect.assertions(4);
  const token = await tokenSvc.getNew('guest');
  const decodedToken: any = jwt.decode(token, { complete: true });
  if (decodedToken) {
    expect(decodedToken.payload).toHaveProperty('iat');
    expect(decodedToken.payload).toHaveProperty('exp');
    expect(decodedToken.payload.username).toEqual('guest');
    }
  expect(await tokenSvc.verify(token)).toBeTruthy();
});

test('test: modify token and verify failure', async () => {
  expect.assertions(1);
  let token = await tokenSvc.getNew('guest');
  let tokenArray = token.split(''); // immutable string, so turn into array
  tokenArray[80] = (tokenArray[80] === 'x') ? 'y' : 'x'; // change one char in signature
  token = tokenArray.join(''); // turn back into a string
  try { // make sure verify throws an error
    await tokenSvc.verify(token);
    expect(true).toBeFalsy(); // should never get here ...
  } catch (err) { expect(err.message).toBe('invalid signature'); }
});

test('test: create new email token and verify', async () => {
  expect.assertions(4);
  try {
    const token = await tokenSvc.getEmailChangeToken('guest');
    const decodedToken: any = await jwt.decode(token);
    if (decodedToken) {
      expect(decodedToken).toHaveProperty('iat');
      expect(decodedToken).toHaveProperty('exp');
      expect(decodedToken.username).toEqual('guest');
    }
    expect(await tokenSvc.isValidEmailToken(token)).toBeTruthy();
  } catch (err) {
    console.log('error is ', err);
  }
});

test('test: modify email token and verify failure', async () => {
  expect.assertions(1);
  let token = await tokenSvc.getEmailChangeToken('guest');
  let tokenArray = token.split('');
  tokenArray[40] = (tokenArray[40] === 'x') ? 'y' : 'x';
  token = tokenArray.join('');
  try {
    await tokenSvc.isValidEmailToken(token);
    expect(true).toBeFalsy();
  } catch (err) { expect(err.message).toBe('403 Invalid token'); }
});
