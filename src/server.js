const compression = require("compression");
const dotenv = require("dotenv");
const express = require("express");
dotenv.config();
const app = express();
let STATES = {
  button: "On",
};

function controlState(element, state) {
  switch (element) {
    case "button": {
      STATES.button = state;
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
  res.status(200).json({
    message: element + " state is now " + STATES[element],
    data: {
      element,
      state: STATES[element],
    },
  });
});
app.post("/state/:element", (req, res) => {
  const { state } = req.body;
  const { element } = req.params;
  controlState(element, state);
  res.status(200).json({ message: element + " state is now " + state });
});
async function startServer() {
  const PORT = process.env.PORT || 8000;
  const httpServer = app.listen(PORT, () =>
    console.log(`Server ${process.pid} started @ port ${PORT}`)
  );
}
startServer();
