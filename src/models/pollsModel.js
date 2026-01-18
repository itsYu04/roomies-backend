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
    .select("*, poll_options(*)")
    .eq("house_id", house_id)
    .eq("created_by", user_id)
    .eq("is_closed", false)
    .gt("expires_at", today);
  if (error) throw new Error(error.message);

  const normalized = (data || []).map((p) => ({
    ...p,
    options: p.poll_options ?? [],
  }));

  const creatorIds = [...new Set(normalized.map((p) => p.created_by))].filter(
    Boolean
  );
  if (creatorIds.length === 0) return normalized;

  const { data: creators, error: creatorsError } = await supabase
    .from("user_profile")
    .select("id, username")
    .in("id", creatorIds);

  if (creatorsError) throw new Error(creatorsError.message);

  const creatorsById = Object.fromEntries(
    (creators || []).map((c) => [c.id, c.username])
  );

  const withUsernames = normalized.map((p) => ({
    ...p,
    created_by_username: creatorsById[p.created_by] ?? null,
  }));

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
    .eq("voter_id", user_id);

  if (votesError) throw new Error(votesError.message);

  const votedPollIds = votes.map((v) => v.poll_id);
  const pendingPolls = polls.filter((p) => !votedPollIds.includes(p.id));

  const creatorIds = [...new Set(pendingPolls.map((p) => p.created_by))].filter(
    Boolean
  );
  if (creatorIds.length === 0) return pendingPolls;

  console.log("creatorIds", creatorIds);

  const { data: creators, error: creatorsError } = await supabase
    .from("user_profile")
    .select("id, username")
    .in("id", creatorIds);

  if (creatorsError) throw new Error(creatorsError.message);

  console.log("creators", creators);
  const creatorsById = Object.fromEntries(
    creators.map((c) => [c.id, c.username])
  );

  const pendingPollsWithUsernames = pendingPolls.map((p) => ({
    ...p,
    created_by_username: creatorsById[p.created_by] ?? null,
  }));

  console.log("pendingPollsWithUsernames", pendingPollsWithUsernames);

  return pendingPollsWithUsernames;
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
      ? user_profile[0]?.username ?? null
      : user_profile?.username ?? null;
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
