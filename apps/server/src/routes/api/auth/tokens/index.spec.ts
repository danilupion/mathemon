import { UserRole } from '@mathemon/common/models/user.js';
import {
  connectMongoose,
  disconnectMongoose,
} from '@mathemon/turbo-server/helpers/mongoose/connection.js';
import { Method, StatusCode } from '@mathemon/turbo-server/http.js';
import { generateToken } from '@mathemon/turbo-server/middleware/express/auth/jwt.js';
import routes from '@mathemon/turbo-server/test-utils/routes.js';
import server from '@mathemon/turbo-server/test-utils/server.js';
import jwtDecode from 'jwt-decode';

import UserModel from '../../../../models/user.js';
import { getTokenPayload } from '../../../../utils/auth.js';

import router from './index.js';

routes(router, '/api/auth/tokens', [
  [Method.POST, '/'],
  [Method.PUT, '/'],
]);

describe('/api/auth/tokens', () => {
  beforeAll(async () => {
    await connectMongoose();
  });
  afterAll(async () => {
    await UserModel.deleteMany({}).exec();
    await disconnectMongoose();
  });
  beforeEach(async () => {
    await UserModel.deleteMany({}).exec();
  });

  describe('post', () => {
    describe('Should fail', () => {
      it('With status 400 if no password is received and a matching email', async () => {
        await UserModel.create({
          username: 'test',
          email: 'test@email.com',
          verified: true,
        });

        const response = await server(router).post('/').send({ email: 'test@email.com' });

        expect(response.statusCode).toBe(StatusCode.ClientErrorBadRequest);
        expect(response.body).toStrictEqual({});
        expect.hasAssertions();
      });

      it('With status 401 for not matching email', async () => {
        await UserModel.create({
          username: 'test',
          email: 'test@email.com',
          password: 'testTest1.',
          verified: true,
        });

        const response = await server(router)
          .post('/')
          .send({ email: 'doesNotMatch@email.com', password: 'testTest1.' });

        expect(response.statusCode).toBe(StatusCode.ClientErrorUnauthorized);
        expect(response.body).toStrictEqual({});
        expect.hasAssertions();
      });

      it('With status 401 for not matching password', async () => {
        await UserModel.create({
          username: 'test',
          email: 'test@email.com',
          password: 'testTest1.',
          verified: true,
        });

        const response = await server(router)
          .post('/')
          .send({ email: 'test@email.com', password: 'doesNotMatch1.' });

        expect(response.statusCode).toBe(StatusCode.ClientErrorUnauthorized);
        expect.hasAssertions();
      });

      it('With status 401 for matching email and password pair but not verified state', async () => {
        await UserModel.create({
          username: 'test',
          email: 'test@email.com',
          password: 'testTest1.',
          verified: false,
          role: UserRole.admin,
        });

        const response = await server(router).post('/').send({
          email: 'test@email.com',
          password: 'testTest1.',
        });

        expect(response.statusCode).toBe(StatusCode.ClientErrorUnauthorized);
        expect.hasAssertions();
      });
    });

    describe('Should succeed', () => {
      it('With token for matching email and password pair', async () => {
        await UserModel.create({
          username: 'test',
          email: 'test@email.com',
          password: 'testTest1.',
          verified: true,
          role: UserRole.admin,
        });

        const response = await server(router).post('/').send({
          email: 'test@email.com',
          password: 'testTest1.',
        });
        const decodedValues = jwtDecode.default(response.body.token);

        expect(response.statusCode).toBe(StatusCode.SuccessCreated);
        expect(response.type).toBe('application/json');
        expect(decodedValues).toMatchObject({
          username: 'test',
          email: 'test@email.com',
          role: 'admin',
        });
        expect.hasAssertions();
      });
    });
  });

  describe('put', () => {
    describe('Should fail', () => {
      it('With 401 status for expired tokens', async () => {
        const user = await UserModel.create({
          username: 'putTestFail',
          email: 'putTestFail@email.com',
          password: 'putTestFailTest1.',
          role: UserRole.admin,
        });
        const token = await generateToken(getTokenPayload(user), { expiresIn: -50 });
        const response = await server(router).put('/').set('Authorization', `bearer ${token}`);

        expect(response.statusCode).toBe(StatusCode.ClientErrorUnauthorized);
        expect(response.body).toStrictEqual({});
        expect.hasAssertions();
      });

      it('With 401 status for non existing users', async () => {
        const user = await UserModel.create({
          username: 'putTestFail',
          email: 'putTestFail@email.com',
          password: 'putTestFailTest1.',
          role: UserRole.admin,
        });
        const token = await generateToken(getTokenPayload(user));
        await UserModel.deleteMany({ _id: user._id }).exec();
        const response = await server(router).put('/').set('Authorization', `bearer ${token}`);

        expect(response.statusCode).toBe(StatusCode.ClientErrorUnauthorized);
        expect(response.body).toStrictEqual({});
        expect.hasAssertions();
      });
    });

    describe('Should succeed', () => {
      it('With renewed token for a valid token', async () => {
        const user = await UserModel.create({
          username: 'putTestOk',
          email: 'putTestOk@email.com',
          password: 'putTestOkTest1.',
          role: UserRole.admin,
        });
        const token = await generateToken(getTokenPayload(user));
        const response = await server(router).put('/').set('Authorization', `bearer ${token}`);

        const decodedValues = jwtDecode.default(response.body.token);

        expect(response.statusCode).toBe(StatusCode.SuccessOK);
        expect(response.type).toBe('application/json');
        expect(decodedValues).toMatchObject({
          username: 'putTestOk',
          email: 'putTestOk@email.com',
          role: 'admin',
        });
        expect.hasAssertions();
      });
    });
  });
});
