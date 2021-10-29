var path = require("path");

const config = require(path.resolve(".", "config/credentials.js"));

function requestVerifier(req, res, next) {
  console.log("Request verifier got called ");
  next();
}

var postRequest = function (req, res) {
  console.log("post request got called ", req);

  try {
    // let SummarizerManager = require("node-summarizer").SummarizerManager;
    // let result = new SummarizerManager(req.body.ParsedResults,2);
    // var summarize = require ("text-summary");
    const summarize = require("text-summarisation");
    // let summary1 = result.getSummaryByFrequency().summary;
    summarize(req.body.ParsedResults, { sentences: 2 })
      .then((data) => {
        console.log("Summarize data 2 " + data, "Data type", typeof data);
        res.send(data.toString());
      })
      .catch((error) => {
        console.log("Summarize data error " + error);
        res.send(error.toString());
      });
    // var summary2 = summarize.summary(text, 1);
    // console.log(result,"summary 1 "+summary1, "summmary 2"+summary1);

    // res.send(summary1);
  } catch (err) {
    console.error("Summarize data error " + err);
    res.send(err.toString());
  }
};

module.exports = {
  validateRequest: requestVerifier,
  postRequest: postRequest,
};
