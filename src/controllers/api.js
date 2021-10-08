const axios = require("axios");

exports.ping_server = (req, res) => {
  return res.status(200).json({
    sucess: "true",
  });
};

exports.get_posts_param = async (req, res) => {
  // Decouple params
  const { tags, sortBy, direction } = req.params;
  const SORTBY_OPTIONS = ["id", "reads", "likes", "popularity", undefined];
  const DIRECTION_OPTIONS = ["asc", "desc", undefined];

  // Error handling - guarding principle
  if (sortBy && !SORTBY_OPTIONS.includes(sortBy)) {
    return res.status(400).send({
      error: "sortBy parameter is invalid",
    });
  }
  if (direction && !DIRECTION_OPTIONS.includes(direction)) {
    return res.status(400).send({
      error: "sortBy (direction) parameter is invalid",
    });
  }
  return res.status(200).send({
    status: "success",
  });
};
