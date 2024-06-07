import React from 'react';
import { render, numberSetting, Space, PieceGrid } from '@boardzilla/core';
import setup, { Token } from '../game/index.js';

import './style.scss';

render(setup, {
  layout: game => {
    game.appearance({
      render: () => null
    });

    game.all(Token).appearance({
      aspectRatio: 1,
      render: () => (
        <div className="flipper">
          <div className="front"></div>
          <div className="back"></div>
        </div>
      )
    });

    game.layout(Space, {
      gap: 1,
      margin: 1,
    });

    game.all('pool').layout(Token, {
      gap: 1,
      margin: 1,
      sticky: true
    });

    for (const mat of game.all(PieceGrid)) {
      mat.configureLayout({
        rows: 4,
        columns: 4
      });
    }
  },

  announcements: {
    intro: () => (
      <div>Place a red tile next to the other 3 colors to win</div>
    )
  }
});
