import express from "express";
import {
  addNewComment,
  addVote,
  createPoll,
  deleteCommentById,
  deletePollById,
  getCommentsByPoll,
  getMyHistoricPollsByHouse,
  getMyPendingPollsByHouse,
  getMyPollsByHouse,
  getPollById,
  getPollResults,
  getPollsByHouse,
  manualClosePollById,
  updatePollData,
} from "../controllers/pollsController.js";

const router = express.Router();

// Polls
router.get("/:poll_id", getPollById);
router.get("/house/:house_id", getPollsByHouse);
router.get("/user/:house_id/:user_id", getMyPollsByHouse);
router.get("/user_pending/:house_id/:user_id", getMyPendingPollsByHouse);
router.get("/user_historic/:house_id/:user_id", getMyHistoricPollsByHouse);
router.get("/results/:poll_id", getPollResults);
router.post("/", createPoll);
router.post("/addVote/:poll_option_id", addVote);
router.put("/:poll_id", updatePollData);
router.put("/close/:poll_id", manualClosePollById);
router.delete("/:poll_id", deletePollById);

// Comments
router.post("/comments", addNewComment);
router.get("/comments/:poll_id", getCommentsByPoll);
router.delete("/comments/:comment_id", deleteCommentById);

export default router;
