require("dotenv").config();
const Application = require("ssh-deploy-release");

const options = {
  localPath: "dist",
  host: process.env.HOST,
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  deployPath: process.env.DEPLOYPATH,
  currentReleaseLink: "current",
};

const deployer = new Application(options);
deployer.rollbackToPreviousRelease(() => {
  console.log("Ok !");
});
