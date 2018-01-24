import config from '../config.json';
import mongoose from 'mongoose';

export default function connectToDb() {
  if (process.env.NODE_ENV === 'test'){
    return
    // connectToTestDb()
  }else{
    mongoose.connect(config.mongo.uri, (err) => {
      if (err) {
          console.log(err)
      }
    });
  }
}
