import * as line from "@line/bot-sdk";
import express from "express";
import fs from "fs";

const config = {
  channelAccessToken:
    "8E90pB6id1B3ylIhU3oWNH5Ax+OwifpH5YoeDKHLkKtFnCbYU5TEV6vVbmLk2kBU7y4h/cwT/oQvk7jr8q8DV1yvdEvfBz81rF+0ANPXI5x3odn1hKxum/K5+HPacogqEHRD/V8Y7QgIOjiq5ledowdB04t89/1O/w1cDnyilFU=",
  channelSecret: "c7700b87d3a538e330f209681a90e16a",
};

const client = new line.Client(config);
const app = express();

app.post("/webhook", line.middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

function handleEvent(event) {
  if (event.type !== "message" || event.message.type !== "text") {
    return Promise.resolve(null);
  }

  if (event.message.text.includes("天氣")) {
    const data = fs.readFileSync("./F-c0032-001.json", "utf8");
    const jsonData = JSON.parse(data);

    const weather = jsonData.current.condition.text;
    const temperature = jsonData.current.temp_c;

    const replyText = `現在的天氣是${weather}，溫度是${temperature}度`;

    return client.replyMessage(event.replyToken, {
      type: "text",
      text: replyText,
    });
  }
}

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
