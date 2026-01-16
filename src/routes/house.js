import express from "express";
import {
  getHouseById,
  getHousesByUserId,
  createHouse,
  addRoommate,
  deleteHouseById,
  deleteRoommate,
  getHouseMembers,
} from "../controllers/houseController.js";

const router = express.Router();

router.get("/:id", getHouseById);
router.get("/user/:id", getHousesByUserId);
router.get("/:house_id/roommates", getHouseMembers);
router.post("/", createHouse);
router.post("/:house_id/roommate", addRoommate);
router.delete("/:house_id/:user_id", deleteRoommate);
router.delete("/:house_id", deleteHouseById);

export default router;
