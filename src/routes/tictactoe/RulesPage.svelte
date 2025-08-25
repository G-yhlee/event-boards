<div class="rules-page">
  <div class="container">
    <h1>📋 Tic-Tac-Toe Rules & Features</h1>
    
    <div class="content-grid">
      <section class="rules-section">
        <h2>🎯 Basic Rules</h2>
        <ul>
          <li>Two players take turns placing X and O on a 3×3 grid</li>
          <li>X always goes first</li>
          <li>Get three in a row (horizontal, vertical, or diagonal) to win</li>
          <li>If the board fills up with no winner, it's a draw</li>
        </ul>
      </section>
      
      <section class="features-section">
        <h2>⚡ Event Sourcing Features</h2>
        <div class="feature-list">
          <div class="feature">
            <h3>🕰️ Time Travel</h3>
            <p>Click on any event in the history to jump back to that moment in the game</p>
          </div>
          
          <div class="feature">
            <h3>🌿 Timeline Branching</h3>
            <p>Go back in time and make different moves to create alternate timelines</p>
          </div>
          
          <div class="feature">
            <h3>📈 Complete History</h3>
            <p>Every move is recorded as an immutable event that can be replayed</p>
          </div>
          
          <div class="feature">
            <h3>🔄 State Reconstruction</h3>
            <p>Game state is rebuilt from events, ensuring perfect accuracy</p>
          </div>
        </div>
      </section>
      
      <section class="strategy-section">
        <h2>🧠 Strategy Tips</h2>
        <div class="tips">
          <div class="tip">
            <h4>Center Control</h4>
            <p>The center square (position 5) is part of 4 winning lines - most valuable!</p>
          </div>
          
          <div class="tip">
            <h4>Corner Strategy</h4>
            <p>Corners are strong - each corner is part of 3 winning lines</p>
          </div>
          
          <div class="tip">
            <h4>Block & Win</h4>
            <p>Always block opponent's winning move, then look for your own</p>
          </div>
          
          <div class="tip">
            <h4>Fork Attack</h4>
            <p>Create two winning threats at once - your opponent can only block one!</p>
          </div>
        </div>
      </section>
      
      <section class="event-sourcing-section">
        <h2>🏗️ Event Sourcing Architecture</h2>
        <div class="architecture">
          <div class="arch-item">
            <h4>Events</h4>
            <ul>
              <li>GameStarted</li>
              <li>MoveMade</li>
              <li>GameWon</li>
              <li>GameDrawn</li>
              <li>GameReset</li>
            </ul>
          </div>
          
          <div class="arch-item">
            <h4>Aggregates</h4>
            <ul>
              <li>GameAggregate</li>
              <li>Board State</li>
              <li>Win Detection</li>
              <li>Player Turns</li>
            </ul>
          </div>
          
          <div class="arch-item">
            <h4>Commands</h4>
            <ul>
              <li>StartGame</li>
              <li>MakeMove</li>
              <li>ResetGame</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  </div>
</div>

<style>
  .rules-page {
    padding: 2rem;
    background: rgba(255, 255, 255, 0.95);
    margin: 2rem;
    border-radius: 1rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    min-height: calc(100vh - 200px);
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  h1 {
    text-align: center;
    font-size: 2.5rem;
    font-weight: 700;
    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 3rem;
  }
  
  .content-grid {
    display: grid;
    gap: 2rem;
  }
  
  section {
    background: white;
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
  
  section h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    color: #1f2937;
  }
  
  .feature-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
  }
  
  .feature {
    padding: 1.5rem;
    background: #f8fafc;
    border-radius: 0.75rem;
    border-left: 4px solid #3b82f6;
  }
  
  .feature h3 {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #1f2937;
  }
  
  .tips {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }
  
  .tip {
    padding: 1rem;
    background: #fef3c7;
    border-radius: 0.5rem;
  }
  
  .tip h4 {
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #92400e;
  }
  
  .tip p {
    font-size: 0.875rem;
    color: #6b7280;
  }
  
  .architecture {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
  }
  
  .arch-item {
    padding: 1.5rem;
    background: #f0f9ff;
    border-radius: 0.75rem;
  }
  
  .arch-item h4 {
    font-weight: 600;
    margin-bottom: 1rem;
    color: #0369a1;
  }
  
  .arch-item ul {
    list-style: none;
    padding: 0;
  }
  
  .arch-item li {
    padding: 0.25rem 0;
    color: #374151;
    font-size: 0.875rem;
  }
  
  ul {
    padding-left: 1.5rem;
  }
  
  li {
    margin-bottom: 0.5rem;
    color: #4b5563;
  }
  
  @media (max-width: 768px) {
    .rules-page {
      margin: 1rem;
      padding: 1rem;
    }
    
    h1 {
      font-size: 2rem;
    }
    
    .feature-list,
    .tips,
    .architecture {
      grid-template-columns: 1fr;
    }
  }
</style>