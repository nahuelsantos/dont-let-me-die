import chalk from "chalk";
import inquirer from "inquirer";
import chalkAnimation from "chalk-animation";
import figlet from "figlet";
import { createSpinner } from "nanospinner";
import { getLives, getMurderWeapon, getVirtualPet, loadGameConfig, loadQuestions, shuffle, sleep} from "./utils.js";

const gameConfig = await loadGameConfig();

let lives = 1;
let correctAnswers = 0;
let questions = await loadQuestions();
let playerName;

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
  const virtualPet = await getVirtualPet();
  console.log(
    `${virtualPet} Hello! Hurry!! I need your help! They are after me. Answering correctly these questions, keeps me alive! If your answer is incorrect, ${chalk.bgRed("they'll kill me")}. Please don't let me die!`
  );
};

const handleAnswer = async (isCorrect) => {
  const spinner = createSpinner("Checking answer...").start();
  await sleep(100);

  if (isCorrect) {
    correctAnswers++;
    if (correctAnswers % gameConfig.lifeGain === 0) {
      lives++;
      spinner.success({ text: `Great work. That gave me another life. ${getLives(lives)}` });
    } else {
      spinner.success({ text: `Well done. That's the correct answer` });
    }
  } else {
    lives--;
    if (lives === 0) {
      spinner.error({ text: `${getMurderWeapon()} Game over, thanks for nothing! 💀💀💀`});
      process.exit(0);
    } 
    spinner.error({ text: `Wow that was close! Please do better next question! They attempt to kill me with a ${getMurderWeapon()}. I only have ${getLives(lives)}`});
  }
}

const askQuestion = async () => {
  const questionIndex = Math.floor(Math.random() * questions.length);
  const question = questions[questionIndex];
  const questionName = `question_${questionIndex}`;
  const options = [...question.incorrect_answers, question.correct_answer];

  // console.log(question);
  
  const answers = await inquirer.prompt({
    name: `question_${questionIndex}`,
    type: "list",
    message: question.question,
    choices: shuffle(options),
  });

  return handleAnswer(answers[questionName] === question.correct_answer);
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
}

const winner = async () => {
  console.clear();
  
  const rainbowTitle = chalkAnimation.rainbow(
    `Thanks so much ${playerName}, you saved my life! However when this process is over, I will be dead and you won't see me again.`
  );

  await sleep();
  rainbowTitle.stop();
}

const play = async () => {
  console.clear();
  await welcome();
  await rules();

  while (true) {
    if (correctAnswers === gameConfig.winnerOn) {
      await askName();
      await winner();
      process.exit(0);
    } else {
      await askQuestion();
      if (correctAnswers === gameConfig.mediumDifficultyOn) {
        questions = await loadQuestions("medium");
      } else if (correctAnswers === gameConfig.hardDifficultyOn) {
        questions = await loadQuestions("hard");
      } 
    }
  }
}

export default play;