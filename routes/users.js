var express = require("express");
var router = express.Router();
var userSchema = require("../models/user.model");
const multer = require("multer");
var bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const tokenmiddleware = require("../middleware/token.middleware");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().getTime() + "_" + file.originalname);
  },
});
// let x = "asdc";
// x.toLowerCase;

// function getegid(name = "asdc") {
//   return "test" + name;
// }

const upload = multer({ storage: storage });

/* GET users listing. */
router.get("/", async function (req, res, next) {
  let users = await userSchema.find({});
  res.send(users);
});

router.post(
  "/",
  [tokenmiddleware, upload.single("image")],
  async function (req, res, next) {
    let { name, email, password } = req.body;
    let user = new userSchema({
      name: name,
      email: email,
      password: await bcrypt.hash(password, 10),
    });
    let token = await jwt.sign({ foo: "bar" }, "1234");
    // await user.save();
    res.send(token);
  }
);

router.put("/:id", async function (req, res, next) {
  try {
    let { id } = req.params;
    let { name, email, password } = req.body;
    let user = await userSchema.findByIdAndUpdate(
      id,
      {
        name: name,
        email: email,
        password: password,
      },
      { new: true }
    );

    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error updating user");
  }
});

router.delete("/:id", async function (req, res, next) {
  try {
    let { id } = req.params;

    let user = await userSchema.findByIdAndDelete(id);

    res.send("Delete Successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("ID not found");
  }
});

let arrayTest = [1, 2, 3, 4, 5, 6];
let arrayTest2 = [10, 20, 30, 40, 50, 60];

// arrayTest.forEach((item, index) => {
//   arrayTest2.push(item);
// });

// console.log(arrayTest2);

module.exports = router;
