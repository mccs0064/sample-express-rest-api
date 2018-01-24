import nodeCleanup from 'node-cleanup';
import mongoose from 'mongoose';
import config from '../config.json';
import { UserFactory } from './helpers/userFactory';

before((done) => {
  mongoose.connect(config.mongo.testDBUri);
  mongoose.connection.on('open', () => {
    mongoose.connection.db.dropDatabase(async (err, result) => {
      await UserFactory.createUsers();
      done();
    })
  });
});

after((done) => {
  mongoose.connection.db.dropDatabase((err, result) => {
    console.log("... clearing db");
    done();
  })
});


