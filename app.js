const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route to display list of files
app.get("/", (req, res) => {
  fs.readdir("./files", (err, files) => {
    if (err) return res.status(500).send("Error reading files directory.");
    res.render("index", { files });
  });
});

// Route to edit a specific file
app.get("/edit/:filename", (req, res) => {
  const fileName = req.params.filename;
  fs.readFile(`./files/${fileName}`, "utf-8", (err, data) => {
    if (err) return res.status(500).send("Error reading the file.");
    res.render("edit", { fileName, data });
  });
});

// Route to delete a specific file
app.get("/delete/:filename", (req, res) => {
  const fileName = req.params.filename;
  fs.unlink(`./files/${fileName}`, (err) => {
    if (err) return res.status(500).send("Error deleting the file.");
    res.redirect("/");
  });
});

// Route to update a file's content and name
app.post("/update/:filename", (req, res) => {
  const oldFileName = req.params.filename;
  const { newFileName, fileData } = req.body;

  fs.writeFile(`./files/${oldFileName}`, fileData, (err) => {
    if (err) return res.status(500).send("Error updating the file content.");

    // Rename the file if the name has been changed
    if (newFileName && newFileName !== oldFileName) {
      fs.rename(`./files/${oldFileName}`, `./files/${newFileName}`, (renameErr) => {
        if (renameErr) return res.status(500).send("Error renaming the file.");
        res.redirect("/");
      });
    } else {
      res.redirect("/");
    }
  });
});

// Route to render the create form
app.get("/create", (req, res) => {
  res.render("create");
});

// Route to create a new file with the current date
app.post("/createHisab", (req, res) => {
  const currentDate = new Date();
  const formattedDate = `${String(currentDate.getDate()).padStart(2, "0")}-${String(
    currentDate.getMonth() + 1
  ).padStart(2, "0")}-${currentDate.getFullYear()}`;

  const filePath = `./files/${formattedDate}.txt`;
  fs.writeFile(filePath, req.body.hisaab, (err) => {
    if (err) return res.status(500).send("Error creating the file.");
    res.redirect("/");
  });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
