import React, { useState } from 'react';

const JoinGame = ({ onFormSubmit }) => {
  const [name, setName] = useState('');
  const [gameId, setGameId] = useState('');

  return (
    <div>
      <h4>Join Game</h4>
      <div className="form-group row">
        <div className="col">
          <input
            type="text"
            placeholder="Enter your name"
            className="form-control"
            onChange={(e) => setName(e.target.value)}
          />
       
          <input
            type="text"
            placeholder="Enter game Id"
            className="form-control"
            onChange={(e) => setGameId(e.target.value)}
          />
          <button
            onClick={() => onFormSubmit(name, gameId)}
            className="btn btn-warning"
          >
            Join
          </button>
          </div>
      </div>
    </div>
  );
};

export default JoinGame;
