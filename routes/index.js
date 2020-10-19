var express = require("express");
const fs = require("fs");
var router = express.Router();
var multer = require("multer");
var COS = require("cos-nodejs-sdk-v5");

const { UPLOAD_PATH } = require("../utils/constant");
const { COS_SECRETID, COS_SECRETKEY } = require("../utils/secret");
const { response } = require("../app");

var cos = new COS({
  SecretId: COS_SECRETID,
  SecretKey: COS_SECRETKEY,
});
/* GET home page. */
// router.get("/", function (req, res, next) {
//   res.render("index", { title: "Express" });
// });

router.post(
  "/upload",
  multer({ dest: `${UPLOAD_PATH}` }).single("file"),
  (req, res) => {
    var file = req.file;
    console.log(file);
    if (!file || file.length === 0) {
    } else {
      var num = parseInt(Math.random() * 100000);
      let oldname = file.path;
      let newname = `${file.destination}/${num}-${file.originalname}`;
      fs.rename(oldname, newname, (err) => {
        if (err) {
          let response = {
            message: "fail",
            err: err,
          };
          res.json(response);
        }else{
          cos.putObject({
            Bucket: 'wx-xly-1301545895', /* 必须 */
            Region: 'ap-beijing',    /* 必须 */
            Key: `website-for-me/image/${num}-${file.originalname}`,              /* 必须 */
            StorageClass: 'STANDARD',
            Body: fs.createReadStream(`./tmp/${num}-${file.originalname}`), // 上传文件对象
            onProgress: function(progressData) {
                console.log(JSON.stringify(progressData));
            }
        }, function(err, data) {
            console.log(err || data);
        });
          res.json({
            message:"success"
          })
        }
      })
    }
  }
);

module.exports = router;
