import Chai, { expect } from 'Chai';
import HttpStatus from 'http-status-codes';
import app from '../../index';
import { UserRepository } from '../../models/user';
import { EXISTING_USER_LIST } from '../helpers/userFactory';

Chai.use(require('chai-http'));

let should = Chai.should();

describe('POST /users', () => {
  it('should create a new user', (done) => {
    let newUser = {
      email: "user123@gmail.com",
      password: "password",
      firstName: "user",
      lastName: "test"
    }
    Chai.request(app)
      .post('/api/users')
      .send(newUser)
      .end((err, res) => {
        should.exist(res.body);
        res.should.have.status(HttpStatus.CREATED);
        res.body.should.be.a('object');
        res.body.should.have.property('id');
        res.body.should.have.property('email');
        res.body.should.have.property('firstName');
        res.body.should.have.property('lastName');
        done();
      });
  });

  it('should send error when trying to add a user with the same email', (done) => {
    Chai.request(app)
      .post('/api/users')
      .send(EXISTING_USER_LIST.EXISTING_USER_1)
      .end((err, res) => {
        should.exist(res.body);
        res.should.have.status(HttpStatus.BAD_REQUEST);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('User exists');
        done();
      });
  });
});

describe('PUT /users', () => {
  let token;
  before(function (done) {
    // log user in 
    let existingUser = EXISTING_USER_LIST.EXISTING_USER_2;
    Chai.request(app)
      .post('/api/sign-in')
      .send(existingUser)
      .end((err, res) => {
        token = res.body.token
        should.exist(res.body);
        res.should.have.status(HttpStatus.OK);
        res.body.should.have.property('token');
        done();
      });
  });

  it('should update the users profile', (done) => {
    let userUpdate = EXISTING_USER_LIST.EXISTING_USER_2;
    userUpdate.firstName = 'updateduser'
    Chai.request(app)
      .put('/api/users')
      .set('Authorization', 'Bearer ' + token)
      .send(userUpdate)
      .end((err, res) => {
        should.exist(res.body);
        res.should.have.status(HttpStatus.ACCEPTED);
        res.body.should.be.a('object');
        res.body.should.have.property('id');
        res.body.should.have.property('firstName').eql('updateduser');
        done();
      });
  });
});
