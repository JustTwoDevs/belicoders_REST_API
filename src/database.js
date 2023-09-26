import { connect } from "mongoose";

connect(process.env.DATABASE_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
})
  .then(() => console.log("Database is connected"))
  .catch((err) => console.log(err));
