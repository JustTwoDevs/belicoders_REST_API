import mongoose from "mongoose";

export const databaseSetup = () => {
  afterEach((done) => {
    mongoose.connection.dropDatabase();
    done();
  });
};
