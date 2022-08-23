import chalk from "chalk";
import inquirer from "inquirer";
import chalkAnimation from "chalk-animation";
import figlet from "figlet";
import { createSpinner } from "nanospinner";
import { decode } from "html-entities";
import {
  getLives,
  getMurderWeapon,
  getRanking,
  getVirtualPet,
  getQuestions,
  shuffle,
  sleep,
} from "./utils.js";

const gameConfig = {
  difficulty: "easy",
  extraLifeOn: 10,
  hardDifficultyOn: 50,
  mediumDifficultyOn: 25,
  savePlayerOn: 5,
  winsOn: 100,
};

const virtualPet = await getVirtualPet();
const askedQuestions = [];
let questions = await getQuestions();
let lives = 1;
let correctAnswers = 0;
let playerName;
let murderWeapon;

const welcome = async () => {
  figlet.text(
    "Dont let me die",
    {
      font: "ANSI Shadow",
      horizontalLayout: "default",
      verticalLayout: "default",
      width: 80,
      whitespaceBreak: true,
    },
    (err, data) => {
      if (err) {
        console.log("Something went wrong...");
        console.dir(err);
        return;
      }
      console.log(data);
    }
  );
  await sleep(500);
};

const rules = async () => {
  console.log(
    `${virtualPet} Hello! Hurry!! I need your help! They are after me. Answering correctly these questions, keeps me alive! If your answer is incorrect, ${chalk.bgRed(
      "they'll kill me"
    )}. Please don't let me die!`
  );
};

const handleAnswer = async (isCorrect) => {
  const spinner = createSpinner("Checking answer...").start();
  await sleep(Math.floor(Math.random() * 300));

  if (isCorrect) {
    correctAnswers++;
    if (correctAnswers % gameConfig.extraLifeOn === 0) {
      lives++;
      spinner.success({
        text: `Great work. That gave me another life. ${getLives(lives)}`,
      });
    } else {
      spinner.success({ text: `Well done. That's the correct answer` });
    }
  } else {
    lives--;
    murderWeapon = getMurderWeapon();
    if (lives === 0) {
      spinner.error({
        text: `${murderWeapon} Game over, thanks for nothing! 💀💀💀`,
      });
      await savePlayer();
      await printRanking();
      process.exit(0);
    }
    spinner.error({
      text: `Wow that was close! Please do better next question! They attempt to kill me with a ${murderWeapon}. I only have ${getLives(
        lives
      )}`,
    });
  }
};

const createQuestion = async (questions) => {
  let questionIndex = Math.floor(Math.random() * questions.length);
  let question = questions[questionIndex];
  let name = `${question.category[0].toLowerCase()}${question.difficulty[0]}${questionIndex}`;
  
  while (askedQuestions.includes(name)) {
    questionIndex = Math.floor(Math.random() * questions.length);
    question = questions[questionIndex];
    name = `${question.category[0].toLowerCase()}${question.difficulty[0]}${questionIndex}`;
  }
  
  const options = [
    ...question.incorrect_answers.map((q) => decode(q)),
    decode(question.correct_answer),
  ];
  const answer = question.correct_answer;

  return { name, question: question.question, options, answer };
};

const askQuestion = async (questions) => {
  const question = await createQuestion(questions);
  // console.log(question);
  const answers = await inquirer.prompt({
    name: question.name,
    type: "list",
    message: decode(question.question),
    choices: shuffle(question.options),
  });

  askedQuestions.push(question.name);

  return handleAnswer(
    answers[question.name] === decode(question.answer)
  );
};

const askName = async () => {
  const answers = await inquirer.prompt({
    name: "player_name",
    type: "input",
    message: "I never asked! What is your name?",
    default() {
      return "Player";
    },
  });

  playerName = answers.player_name;
};

const winner = async () => {
  console.clear();

  const rainbowTitle = chalkAnimation.rainbow(
    `Thanks so much ${playerName}, you saved my life! However this is over now, probably our paths won't cross again. See you!`
  );

  await sleep();
  rainbowTitle.stop();
};

const savePlayer = async () => {
  if (correctAnswers >= gameConfig.savePlayerOn) {
    const player = { 
      player: playerName,
      pet: virtualPet,
      correctAnswers,
      murderWeapon
    };
    console.log(player);
    return player;
  }
};

const updateDifficulty = async () => {
  if (correctAnswers === gameConfig.mediumDifficultyOn) {
    questions = await getQuestions("medium");
  } else if (correctAnswers === gameConfig.hardDifficultyOn) {
    questions = await getQuestions("hard");
  }
};

const printRanking = async () => {
  const ranking = await getRanking();
  // const player = await savePlayer();
  // if (player) {
  //   ranking.push(player);
  // }
  console.table(ranking.sort((a,b) => b.correctAnswers - a.correctAnswers)); 
};

const play = async () => {
  console.clear();
  
  await welcome();
  await rules();

  while (true) {
    if (correctAnswers === gameConfig.winsOn) {
      await winner();
      await savePlayer();
      process.exit(0);
    }

    await askQuestion(questions);

    if (!playerName && correctAnswers === gameConfig.savePlayerOn) {
      await askName();
    }

    await updateDifficulty();
  }
};

export default play;
