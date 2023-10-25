import { connect } from "mongoose";
import { exec } from "child_process";

connect(process.env.DATABASE_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
})
  .then(() => {
    exec(
      "cowsay -f stegosaurus database connected",
      (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
      },
    );
  })
  .catch((err) => console.log(err));
