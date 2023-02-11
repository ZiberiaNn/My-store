const express = require("express");
const routerApi = require("./routes");
const cors = require("cors");
const { logErrors, errorHandler, boomErrorHandler, queryErrorHandler } = require("./middlewares/error.handler");

const app = express();
const port  = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) =>{
  res.send("Hi, server in Express.");
});

routerApi(app);

app.use(logErrors);
app.use(queryErrorHandler);
app.use(boomErrorHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log("Running on port "+port);
});
