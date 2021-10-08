const axios = require("axios");
const rclient = require("../redis_db");

exports.ping_server = (req, res) => {
  return res.status(200).json({
    sucess: "true",
  });
};

exports.get_posts_param = async (req, res) => {
  // Decouple query: tag - required / sortBy - optional / direction - optional
  const { tag, sortBy } = req.query;
  let { direction } = req.query;
  const SORTBY_OPTIONS = ["id", "reads", "likes", "popularity"];
  const DIRECTION_OPTIONS = ["asc", "desc"];
  direction = direction || "asc";

  // get data from redis_db
  //   const rdata = await rclient.get("posts");
  //   if (rdata) {
  //     console.log(JSON.parse(rdata));
  //   }

  // Error handling - guarding principle
  if (!tag) {
    return res.status(400).json({
      error: "tag is required",
    });
  }
  if (sortBy && !SORTBY_OPTIONS.includes(sortBy)) {
    return res.status(400).json({
      error: "sortBy parameter is invalid",
    });
  }
  if (direction && !DIRECTION_OPTIONS.includes(direction)) {
    return res.status(400).json({
      error: "direction parameter is invalid",
    });
  }

  // Handling tags helper function
  const sendGetRequest = async (tag, sortBy, direction) => {
    // check if input: tag is an array (multiple tags)
    if (tag instanceof Array) {
      const posts = new Set();
      try {
        for (item in tag) {
          const resp = await axios.get(
            `https://api.hatchways.io/assessment/blog/posts?tag=${tag[item]}&sortBy=${sortBy}&direction=${direction})`
          );
          resp.data.posts.forEach((i) => posts.add(i));
        }
        // Convert set into an array for filtering
        let filteredData = filter(Array.from(posts));

        // Set key data in redis
        // await rclient.set("posts", JSON.stringify(filteredData));
        return res.status(200).json({
          posts: filteredData,
        });
      } catch (error) {
        return res.status(500).json({
          error,
        });
      }
    } else {
      // single input tag
      try {
        const resp = await axios.get(
          `https://api.hatchways.io/assessment/blog/posts?tag=${tag}&sortBy=${sortBy}&direction=${direction}`
        );
        // filter by sortBy and Direction
        let posts = filter(resp.data.posts);

        // Set key data in redis
        // await rclient.set("posts", JSON.stringify(posts));
        res.status(200).json({
          posts,
        });
      } catch (err) {
        return res.status(500).json({
          error: err,
        });
      }
    }
  };

  // Filtering helper for sortBy and direction
  const filter = (postsData) => {
    if (sortBy && direction) {
      if (direction === "asc") {
        sortedResp = postsData.sort((a, b) => a[sortBy] - b[sortBy]);
      } else if (direction === "desc") {
        sortedResp = postsData.sort((a, b) => b[sortBy] - a[sortBy]);
      }
      return sortedResp;
    }
  };

  // Handling input tags - Multiple tag queries
  if (tag && tag.includes(",")) {
    listOfTags = tag.split(",");
    sendGetRequest(listOfTags, sortBy, direction);
  } else if (tag) {
    // Single tag
    sendGetRequest(tag, sortBy, direction);
  }
};
