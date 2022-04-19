import Link from "next/link";
import dbConnect from "../lib/dbConnect";
import Snake_player from "../models/Snake_player";
import { useState } from "react";

const Index = ({ player }) => {
  const [message, setMessage] = useState("");

  const handleDelete = async (itemId) => {
    console.log("Writing excercise id" + itemId);
    try {
      await fetch(`/api/player/${itemId}`, {
        method: "Delete",
      });
      router.push("/");
    } catch (error) {
      setMessage("Failed to delete the player.");
    }
  };
  return (
    <div>
      <h1>
        <Link href="/newPlayer">
          <button className="newFormButton">
            {" "}
            <a>New Game</a>{" "}
          </button>
        </Link>

      </h1>
      <h1>Leader Board</h1>
      <div className="headers">
      </div>
     

      {/* Create a row for each player */}
      <div >
        <ol >

        {player.map((player) => (
          <li         key={player._id}
          className="score-inner-grid">
           
              <span ><h2>{player.player_name}</h2> </span>
              <span ><h2>Score : {player.score}</h2> </span>

          </li>
        ))}
        </ol>
      </div>
    </div>
  );
};

/* Retrieves player(s) data from mongodb database */
export async function getServerSideProps() {
  await dbConnect();

  /* find all the data  our database */
  const result = await Snake_player.find().sort( { "_id": -1 } )
  const player = result.map((doc) => {
    const player = doc.toObject();
    player._id = player._id.toString();
    return player;
  });

  return { props: { player: player } };
}

export default Index;
