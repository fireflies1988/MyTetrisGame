# My Tetris Game
🤗 Beautiful Tetris created with HTML, CSS, JavaScript. [Play it now](https://beautiful-tetris.vercel.app/)

# Table of contents
* [Features](#features)
* [Screenshots](#screenshots)
* [Sources](#sources)

# Features
1. **Lock delay**: refers to how many seconds a Tetromino waits while on the ground before locking.
2. **Super rotation system**: represents where and how tetrominoes spawn, how they rotate, and what wall kicks they may perform.
    * Spawn Orientation and Location
      - All tetrominoes spawn horizontally and wholly above the playfield.
      - All tetrominoes spawn centrally, three cells from the left wall.
      - The J, L and T spawn pointing up.
      - The tetrominoes spawn in rows 22 (Z, S, T, L, J) and 23 (I, O).
    * Basic rotation
      > ![Basic rotation](https://static.wikia.nocookie.net/tetrisconcept/images/3/3d/SRS-pieces.png/revision/latest/scale-to-width-down/336?cb=20060626173148)
    * Wall kicks
      > When the player attempts to rotate a tetromino, but the position it would normally occupy after basic rotation is obstructed, 
      (either by the wall or floor of the playfield, or by the stack), the game will attempt to "kick" the tetromino into an alternative position nearby.
      </blockquote>There are a bunch of bugs here that I haven’t fixed yet 😂. But it’s still playable, you can do almost all kinds of twists that a modern Tetris has like Tetris 99, Tetris Axis...
3. **Next queue**: preview the upcoming Tetrimino in the Next Queue to plan ahead and increase your scoring opportunities.
4. **Hold queue**: store a falling Tetrimino in the Hold Queue for later use.
5. **Ghost piece**: use the Ghost Piece to determine the best fit for the falling Tetrimino. This helpful guide appears directly below the falling Tetrimino and displays possible placements.
6. **Level**: As lines are cleared, the level increases and Tetriminos fall faster, making the game progressively more challenging.
7. **Simple scoring system**: I actually didn’t know how to detect and give scoring rewards for twisting a tetromino into a tight space like T-spin double, T-spin triple... So I just skipped it. 😂😁
    * Single line clear: 100 points
    * Double line clear: 300 points
    * Triple line clear: 500 points
    * Tetris line clear (4 line clear): 800 points

# Screenshots
![Screenshot (1)](/screenshots/Screenshot%20(1).png)
![Screenshot (2)](/screenshots/Screenshot%20(2).png)
![Screenshot (3)](/screenshots/Screenshot%20(3).png)
![Screenshot (4)](/screenshots/Screenshot%20(4).png)
![Screenshot (5)](/screenshots/Screenshot%20(5).png)
![Screenshot (6)](/screenshots/Screenshot%20(6).png)
![Screenshot (7)](/screenshots/Screenshot%20(7).png)
![Screenshot (8)](/screenshots/Screenshot%20(8).png)

# Sources
  * A part of JS source code is based on the “Create tetris game using JS and HTML 5” tutorial by Code Explained.
  * CSS loading effect is based on the “Creative CSS loading animations effects” tutorial by Online Tutorials.
