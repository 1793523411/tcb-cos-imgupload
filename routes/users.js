var express = require("express");
var router = express.Router();
var COS = require("cos-nodejs-sdk-v5");

const { COS_SECRETID, COS_SECRETKEY } = require("../utils/secret");

var cos = new COS({
  SecretId: COS_SECRETID,
  SecretKey: COS_SECRETKEY,
});
/* GET users listing. */
// router.get("/", function (req, res, next) {
//   res.send("respond with a resource");
// });

router.get("/list", (req, res) => {
  cos.getBucket(
    {
      Bucket: "wx-xly-1301545895" /* 必须 */,
      Region: "ap-beijing" /* 必须 */,
      Prefix: "" /* 非必须 */,
    },
    function (err, data) {
      const response = data.Contents.filter((item) => {
        // const tmp = item.Key.split('/')
        return (
          item.Key.split("/")[0] === "website-for-me" &&
          item.Key.split("/")[1] === "image" &&
          item.Key.split("/")[2]
        );
      });
      res.json({
        results: response,
      });
    }
  );
});

router.post("/remove", (req, res) => {
  console.log(req.body);
  let Key = req.body.key;
  cos.deleteObject(
    {
      Bucket: "wx-xly-1301545895" /* 必须 */,
      Region: "ap-beijing" /* 必须 */,
      Key: Key /* 必须 */,
    },
    function (err, data) {
      if (err) {
        res.json({
          err: err,
        });
      } else {
        res.json({
          message: "success",
        });
      }
    }
  );
});

router.get('/count',(req,res) => {
  cos.getBucket(
    {
      Bucket: "wx-xly-1301545895" /* 必须 */,
      Region: "ap-beijing" /* 必须 */,
      Prefix: "" /* 非必须 */,
    },
    function (err, data) {
      const response = data.Contents.filter((item) => {
        // const tmp = item.Key.split('/')
        return (
          item.Key.split("/")[0] === "website-for-me" &&
          item.Key.split("/")[1] === "image" &&
          item.Key.split("/")[2]
        );
      });
      res.json({
        results: response.length,
      });
    }
  );
})

module.exports = router;
