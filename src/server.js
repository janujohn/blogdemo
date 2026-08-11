const path = require("path");
const express = require("express");

const publicRoutes = require("./routes/public");
const adminRoutes = require("./routes/admin");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", publicRoutes);
app.use("/admin", adminRoutes);

app.listen(PORT, () => {
  console.log(`Blog app listening on port ${PORT}`);
});
