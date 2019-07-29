const express = require("express");
const axios = require("axios");
const hbs = require("express-handlebars");
const path = require("path");
const app = express();
const expressip = require("express-ip");
const PORT = process.env.PORT || 5000;

// set view engine
app.engine(
  "hbs",
  hbs({
    extname: ".hbs",
    defaultLayout: "main",
    layoutDirs: __dirname + "views/layouts/"
  })
);
app.set("views", path.join(__dirname + "/views"));
app.set("view engine", ".hbs");

// set express-ip
app.use(expressip().getIpInfoMiddleware);

// assets
app.use(express.static(path.join(__dirname + "/assets")));

// routes
app.get("/", (req, res) => {
  res.render("index", { title: "Job Search API" });
});

app.get("/search", (req, res) => {
  let queries = req.query;

  let ipInfo = req.ipInfo;

  let url = `https://indreed.herokuapp.com/api/jobs`;

  if (ipInfo) {
    url = `https://indreed.herokuapp.com/api/jobs?country=${ipInfo.country}`;
  }

  if (queries) {
    axios
      .get(url, { params: queries })
      .then(response => {
        res.render("search", {
          title: "Job API",
          jobs: response.data,
          countryCode: ipInfo.country
        });
      })
      .catch(error => console.log(`Error ${error}`));
  } else {
    res.render("error", { title: "Job Search API", error: response.error });
  }
});

app.listen(PORT, function() {
  console.log(`Server running on port ${PORT} 🚀. Press Ctrl-C to terminate `);
});
