const fs = require("fs");
exports.onPostBuild = async ({ reporter }) => {
  reporter.warn("onPostBuild");
  fs.writeFileSync(
    "public/apple-app-site-association.json",
    JSON.stringify({
      webcredentials: {
        apps: ["AZLX5H46ZL.app.dayto.dayto"],
      },
    })
  );
};
