const router = require("express").Router();
const PasswordGenerator = require("../Helpers/password.generator");
const User = require("../Models/User");
const FoodItem = require("../Models/FoodItem");
const Area = require("../Models/Area");
const Table = require("../Models/Table");
const createError = require("http-errors");
const { uploadFile, deleteImage } = require("../Helpers/s3");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     try {
//       cb(null, "images");
//     } catch (error) {}
//   },
//   filename: (req, file, cb) => {
//     const imageName = Date.now() + path.extname(file.originalname);
//     cb(null, imageName);
//     req.body.fileName = `/images/${imageName}`;
//   },
// });

//const upload = multer({ storage: storage });

router.get("/createUser", async (req, res, next) => {
  try {
    res.render("addUser");
  } catch (error) {
    next(error);
  }
});

router.post("/createUser", async (req, res, next) => {
  try {
    const deviceId = req.body.deviceId;
    const userName = req.body.userName;

    if (!deviceId) throw createError.BadRequest("Device Id is blank");
    if (!userName) throw createError.BadRequest("User Name is blank");

    const password = await PasswordGenerator.genratePassword();

    const isUserExist = await User.findOne({
      where: {
        deviceId: deviceId,
      },
    });

    if (isUserExist)
      throw createError.BadRequest("User Already registered with " + deviceId);

    const user = {
      userName: userName,
      deviceId: deviceId,
      password: password,
    };
    const createdUser = await User.create(user);
    res.render("created_user", { userName, deviceId, password });
  } catch (error) {
    if (error.message === 'relation "users" does not exist') {
      console.log("test");
    }
    next(error);
  }
});

router.get("/usersList", async (req, res, next) => {
  try {
    const users = await User.findAll();

    res.send(users);
  } catch (error) {
    next(error);
  }
});

router.get("/createFoodItem", async (req, res, next) => {
  try {
    res.render("add_food_item");
  } catch (error) {
    next(error);
  }
});

router.post(
  "/createFoodItem",
  uploadFile.array("image", 1),
  async (req, res, next) => {
    try {
      let picture = "";
      req.files.forEach((item) => {
        picture = item.key;
      });
      // console.log(picture);
      const name = req.body.name;
      const image = picture;
      const price = req.body.price;
      const category = req.body.category;
      const fav = req.body.favourite;
      console.log(fav);
      let favourite = false;

      if (fav == 1) {
        favourite = true;
        console.log("test");
      } else {
        favourite = false;
      }
      console.log(favourite);
      //const itemTax = req.body.itemTax;
      // const availableQuantity = req.body.availableQuantity;
      // const isItavailable = req.body.isItavailable;
      // const isItSpecial = req.body.isItSpecial;
      const menuCardNumber = req.body.menuCardNumber;

      const foodItem = {
        name: name,
        price: price,
        image: image,
        category: category,
        favourite: favourite,
        menuCardNumber: menuCardNumber,
        date: Date.now(),
      };

      const item = await FoodItem.create(foodItem);

      res.send(item);
    } catch (error) {
      next(error);
    }
  }
);

router.get("/getFoodItemList", async (req, res, next) => {
  try {
    const foodItems = await FoodItem.findAll();
    res.send(foodItems);
  } catch (error) {
    next(error);
  }
});

router.get("/updateFoodItem", async (req, res, next) => {
  try {
    res.render("update_food_item");
  } catch (error) {
    next(error);
  }
});

router.post(
  "/updateFoodItem",
  uploadFile.array("image", 1),
  async (req, res, next) => {
    try {
      let picture = "";
      req.files.forEach((item) => {
        picture = item.key;
      });

      const name = req.body.name;
      console.log(name);
      const result = await FoodItem.update(
        { image: picture },
        {
          where: {
            name: name,
          },
        }
      );
      res.send(result);
    } catch (error) {
      next(error);
    }
  }
);

router.delete("/deleteOneItem/:itemId", async (req, res, next) => {
  try {
    const itemId = req.params.itemId;
    console.log(itemId);
    const image = await FoodItem.findByPk(itemId, { attributes: ["image"] });
    await FoodItem.destroy({
      where: {
        id: itemId,
      },
    });
    console.log("deleted " + image.image);

    await deleteImage(image.image);

    res.send(image);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.delete("/deleteAllFoodItems", async (req, res, next) => {
  try {
    await FoodItem.destroy({
      truncate: true,
    });

    res.send("Deleted All");
  } catch (error) {
    next(error);
  }
});

router.post("/setArea", async (req, res, next) => {
  try {
    const area = req.body;
    const result = await Area.create(area);
    res.send(result);
  } catch (error) {
    next(error);
  }
});

router.put("/updateArea/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const areaName = req.query.areaName;
    console.log(id);
    console.log(areaName);
    await Area.update(
      {
        areaName: areaName,
      },
      {
        where: {
          id: id,
        },
      }
    );
    res.send("updated");
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/setTable", async (req, res, next) => {
  try {
    res.render("set_table");
  } catch (error) {
    next(error);
  }
});

router.post(
  "/setTable",
  uploadFile.array("image", 1),
  async (req, res, next) => {
    try {
      let picture = "";

      req.files.forEach((item) => {
        picture = item.key;
      });

      const table = {
        tableName: req.body.tableName,
        noOfSeats: req.body.noOfSeats,
        occupaied: req.body.occupaied,
        areaId: req.body.areaId,
        areaName: req.body.areaName,
        image: picture,
      };
      console.log(table);
      const result = await Table.create(table);
      res.send(result);
    } catch (error) {
      next(error);
    }
  }
);

router.get("/getAllAreaWithTables", async (req, res, next) => {
  try {
    const list = await Area.findAll({ include: ["tables"] });
    res.send(list);
  } catch (error) {
    next(error);
  }
});

router.get("/getOneAreaWithTables", async (req, res, next) => {
  try {
    const areaId = req.query.areaId;
    const list = await Area.findByPk(areaId, { include: ["tables"] });
    res.send({
      success: true,
      message: list,
      error: null,
    });
  } catch (error) {
    res.send({
      success: false,
      message: null,
      error: error.message,
    });
  }
});

router.get("/getAllArea", async (req, res, next) => {
  try {
    const list = await Area.findAll();

    res.send({
      success: true,
      message: list,
      error: null,
    });
  } catch (error) {
    res.send({
      success: false,
      message: "error",
      error: error.message,
    });
  }
});

router.delete("/deleteAllArea", async (req, res, next) => {
  try {
    await Area.destroy({ truncate: true, cascade: true });
    res.send("deleted");
  } catch (error) {
    next(error);
  }
});

router.delete("/dropArea", async (req, res, next) => {
  try {
    await Area.drop({ force: true });
    res.send("droped Area Table");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
