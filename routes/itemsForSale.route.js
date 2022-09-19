const router = require("express").Router();
const { Op } = require("sequelize");
const FoodItem = require("../Models/FoodItem");
const { getOneImage } = require("../Helpers/s3");

router.get("/getAll", async (req, res, next) => {
  try {
    let query = req.query.query;
   // console.log(query);
    let list;
    list = await FoodItem.findAll({
      where: {
        [Op.or]: {
          name: {
            [Op.substring]: `%${query}%`,
          },
          category: {
            [Op.substring]: `%${query}%`,
          },
        },
      },
      order: [["orderCount", "DESC"]],
    });
    //console.log(list);
    res.send({
      success: true,
      itemsForSaleList: list,
      error: null,
    });
  } catch (error) {
   // console.log(error);
    next(error);
  }
});

router.get("/getOneImage/:imageKey", async (req, res, next) => {
  try {
    const imageKey = req.params.imageKey;
    //console.log(imageKey);
    const result = await getOneImage(imageKey);
    result.Body.pipe(res);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
