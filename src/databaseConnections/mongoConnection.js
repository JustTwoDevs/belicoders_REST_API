import { connect } from "mongoose";

connect(process.env.DATABASE_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
})
  .then(() => {
    console.log("Connected to MongoDB :D");
  })
  .catch((err) => console.log(err));
