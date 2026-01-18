import supabase from "../config/supabase.js";

export async function insertPoll(
  house_id,
  title,
  description,
  created_by,
  expires_at,
  is_closed,
  type
) {
  const { data, error } = await supabase
    .from("polls")
    .insert([
      {
        house_id,
        title,
        description,
        created_by,
        expires_at,
        is_closed,
        type,
      },
    ])
    .select();
  if (error) throw new Error(error.message);
  return data;
}

export async function fetchPollsByHouse(house_id) {
  const today = new Date().toISOString().split("T")[0];
  const { data, error } = await supabase
    .from("polls")
    .select()
    .eq("house_id", house_id)
    .eq("is_closed", false)
    .gt("expires_at", today);
  if (error) throw new Error(error.message);
  return data;
}

export async function fetchMyPollsByHouse(house_id, user_id) {
  const today = new Date().toISOString().split("T")[0];
  const { data, error } = await supabase
    .from("polls")
    .select()
    .eq("house_id", house_id)
    .eq("created_by", user_id)
    .eq("is_closed", false)
    .gt("expires_at", today);
  if (error) throw new Error(error.message);
  return data;
}

export async function fetchMyHistoricPollsByHouse(house_id, user_id) {
  const today = new Date().toISOString().split("T")[0];
  const { data, error } = await supabase
    .from("polls")
    .select()
    .eq("house_id", house_id)
    .eq("created_by", user_id)
    .or(`is_closed.eq.true,expires_at.lte.${today}`);
  if (error) throw new Error(error.message);
  return data;
}

export async function fetchMyPendingPollsByHouse(house_id, user_id) {
  const today = new Date().toISOString().split("T")[0];
  const { data: polls, error } = await supabase
    .from("polls")
    .select()
    .eq("house_id", house_id)
    .eq("is_closed", false)
    .gt("expires_at", today);
  if (error) throw new Error(error.message);

  const { data: votes, error: votesError } = await supabase
    .from("poll_votes")
    .select("poll_id")
    .eq("user_id", user_id);

  if (votesError) throw new Error(votesError.message);

  const votedPollIds = votes.map((v) => v.poll_id);
  const pendingPolls = polls.filter((p) => !votedPollIds.includes(p.id));

  return pendingPolls;
}

export async function fetchPollById(poll_id) {
  const { data, error } = await supabase
    .from("polls")
    .select()
    .eq("id", poll_id);
  if (error) throw new Error(error.message);
  return data;
}

export async function deletePoll(poll_id) {
  const { error } = await supabase.from("polls").delete().eq("id", poll_id);
  if (error) throw new Error(error.message);
}

export async function insertComment(
  poll_id,
  created_by,
  created_at,
  comment_text
) {
  const { data, error } = await supabase
    .from("poll_comments")
    .insert([{ poll_id, created_by, created_at, comment_text }])
    .select();
  if (error) throw new Error(error.message);
  return data;
}

export async function fetchCommentsByPoll(poll_id) {
  const { data, error } = await supabase
    .from("poll_comments")
    .select()
    .eq("poll_id", poll_id);
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteComment(comment_id) {
  const { error } = await supabase
    .from("poll_comments")
    .delete()
    .eq("id", comment_id);
  if (error) throw new Error(error.message);
}
