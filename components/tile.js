import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Form } from "semantic-ui-react";
import { tileArray } from "./tile_array";
import Link from "next/link";

export function Tile(tile) {
    const addMark = (event) => {
      let tile_grid = document.querySelectorAll(".grid div");
      let tile = event.target;
      let tile_below = parseInt(tile_grid[tile.id].id) + 7;
      if (
        !tile.classList.contains("taken") &&
        tile_grid[tile_below].classList.contains("taken")
      ) {
        event.target.classList.add("taken");

        if (isPlayer1) {
          event.target.classList.add("player");
          setIsPlayer1(false);
        } else {
          event.target.classList.add("score");

          setIsPlayer1(true);
        }
        checkGrid();
      }
    };

    return (
      <div
        className="tile"
        key={tile}
        id={tile}
        onClick={() => {
          addMark(event);
        }}
      >
        {tile}{" "}
      </div>
    );
  }