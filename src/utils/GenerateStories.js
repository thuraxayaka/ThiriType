import aesopFables from "@/assets/aesopFables.json";
import { generateRandomNumber } from "./generateRand";
const generateStory = (length) => {
  let stories;
  switch (length) {
    case "short":
      stories = aesopFables.stories.filter((data) => data.story.length <= 5);
      break;
    case "medium":
      stories = aesopFables.stories.filter(
        (data) => data.story.length > 5 && data.story.length <= 10
      );
      break;
    case "long":
      stories = aesopFables.stories.filter((data) => data.story.length > 10);
      break;
  }
  const rand = generateRandomNumber(0, stories.length);
  return stories[rand];
};

export default generateStory;
