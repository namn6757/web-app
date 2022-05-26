const router = require("express").Router();
const useCtrl = require("../controllers/userCtrl");
const auth = require("../middleware/auth");

router.post("/register", useCtrl.register);
router.post("/login", useCtrl.login);
router.get("/logout", useCtrl.logout);
router.get("/refresh_token", useCtrl.reFreshToken);
router.get("/infor", auth, useCtrl.getUser);
router.patch("/addcart", auth, useCtrl.addCart);
router.get("/history", auth, useCtrl.history);
module.exports = router;
