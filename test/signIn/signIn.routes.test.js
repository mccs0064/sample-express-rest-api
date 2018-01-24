import Chai, { expect } from 'Chai';
import HttpStatus from 'http-status-codes';
import app from '../../index';
import { UserRepository } from '../../models/user';
import { EXISTING_USER_LIST } from '../helpers/userFactory';

Chai.use(require('chai-http'));

let should = Chai.should();

describe('POST /sign-in', () => {
  it('should allow the user to log in and return a JWT', (done) => {
    let existingUser = EXISTING_USER_LIST.EXISTING_USER_1;
    existingUser.password = 'password'
    Chai.request(app)
      .post('/api/sign-in')
      .send(EXISTING_USER_LIST.EXISTING_USER_1)
      .end((err, res) => {
        should.exist(res.body);
        res.should.have.status(HttpStatus.OK);
        res.body.should.have.property('token');
        done();
      });
  });
  it('should deny the user to log in and NOT return a JWT', (done) => {
    let badLogin = {
      email: 'fakeEmail@gmail.com',
      password: 'thiswontwork'
    };
    Chai.request(app)
      .post('/api/sign-in')
      .send(badLogin)
      .end((err, res) => {
        should.exist(res.body);
        res.should.have.status(HttpStatus.BAD_REQUEST);
        res.body.should.not.have.property('token');
        done();
      });
  })
});