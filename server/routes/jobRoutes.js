const express = require("express");
const router = express.Router();
const { getJobs, createJob, updateJob, deleteJob } = require("../controllers/jobController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect); // all job routes require login

router.get("/",       getJobs);
router.post("/",      createJob);
router.put("/:id",    updateJob);
router.delete("/:id", deleteJob);

module.exports = router;