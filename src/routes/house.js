import express from "express";
import {  } from "../controllers/houseController.js";

const router = express.Router();

router.get("/house/:id", getHouseById);
router.get("/user/:id", getHousesByUserId);

// router.delete();

export default router;