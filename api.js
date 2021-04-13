const Instagram = require("instagram-web-api");
const express = require("express");
const FileCookieStore = require("tough-cookie-filestore2");
const cookieStore = new FileCookieStore("./cookies.json");
const methods = require("./methods");

const router = express.Router();

router.post("/api/v1/instagram/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(401)
      .json({ success: false, message: "User or Password not provided" });
  }

  const client = new Instagram({ username, password, cookieStore });

  const { authenticated, user } = await client.login();

  if (!authenticated) {
    return res
      .status(401)
      .json({ success: false, message: "User or Password wrong" });
  }

  res.status(200).json({ success: true, message: "Logged In." });
});

router.get("/api/v1/instagram/following", async (req, res) => {
  const client = new Instagram({ cookieStore });
  const userId = cookieStore.idx["instagram.com"]["/"].ds_user_id.value;
  const following = await client.getFollowings({ userId, first: 100 });
  return res.status(200).json({ success: true, following });
});

router.get("/api/v1/instagram/followers", async (req, res) => {
  const client = new Instagram({ cookieStore });
  const followers = await client.getFollowings({ userId: "32979039408" });
  return res.status(200).json({ success: true, followers });
});

router.get("/api/v1/instagram/get-user/:username", async (req, res) => {
  const client = new Instagram({ cookieStore });
  const instagram = await client.getUserByUsername({
    username: req.params.username,
  });
  return res.status(200).json({ success: true, instagram });
});

router.get("/api/v1/instagram/compare-follows", async (req, res) => {
  const client = new Instagram({ cookieStore });

  const userId = cookieStore.idx["instagram.com"]["/"].ds_user_id.value;

  const followingPersons = await methods.getFollowings(userId, client);

  const followerPersons = await methods.getFollowers(userId, client);

  const personsToUnfollow = followingPersons
    .filter(
      (person) => !followerPersons.find((follower) => follower.id === person.id)
    )
    .map((person) => {
      return {
        id: person.id,
        username: person.username,
        name: person.full_name,
        link: `https://www.instagram.com/${person.username}/`,
      };
    });

    const idsToUnfollow = personsToUnfollow.map(person => person.id)

  return res.status(200).json({
    success: true,
    personsToUnfollow,
    idsToUnfollow
  });
});

router.post("/api/v1/instagram/unfollow", async (req, res) => {
  const client = new Instagram({ cookieStore });
  const ids = req.body.idsToUnfollow;

  for(const id of ids) {
    // await client.unfollow({ userId: id })
    await methods.pause(4000);
    console.warn("Unfollow no Perfil > ", id);
  }
})

module.exports = (app) => app.use(router);
