import {
  deleteComment,
  deletePoll,
  fetchCommentsByPoll,
  fetchMyHistoricPollsByHouse,
  fetchMyPendingPollsByHouse,
  fetchMyPollsByHouse,
  fetchPollById,
  fetchPollsByHouse,
  insertComment,
  insertPoll,
  insertPollOption,
  insertVote,
} from "../models/pollsModel.js";

//Polls
export async function createPoll(req, res) {
  try {
    const {
      house_id,
      title,
      description,
      created_by,
      expires_at,
      type,
      options,
    } = req.body;
    const is_closed = false;
    const poll = await insertPoll(
      house_id,
      title,
      description,
      created_by,
      expires_at,
      is_closed,
      type
    );
    // Add the poll options
    console.log("The inserted poll is:",poll);
    const createdPoll = Array.isArray(poll) ? poll[0] : poll;
    console.log("Options are: ", options);

    let insertedOptions = [];
    if (Array.isArray(options) && options.length > 0) {
      const inserted = await Promise.all(
        options.map((opt) => insertPollOption(createdPoll.id, opt))
      );
      insertedOptions = inserted.flatMap((r) => r || []);
    }

    res.status(200).json({ ...createdPoll, options: insertedOptions });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function getPollsByHouse(req, res) {
  try {
    const house_id = req.params.house_id;
    const house_polls = await fetchPollsByHouse(house_id);
    res.status(200).json(house_polls);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function getMyPollsByHouse(req, res) {
  try {
    const house_id = req.params.house_id;
    const user_id = req.params.user_id;
    const my_polls = await fetchMyPollsByHouse(house_id, user_id);
    res.status(200).json(my_polls);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function getMyHistoricPollsByHouse(req, res) {
  try {
    const house_id = req.params.house_id;
    const user_id = req.params.user_id;
    const my_historic_polls = await fetchMyHistoricPollsByHouse(
      house_id,
      user_id
    );
    res.status(200).json(my_historic_polls);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function getMyPendingPollsByHouse(req, res) {
  try {
    const house_id = req.params.house_id;
    const user_id = req.params.user_id;
    const my_pending_polls = await fetchMyPendingPollsByHouse(
      house_id,
      user_id
    );
    res.status(200).json(my_pending_polls);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function getPollById(req, res) {
  try {
    const poll_id = req.params.id;
    const poll = await fetchPollById(poll_id);
    res.status(200).json(poll);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function deletePollById(req, res) {
  try {
    const poll_id = req.params.id;
    await deletePoll(poll_id);
    await res
      .status(200)
      .json({ message: `Poll with ID ${poll_id} deleted successfully.` });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function addVote(req, res) {
  try {
    const poll_option_id = req.params.poll_option_id;
    const { voter_id, poll_id } = req.body;
    await insertVote(poll_option_id, voter_id, poll_id);
    await res
      .status(200)
      .json({
        message: `Vote to poll with id: ${poll_id} submitted successfully.`,
      });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

// Comments
export async function addNewComment(req, res) {
  try {
    const { poll_id, created_by, comment_text } = req.body;
    await insertComment(poll_id, created_by, comment_text);
    res.status(200).json("Comment added successfully");
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function getCommentsByPoll(req, res) {
  try {
    const poll_id = req.params.poll_id;
    const comments = await fetchCommentsByPoll(poll_id);
    console.log("Comments are:", comments);
    await res.status(200).json(comments);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function deleteCommentById(req, res) {
  try {
    const comment_id = req.params.comment_id;
    await deleteComment(comment_id);
    await res
      .status(200)
      .json({ message: `Comment with ID ${comment_id} deleted successfully.` });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
