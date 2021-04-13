const getFollowings = async (userId, client) => {
  const followingPersons = [];
  let hasNextPage = true;
  let nextPageToken = undefined;

  while (hasNextPage === true) {
    let following = await client.getFollowings({
      userId,
      first: 50,
      after: nextPageToken,
    });

    if (!following.page_info.has_next_page) {
      hasNextPage = false;
      nextPageToken = undefined;
    }

    nextPageToken = following.page_info.end_cursor;

    followingPersons.push(...following.data);
  }

  return followingPersons;
};

const getFollowers = async (userId, client) => {
  const followerPersons = [];
  let hasNextPageFollower = true;
  let nextPageTokenFollower = undefined;

  while (hasNextPageFollower === true) {
    let followers = await client.getFollowers({
      userId,
      first: 50,
      after: nextPageTokenFollower,
    });

    if (!followers.page_info.has_next_page) {
      hasNextPageFollower = false;
      nextPageTokenFollower = undefined;
    }

    nextPageTokenFollower = followers.page_info.end_cursor;

    followerPersons.push(...followers.data);
  }

  return followerPersons;
};

const pause = async (ms) => {
  return new Promise(resolve => {
    setTimeout(() => resolve(), ms)
  })
}

module.exports = {
  getFollowings,
  getFollowers,
  pause
};
