import express from "express";
import { getHouseById, getHousesByUserId, createHouse, addRoommate} from "../controllers/houseController.js";

const router = express.Router();

router.get("/:id", getHouseById);
router.get("/user/:id", getHousesByUserId);
router.post("/", createHouse);
router.post("/:house_id/roommate", addRoommate);

// router.delete();

export default router;