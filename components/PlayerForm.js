import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Form } from "semantic-ui-react";
import { tileArray } from "./tile_array";
import Link from "next/link";
import { Tile } from "./tile";
const PlayerForm = ({ formId, fornewPlayer = true }) => {
  const router = useRouter();
  const contentType = "application/json";

  const [inProgress, setInprogress] = useState(false);
  const [player_name, set_player_name] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [timer, setTimer] = useState(0);
  const [start_called, setStart_called] = useState(false);
  const [pause_called, setPause_called] = useState(false);
  const [showPlayerForm, set_showPlayerForm] = useState(true);
  const [direction, set_direction] = useState(1);
  const [currentSnake, set_currentSnake] = useState([2, 1, 0]);
  const [apple_present, set_apple_present] = useState(false);
  const [score, set_score] = useState(0);
  const width = 10;
  let currentIndex = 0; //so first div in our grid
  let appleIndex = 0; //so first div in our grid
  let speed = 0.9;
  let intervalTime = 0;
  let interval = 0;

  const game_timer = setTimeout(() => {
    if (inProgress) {
      setTimer(timer + 1);
    }
  }, 1000);

  useEffect(() => {
    if (gameOver) {
      clearTimeout(game_timer);
      setInprogress(false);
    }
  }, [score, timer]);
  useEffect(() => {
    const scoreDisplay = document.querySelector(".score");
    let tile_grid = document.querySelectorAll(".tile");
    if (start_called && !gameOver) {
      currentSnake.forEach((index) =>
        tile_grid[index].classList.remove("snake")
      );
      tile_grid[appleIndex].classList.remove("apple");
      scoreDisplay.innerText = score;
      currentIndex = 0;
      currentSnake.forEach((index) => tile_grid[index].classList.add("snake"));
      moveOutcomes();
    }
  }, [start_called, timer]);

  useEffect(() => {
    if (start_called) {
      moveOutcomes();
      if (!apple_present) {
        randomApple();
        set_apple_present(true);
      }
    }
  }, [direction]);

  function randomApple() {
    let tile_grid = document.querySelectorAll(".tile");
    do {
      appleIndex = Math.floor(Math.random() * tile_grid.length);
    } while (tile_grid[appleIndex].classList.contains("snake")); //making sure apples dont appear on the snake
    tile_grid[appleIndex].classList.add("apple");
  }
  const start = () => {
    setStart_called(true);
    setGameOver(false);
    setInprogress(true);
  };
  const pause = () => {
    setPause_called(true);
    setInprogress(false);
  };
  const resume = () => {
    setPause_called(false);

    setInprogress(true);
  };

  let tileGrid = tileArray.map((tile) => {
    return Tile(tile);
  });

  //function that deals with ALL the ove outcomes of the Snake
  function moveOutcomes() {
    let tile_grid = document.querySelectorAll(".tile");
    let endGame = false
if(!gameOver){
    //deals with snake hitting border and snake hitting self
    if (
      (currentSnake[0] + width >= width * width && direction === width) || //if snake hits bottom
      (currentSnake[0] % width === width - 1 && direction === 1) || //if snake hits right wall
      (currentSnake[0] % width === 0 && direction === -1) || //if snake hits left wall
      (currentSnake[0] - width < 0 && direction === -width) || //if snake hits the top
      tile_grid[currentSnake[0] + direction].classList.contains("snake") //if snake goes into itself
    ) {
      console.log("HIT BORDER ");
      clearTimeout(game_timer);
endGame = true
      setGameOver(true)
    }

    const tail = currentSnake.pop(); //removes last ite of the array and shows it
    tile_grid[tail].classList.remove("snake"); //removes class of snake from the TAIL
    currentSnake.unshift(currentSnake[0] + direction); //gives direction to the head of the array
    const scoreDisplay = document.querySelector(".score");

    //deals with snake getting apple
    var snake_head = tile_grid[currentSnake[0]];

    console.log(tile_grid[currentSnake[0]]);
if(!endGame){
    if (snake_head.classList.contains("apple")) {
      set_apple_present(false);

      snake_head.classList.remove("apple");
      tile_grid[tail].classList.add("snake");
      currentSnake.push(tail);
      set_score(score + 1);
      scoreDisplay.textContent = score;
      clearTimeout(game_timer);

      // clearInterval(interval);
      // intervalTime = intervalTime * speed;
      // interval = setInterval(moveOutcomes, intervalTime);
    }
    snake_head.classList.add("snake");

  }
  }
  }
  //assign functions to keycodes
  function control(e) {
    let tile_grid = document.querySelectorAll(".tile");

    tile_grid[currentIndex].classList.remove("snake");

    if (e.keyCode === 39) {
      set_direction(1); //if we press the right arrow on our keyboard, the snake will go right one
      console.log("Right " + direction + " Current snake :" + currentSnake);
    } else if (e.keyCode === 38) {
      set_direction(-width); // if we press the up arrow, the snake will go back ten divs, appearing to go up
      console.log("Up " + direction + " Current snake :" + currentSnake);
    } else if (e.keyCode === 37) {
      set_direction(-1); // if we press left, the snake will go left one div
      console.log("Left " + direction + " Current snake :" + currentSnake);
    } else if (e.keyCode === 40) {
      set_direction(width); //if we press down, the snake head will instantly appear in the div ten divs from where you are now

      console.log("Down " + direction + " Current snake :" + currentSnake);
    }
  }
  /* The POST method adds a new entry in the mongodb database. */
  const postData = async () => {
    try {
      const res = await fetch("/api/player", {
        method: "POST",
        headers: {
          Accept: contentType,
          "Content-Type": contentType,
        },
        body: JSON.stringify({
          player_name: player_name,
          score: score,
          score: score != "" ? score : "Draw",
        }),
      });

      // Throw error with status code in case Fetch API req failed
      if (!res.ok) {
        throw new Error(res.status);
      }

      router.push("/");
    } catch (error) {
      setMessage("Failed to add player");
    }
  };

  const handleChange = (e) => {
    const target = e.target;
    const value = target.value;

    set_player_name(value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    postData();
  };
  const controlPlayerForm = () => {
    set_showPlayerForm(false);
  };

  return (
    <div>
      <h1>
        <Link href="/">
          <button className="newFormButton">
            {" "}
            <a>Leader Board</a>{" "}
          </button>
        </Link>
      </h1>

      {showPlayerForm ? (
        <div>
          <h1>
            <button onClick={start} className="newFormButton">
              <a>New Game</a>
            </button>
          </h1>
          <Form className="save-player" id={formId}>
            <h2>
              Type in the name of the player if you would you like to save the
              result of this game.
            </h2>
            <label htmlFor="player">Player</label>
            <input
              type="text"
              name="player"
              value={player_name}
              onChange={handleChange}
              required
            />

            <button onClick={controlPlayerForm}>Start Game</button>
          </Form>
        </div>
      ) : null}

      {!gameOver && !showPlayerForm ? (
        <div className="game">
          {start_called ? (
            <div>
              {pause_called ? (
                <button id="resume" onClick={resume}>
                  Resume
                </button>
              ) : (
                <button id="pause" onClick={pause}>
                  Pause
                </button>
              )}
            </div>
          ) : (
            <button id="start" onClick={start}>
              Start
            </button>
          )}
          <h1>Timer : {timer} </h1>
          <h1 className="score">Score : </h1>

          {inProgress ? (
            <div id="tile-grid" className="grid">
              {tileGrid}

              <input type="text" onKeyDown={control} />
            </div>
          ) : null}
        </div>
      ) : null}
      {gameOver ? (
        <Form className="save-player" id={formId} onSubmit={handleSubmit}>
          <p>Player 1 : {player_name}</p>

          <p>Score : {score}</p>
          <p>{score}</p>

          <button type="submit" className="btn submit">
            Return to Score Board
          </button>
        </Form>
      ) : null}
    </div>
  );
};

export default PlayerForm;
