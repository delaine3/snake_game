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
  const [player_name, set_player_name] = useState("Anonymous");
  const [gameOver, setGameOver] = useState(false);
  const [timer, setTimer] = useState(0);
  const [start_called, setStart_called] = useState(false);
  const [showPlayerForm, set_showPlayerForm] = useState(true);
  const [direction, set_direction] = useState(1);
  const [speed, set_speed] = useState(1000);

  const [currentSnake, set_currentSnake] = useState([2, 1]);
  const [apple_present, set_apple_present] = useState(false);
  const [score, set_score] = useState(1);
  const width = 10;
  let currentIndex = 0;
  let appleIndex = 0;

  const game_timer = setTimeout(() => {
    if (inProgress) {
      setTimer(timer + 1);
    }
  }, speed);

  useEffect(() => {
    if (gameOver) {
      clearTimeout(game_timer);
      setInprogress(false);
    }
  }, [score, timer]);

  useEffect(() => {
    const scoreDisplay = document.querySelector(".score");
    let tile_grid = document.querySelectorAll(".tile");
    if (start_called && !gameOver && inProgress) {
      currentSnake.forEach((index) =>
        tile_grid[index].classList.remove("snake")
      );
      currentSnake.forEach((index) =>
        tile_grid[index].classList.remove("head")
      );

      tile_grid[appleIndex].classList.remove("apple");
      scoreDisplay.innerText = score;
      currentIndex = 0;

      currentSnake.forEach((index) => tile_grid[index].classList.add("snake"));
      tile_grid.forEach((index) => index.classList.remove("head"));

      moveOutcomes();
      if (!apple_present) {
        randomApple();
        set_apple_present(true);
      }
    }
  }, [timer]);

  useEffect(() => {
    if (inProgress && !showPlayerForm && !gameOver) {
      window.addEventListener("keydown", (e) => {
        let tile_grid = document.querySelectorAll(".tile");

        console.log("IN PROGRESS? " + inProgress);
        tile_grid[currentIndex].classList.remove("snake");

        if (e.keyCode === 39) {
          set_direction(1); //if we press the right arrow on our keyboard, the snake will go right one
        } else if (e.keyCode === 38) {
          set_direction(-width); // if we press the up arrow, the snake will go back ten divs, appearing to go up
        } else if (e.keyCode === 37) {
          set_direction(-1); // if we press left, the snake will go left one div
        } else if (e.keyCode === 40) {
          set_direction(width); //if we press down, the snake head will instantly appear in the div ten divs from where you are now
        }
      });
    }
  }, [inProgress, gameOver, showPlayerForm]);

  function randomApple() {
    let tile_grid = document.querySelectorAll(".tile");
    do {
      appleIndex = Math.floor(Math.random() * tile_grid.length); //Call this function until it lands on a tile that does not contain the snake class
    } while (tile_grid[appleIndex].classList.contains("snake"));
    tile_grid[appleIndex].classList.add("apple"); //Once a suitable tile has been found, give it the snake class
  }
  const start = () => {
    setStart_called(true);
    setGameOver(false);
    setInprogress(true);
  };

  let tileGrid = tileArray.map((tile) => {
    return Tile(tile);
  });

  //function that deals with ALL the ove outcomes of the Snake
  function moveOutcomes() {
    let tile_grid = document.querySelectorAll(".tile");
    let endGame = false;
    if (!gameOver) {
      //deals with snake hitting border and snake hitting self
      if (
        (currentSnake[0] + width >= width * width && direction === width) || //if snake hits bottom
        (currentSnake[0] % width === width - 1 && direction === 1) || //if snake hits right wall
        (currentSnake[0] % width === 0 && direction === -1) || //if snake hits left wall
        (currentSnake[0] - width < 0 && direction === -width) || //if snake hits the top
        tile_grid[currentSnake[0] + direction].classList.contains("snake") //if snake goes into itself
      ) {
        clearTimeout(game_timer);
        endGame = true;
        setGameOver(true);
        setStart_called(false);
      }

      const tail = currentSnake.pop(); //removes last ite of the array and shows it
      tile_grid[tail].classList.remove("snake"); //removes class of snake from the TAIL

      currentSnake.unshift(currentSnake[0] + direction); //gives direction to the head of the array
      // console.log(currentSnake[0] + direction);
      tile_grid[currentSnake[0]].classList.remove("head"); //removes class of snake from the TAIL

      const scoreDisplay = document.querySelector(".score");

      //deals with snake getting apple
      var snake_head = tile_grid[currentSnake[0]];
      if (!endGame) {
        if (snake_head.classList.contains("apple")) {
          set_apple_present(false);

          snake_head.classList.remove("apple");
          tile_grid[tail].classList.add("snake");
          currentSnake.push(tail);
          set_score(score + 1);
          scoreDisplay.textContent = score;
          set_speed(speed * 0.95);
          clearTimeout(game_timer);
        }
        snake_head.classList.add("snake");

        tile_grid[currentSnake[0]].classList.add("head"); //removes class of snake from the TAIL
      }
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
          player_name: player_name != "" ? player_name : "Anonymous",
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
      alert("Failed to add player");
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
    <div className="">
      <h1 className="title">Snake Game</h1>

      <h1>
        <Link href="/">
          <button className="newFormButton">
            {" "}
            <a>Score Board</a>{" "}
          </button>
        </Link>
      </h1>

      {showPlayerForm ? (
        <div>
          <Form className="save-player" id={formId}>
            <h2>
              Type in the name of the player if you would you like to save the
              result of this game.
            </h2>
            <label htmlFor="player">Player name</label>
            <textarea
              id="name-area"
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
        <div>
          <p>
            Use the colorful navigatipn buttons below or use your keyboard
            &#8592; &#8593; &#x2193; &#8594; keys to move the snake. Tap the
            start button to begin. Try not to hit the walls!
          </p>
          <button id="start" onClick={start}>
            Start
          </button>
          <h1 className="score">Score : </h1>
          {inProgress ? (
            <div>
              <div id="tile-grid" className="grid">
                {tileGrid}
              </div>
              <div className="navigation-buttons">
                <button
                  onClick={() => set_direction(-1)}
                  className="nav-btn"
                  id="left"
                >
                  &#8592;
                </button>
                <button
                  onClick={() => set_direction(-width)}
                  className="nav-btn"
                  id="up"
                >
                  &#8593;
                </button>
                <button
                  onClick={() => set_direction(width)}
                  className="nav-btn"
                  id="down"
                >
                  &#x2193;
                </button>
                <button
                  onClick={() => set_direction(1)}
                  className="nav-btn"
                  id="right"
                >
                  &#8594;
                </button>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
      {gameOver ? (
        <Form className="save-player" id={formId} onSubmit={handleSubmit}>
          <p>Player : {player_name != "" ? player_name : "Anonymous"}</p>

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
