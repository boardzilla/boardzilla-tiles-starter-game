import {
  createGame,
  Player,
  Game,
  Space,
  Piece,
  PieceGrid,
} from '@boardzilla/core';

export class MyGamePlayer extends Player<MyGame, MyGamePlayer> {
  /**
   * Any properties of your players that are specific to your game go here
   */
  score: number = 0; // as an example
};

export class MyGame extends Game<MyGame, MyGamePlayer> {
  /**
   * Any overall properties of your game go here
   */
  phase: number = 1; // as an example
}

/**
 * Define your game's custom pieces and spaces.
 */
export class Token extends Piece<MyGame> { // as an example
  color: 'red' | 'blue' | 'green' | 'purple';
  size?: string;
}

export default createGame(MyGamePlayer, MyGame, game => {

  const { action } = game;
  const { playerActions, loop, eachPlayer } = game.flowCommands;

  /**
   * Create your game's layout and all included pieces, e.g.:
   */
  for (const player of game.players) {
    game.create(PieceGrid, 'mat', { player });
  }

  game.create(Space, 'pool');
  $.pool.createMany(5, Token, 'blue', { color: 'blue' });
  $.pool.createMany(5, Token, 'red', { color: 'red' });
  $.pool.createMany(5, Token, 'green', { color: 'green' });
  $.pool.createMany(5, Token, 'purple', { color: 'purple' });
  $.pool.all(Token).forEach((token, i) => {
    if (i % 4 === 0) token.setShape('X');
    if (i % 4 === 1) token.setShape('XX');
    if (i % 4 === 2) token.setShape(
      'X',
      'X'
    );
    if (i % 4 === 3) token.setShape(
      'XX',
      'XX'
    );
    if (i % 4 > 1) token.size = 'large';
  });

  /**
   * Define all possible game actions, e.g.:
   */
  game.defineActions({
    take: player => action({
      prompt: 'Choose a token',
    }).chooseOnBoard(
      'token', $.pool.all(Token),
    ).placePiece(
      'token', player.my(PieceGrid)!
    ).message(
      `{{player}} drew a {{token}} token.`
    )
  });


  /**
   * Define the game flow, starting with board setup and progressing through all
   * phases and turns, e.g.:
   */
  game.defineFlow(
    () => {
      $.pool.shuffle(),
      game.announce('intro');
    },


    loop(
      eachPlayer({
        name: 'player',
        do: [
          playerActions({
            actions: ['take']
          }),
          () => {
            const mat = game.players.current()!.my(PieceGrid)!;
            const reds = mat.all(Token, { color: 'red' });
            const adjacentTo = {
              green: false,
              blue: false,
              purple: false,
              red: true,
            };
            for (const red of reds) {
              for (const adjacent of mat.adjacenciesByCell(red)) {
                adjacentTo[(adjacent.piece as Token).color] = true;
              }
            }
            if (adjacentTo.green && adjacentTo.blue && adjacentTo.purple) {
              game.finish(game.players.current());
            }
          }
        ]
      })
    )
  );
});
