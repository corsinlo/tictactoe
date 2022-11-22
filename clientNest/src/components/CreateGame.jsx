import React, { useState } from 'react';

const CreateGame = ({ onFormSubmit }) => {
  const [name, setName] = useState('');

  return (
    <div>
      <h4>Create new game</h4>
       
          <input
            type="text"
            placeholder="Enter your name"
            className="form-control"
            onChange={(e) => setName(e.target.value)}
          />
        
    
          <button onClick={() => onFormSubmit(name)} className="btn btn-info">
            Create Game
          </button>
        </div>
   
   
  );
};

export default CreateGame;
