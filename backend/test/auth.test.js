import {
  requestAuthRegister,
  requestAuthLogin,
  requestChangeEmail,
  requestChangePassword,
} from './authTestHelper.js';

describe('Register tests', () => {
  test('Test 1: Successful registration | should return 201', async () => {
    const now = new Date();
    const email = `${now}@gmail.com`;
    const res = await requestAuthRegister(email, 'ali', 'password', 'password');
    expect(res.status).toBe(201);
  });

  test('Test 2: Passwords dont match | should return 400', async () => {
    const now = new Date();
    const email = `${now}@gmail.com`;
    const res = await requestAuthRegister(
      email,
      'ali',
      'password',
      'password123',
    );
    expect(res.status).toBe(400);
  });

  test('Test 3: Trying to register an existing user | should return 400', async () => {
    const now = new Date();
    const email = `${now}@gmail.com`;
    requestAuthRegister(email, 'ali', 'password', 'password');
    const res = await requestAuthRegister(
      email,
      'ali',
      'password',
      'password123',
    );
    expect(res.status).toBe(400);
  });
});

describe('Login tests', () => {
  test('Test 1: Successful Login | should return 201 and a token', async () => {
    const now = new Date();
    const email = `${now}@gmail.com`;
    await requestAuthRegister(email, 'ali', 'password', 'password');

    const res = await requestAuthLogin(email, 'password');
    expect(res.status).toBe(200);
    expect(res.token).toEqual(expect.any(String));
  });

  test('Test 2: Fail login, wrong password | should return 400 | appropriate message', async () => {
    const now = new Date();
    const email = `${now}@gmail.com`;
    await requestAuthRegister(email, 'ali', 'password', 'password');

    const res = await requestAuthLogin(email, 'wrong password');
    expect(res.status).toBe(400);
    expect(res.message).toBe('Incorrect password');
  });
});

describe('Update email', () => {
  test('Test 1: Successful change email | should return 200 and appropriate message', async () => {
    const now = new Date();
    const email = `${now}@gmail.com`;
    const now2 = new Date();

    const newEmail = `${now2}@gmail.com`;
    await requestAuthRegister(email, 'ali', 'password', 'password');

    const token = await requestAuthLogin(email, 'password');

    const res = await requestChangeEmail(email, newEmail, token.token);
    expect(res.status).toBe(200);
    expect(res.message).toEqual('Email updated successfully');
  });

  test('Test 2: Incorrect current email | should return 400 and appropriate message', async () => {
    const now = new Date();
    const email = `${now}@gmail.com`;
    const now2 = new Date();

    const newEmail = `${now2}@gmail.com`;
    await requestAuthRegister(email, 'ali', 'password', 'password');

    const token = await requestAuthLogin(email, 'password');

    const res = await requestChangeEmail(
      'wrong@gmail.com',
      newEmail,
      token.token,
    );
    expect(res.status).toBe(400);
    expect(res.message).toEqual('Incorrect current email');
  });
});

describe('Update password', () => {
  test('Test 1: Successful change password | should return 200 and appropriate message', async () => {
    const now = new Date();
    const email = `${now}@gmail.com`;

    await requestAuthRegister(email, 'ali', 'password', 'password');

    const token = await requestAuthLogin(email, 'password');

    const res = await requestChangePassword(
      'password',
      'password123',
      token.token,
    );
    expect(res.status).toBe(200);
    expect(res.message).toEqual('Password updated successfully');
  });

  test('Test 2: Incorrect current password | should return 400 and appropriate message', async () => {
    const now = new Date();
    const email = `${now}@gmail.com`;

    await requestAuthRegister(email, 'ali', 'password', 'password');

    const token = await requestAuthLogin(email, 'password');

    const res = await requestChangePassword(
      'passworddjla',
      'password123',
      token.token,
    );
    expect(res.status).toBeGreaterThanOrEqual(400);
  });
});
