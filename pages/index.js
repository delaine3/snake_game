import Link from "next/link";
import dbConnect from "../lib/dbConnect";
import Snake_player from "../models/Snake_player";
import { useState } from "react";

const Index = ({ player }) => {
  const [message, setMessage] = useState("");

  return (
    <div className="leaderboard">
      <h1>
        <Link href="/newPlayer">
          <button className="newFormButton">
            {" "}
            <a>New Game</a>{" "}
          </button>
        </Link>
      </h1>
      <h1>Score Board</h1>

      {/* Create a row for each player */}
      <div>
        <ul className="score-board">
          <li className="score header" id="myHeader">
            <span className="slot">
              <h2>Player</h2>{" "}
            </span>
            <span className="slot">
              <h2>Score</h2>
            </span>
          </li>
          {player.map((player) => (
            <li key={player._id} className="score">
              <span className="slot">
                <h2>{player.player_name}</h2>{" "}
              </span>
              <span className="slot">
                <h2> {player.score}</h2>{" "}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

/* Retrieves player(s) data from mongodb database */
export async function getServerSideProps() {
  await dbConnect();

  /* find all the data  our database */
  const result = await Snake_player.find().sort([["score", "descending"]]);
  const player = result.map((doc) => {
    const player = doc.toObject();
    player._id = player._id.toString();
    return player;
  });

  return { props: { player: player } };
}

export default Index;
