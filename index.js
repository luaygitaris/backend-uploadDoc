const express = require("express");
const cors = require("cors");
const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.use("/api/categories", require("./Routes/routesCategory"));
app.use("/api/materials", require("./Routes/routesMateri"));
app.use("/api/login", require("./Routes/routesLogin"));
app.use("/api/register", require("./Routes/routesRegister"));
app.use("/api/progress", require("./Routes/routesProgress"));
app.use("/api/skills", require("./Routes/routesSkills"));
app.use("/api/projects", require("./Routes/routesProjects"));
app.use("/api/upload", require("./Routes/routesUploadDoc"));
app.use("/api/documents", require("./Routes/documents"));

app.get('/', (req, res) => {
  res.send('API Working');
});

module.exports = app;

if (process.env.VERCEL !== '1') {
  app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
  });
}