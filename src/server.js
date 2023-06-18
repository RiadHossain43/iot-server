const compression = require("compression");
const dotenv = require("dotenv");
const express = require("express");
dotenv.config();
const app = express();
let STATES = {
  button: "Off",
  sonar: 0,
};

function controlState(element, state) {
  switch (element) {
    case "button": {
      STATES.button = state;
      break;
    }
    case "sonar": {
      STATES.sonar = state;
      break;
    }
    default:
      break;
  }
}

app.use(express.static("public"));
app.use(compression());
app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ limit: "200mb", extended: true }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});
app.use((req, res, next) => {
  console.log(new Date(), "↓");
  console.info(
    "request: ",
    req.method,
    " Host:",
    req.headers.origin,
    " End point:",
    req.originalUrl
  );
  next();
});
app.get("/", (req, res) => {
  res.sendFile(__dirname, "../public/index.html");
});
app.get("/state/:element", (req, res) => {
  const { element } = req.params;
  res.status(200).send(`${STATES[element]}`);
});
app.post("/state/:element", (req, res) => {
  const { state } = req.body;
  const { element } = req.params;
  controlState(element, state);
  res.status(200).send(`${STATES[element]}`);
});
async function startServer() {
  const PORT = process.env.PORT || 8000;
  const httpServer = app.listen(PORT, () =>
    console.log(`Server ${process.pid} started @ port ${PORT}`)
  );
}
startServer();
