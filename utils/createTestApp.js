// test/utils/createTestApp.js
const express = require("express");
const metricsRouter = require("../routes/metrics");

function createTestApp({ renderStub } = {}) {
  const app = express();
  app.set("view engine", "ejs");
  app.set("views", __dirname + "/../../views");

  // Allow caller to override render behavior
  if (renderStub) {
    app.response.render = renderStub;
  } else {
    // Default stub
    app.response.render = function (view, options) {
      this.send(
        `<html>
          <body>
            <h1>Total Profit: ${options.totalProfit}</h1>
            <p>User: ${options.username}</p>
            <p>Agent: ${options.profitPerAgent[0]._id}</p>
            <p>Role: ${options.profitPerRole[0]._id}</p>
            <p>Outreach: ${options.profitByOutreach[0]._id}</p>
          </body>
        </html>`
      );
    };
  }

  app.use("/", metricsRouter);
  return app;
}

module.exports = createTestApp;
