require("dotenv").config();
const Application = require("ssh-deploy-release");

const options = {
  localPath: "dist",
  host: process.env.HOST,
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  deployPath: process.env.DEPLOYPATH,
  currentReleaseLink: "current",
  onAfterDeploy: (context) => {
    context.logger.subhead("Installing dependencies and restarting bot...");
    return [`cd ${context.release.path} && npm ci --omit=dev`, `sudo systemctl restart elitetoolbot`];
  },

  // ["", ""],
};

const deployer = new Application(options);
deployer.deployRelease(() => {
  console.log("Ok !");
});
