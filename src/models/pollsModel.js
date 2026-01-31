import supabase from "../config/supabase.js";

export async function insertPoll(
  house_id,
  title,
  description,
  created_by,
  expires_at,
  is_closed,
  type,
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
  console.log("Data is:", data);
  return data;
}

function normalizePollOptions(polls) {
  return (polls || []).map((p) => ({
    ...p,
    options: p.poll_options ?? [],
  }));
}

async function addCreatorUsernames(polls) {
  const creatorIds = [...new Set(polls.map((p) => p.created_by))].filter(
    Boolean,
  );
  if (creatorIds.length === 0) return polls;

  const { data: creators, error: error } = await supabase
    .from("user_profile")
    .select("id, username")
    .in("id", creatorIds);

  if (error) throw new Error(creatorsError.message);

  const creatorsById = Object.fromEntries(
    (creators || []).map((c) => [c.id, c.username]),
  );

  return polls.map((p) => ({
    ...p,
    created_by_username: creatorsById[p.created_by] ?? null,
  }));
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
    .select("*, poll_options(*)")
    .eq("house_id", house_id)
    .eq("created_by", user_id)
    .eq("is_closed", false)
    .gt("expires_at", today);
  if (error) throw new Error(error.message);

  const normalized = normalizePollOptions(data);
  const withUsernames = addCreatorUsernames(normalized);
  return withUsernames;
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
  const { data, error } = await supabase
    .from("polls")
    .select("*, poll_options(*)")
    .eq("house_id", house_id)
    .neq("created_by", user_id) // Get polls from roommates only
    .eq("is_closed", false)
    .gt("expires_at", today);
  if (error) throw new Error(error.message);

  const normalized = normalizePollOptions(data);

  const pollIds = normalized.map((p) => p.id);
  if (pollIds.length === 0) return [];

  const { data: votes, error: votesError } = await supabase
    .from("poll_votes")
    .select("poll_id")
    .eq("voter_id", user_id)
    .in("poll_id", pollIds);

  if (votesError) throw new Error(votesError.message);

  const votedPollIds = new Set((votes || []).map((v) => v.poll_id));
  const notVoted = normalized.filter((p) => !votedPollIds.has(p.id));

  const withUsernames = addCreatorUsernames(notVoted);
  return withUsernames;
}

export async function fetchPollById(poll_id) {
  const { data, error } = await supabase
    .from("polls")
    .select("*, poll_options(*)")
    .eq("id", poll_id);
  if (error) throw new Error(error.message);
  const normalized = normalizePollOptions(data);
  const withUsernames = addCreatorUsernames(normalized);
  return withUsernames;
}

export async function insertPollOption(poll_id, option_text) {
  const { data, error } = await supabase
    .from("poll_options")
    .insert([{ poll_id, option_text }])
    .select();
  console.log("Poll id is: ", poll_id);
  console.log("Inserting new poll option", option_text);
  if (error) throw new Error(error.message);
  return data;
}

export async function fetchPollResults(poll_id) {
  const { data, error } = await supabase
    .from("poll_options")
    .select("id, option_text, num_votes")
    .eq("poll_id", poll_id);
  if (error) throw new Error(error.message);
  return data;
}

export async function deletePoll(poll_id) {
  const { error } = await supabase.from("polls").delete().eq("id", poll_id);
  if (error) throw new Error(error.message);
}

export async function updatePollDescription(poll_id, description) {
  const updatePayload = {};
  updatePayload.description = description;
  const { error } = await supabase
    .from("polls")
    .update(updatePayload)
    .eq("id", poll_id);
  if (error) throw new Error(error.message);
}

export async function closePoll(poll_id) {
  const updatePayload = {};
  updatePayload.is_closed = true;
  const { error } = await supabase
    .from("polls")
    .update(updatePayload)
    .eq("id", poll_id);
  if (error) throw new Error(error.message);
}

export async function insertVote(poll_option_id, voter_id, poll_id) {
  const { data, error } = await supabase
    .from("poll_votes")
    .insert([{ poll_option_id, voter_id, poll_id }])
    .select();
  if (error) throw new Error(error.message);
  return data;
}

export async function insertComment(poll_id, created_by, comment_text) {
  const { data, error } = await supabase
    .from("poll_comments")
    .insert([{ poll_id, created_by, comment_text }])
    .select();
  if (error) throw new Error(error.message);
  return data;
}

export async function fetchCommentsByPoll(poll_id) {
  const { data, error } = await supabase
    .from("poll_comments")
    .select("*, user_profile(id, username)")
    .eq("poll_id", poll_id);
  if (error) throw new Error(error.message);
  console.log("Data is: ", data);
  return (data || []).map((c) => {
    const { user_profile, ...rest } = c;
    const username = Array.isArray(user_profile)
      ? (user_profile[0]?.username ?? null)
      : (user_profile?.username ?? null);
    return { ...rest, username };
  });
}

export async function deleteComment(comment_id) {
  const { error } = await supabase
    .from("poll_comments")
    .delete()
    .eq("id", comment_id);
  if (error) throw new Error(error.message);
}
