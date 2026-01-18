import express from "express";
import {
  addNewComment,
  createPoll,
  deleteCommentById,
  deletePollById,
  getCommentsByPoll,
  getMyHistoricPollsByHouse,
  getMyPendingPollsByHouse,
  getMyPollsByHouse,
  getPollById,
  getPollsByHouse,
} from "../controllers/pollsController.js";

const router = express.Router();

// Polls
router.get("/:id", getPollById);
router.get("/house/:house_id", getPollsByHouse);
router.get("/user/:house_id/:user_id", getMyPollsByHouse);
router.get("/user_pending/:house_id/:user_id", getMyPendingPollsByHouse);
router.get("/user_historic/:house_id/:user_id", getMyHistoricPollsByHouse);
router.post("/", createPoll);
router.delete("/:id", deletePollById);

// Comments
router.post("/comments", addNewComment);
router.get("/comments/:poll_id", getCommentsByPoll);
router.delete("/comments/:comment_id", deleteCommentById);

export default router;
