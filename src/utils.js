import request from "./apiClient.js";
import emoji from "node-emoji";

export const getVirtualPet = async () => {
  const virtualPets = [
    "robot_face",
    "rat",
    "mouse2",
    "ox",
    "water_buffalo",
    "tiger2",
    "leopard",
    "rabbit2",
    "cat2",
    "dragon",
    "crocodile",
    "whale2",
    "snail",
    "snake",
    "ram",
    "goat",
    "sheep",
    "chicken",
    "dog2",
    "elephant",
    "octopus",
    "bee",
    "ladybug",
    "fish",
    "tropical_fish",
    "blowfish",
    "turtle",
    "hatching_chick",
    "baby_chick",
    "hatched_chick",
    "koala",
    "poodle",
    "dromedary_camel",
    "camel",
    "dolphin",
    "mouse",
    "cow",
    "tiger",
    "rabbit",
    "cat",
    "dragon_face",
    "whale",
    "horse",
    "monkey_face",
    "dog",
    "wolf",
    "chipmunk",
  ];
  const randomPet = virtualPets[Math.floor(Math.random() * virtualPets.length)];
  return emoji.get(randomPet);
};

export const getMurderWeapon = () => {
  const weapons = ["knife", "gun", "fire", "hocho", "wrench", "hammer"];

  const randomWeapon = weapons[Math.floor(Math.random() * weapons.length)];
  return emoji.get(randomWeapon);
};

export const getLives = (lifes) => {
  let lives = "";
  for (let i = 0; i < lifes; i++) {
    lives += emoji.get("heart");
  }
  return lives;
};

export const sleep = (ms = 500) =>
  new Promise((resolve, _reject) => setTimeout(resolve, ms));

export const getQuestions = async (difficulty = "easy") => {
  try {
    const response = await request("/api.php", {
      query: { amount: 50, difficulty },
    });
    return response.results;
  } catch (error) {
  }
};

export const shuffle = (array) => {
  let currentIndex = array.length;
  let randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};
