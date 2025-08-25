<div class="rules-page">
  <div class="container">
    <h1>📋 Baduk (Go) Rules & Features</h1>
    
    <div class="content-grid">
      <section class="basic-rules">
        <h2>⚫⚪ Basic Rules</h2>
        <ul>
          <li>Two players take turns placing stones on a grid (9×9, 13×13, or 19×19)</li>
          <li>Black always plays first</li>
          <li>Capture opponent stones by surrounding them completely</li>
          <li>Suicide moves (placing stones with no liberties) are illegal</li>
          <li>Ko rule prevents infinite capture loops</li>
          <li>Game ends when both players pass consecutively</li>
          <li>Winner is determined by territory + captured stones + komi</li>
        </ul>
      </section>
      
      <section class="advanced-concepts">
        <h2>🧠 Advanced Concepts</h2>
        <div class="concepts">
          <div class="concept">
            <h4>📍 Liberties</h4>
            <p>Empty spaces adjacent to a stone or group. Groups with no liberties are captured.</p>
          </div>
          
          <div class="concept">
            <h4>🏰 Territory</h4>
            <p>Empty spaces controlled by one player. Final score includes territory points.</p>
          </div>
          
          <div class="concept">
            <h4>⚖️ Komi</h4>
            <p>Compensation points for White (usually 6.5) to balance first-move advantage.</p>
          </div>
          
          <div class="concept">
            <h4>🔄 Ko Rule</h4>
            <p>Cannot immediately recapture a single stone that just captured your stone.</p>
          </div>
          
          <div class="concept">
            <h4>🎯 Handicap</h4>
            <p>Weaker player gets extra stones at the start (2-9 stones typical).</p>
          </div>
          
          <div class="concept">
            <h4>👻 Dead Stones</h4>
            <p>Stones that cannot avoid capture. Removed during scoring phase.</p>
          </div>
        </div>
      </section>
      
      <section class="scoring-system">
        <h2>🏆 Scoring System</h2>
        <div class="scoring">
          <div class="score-type">
            <h4>Territory Points</h4>
            <p>Each empty space surrounded by your stones = 1 point</p>
          </div>
          
          <div class="score-type">
            <h4>Captured Stones</h4>
            <p>Each opponent stone you captured = 1 point</p>
          </div>
          
          <div class="score-type">
            <h4>Komi (White only)</h4>
            <p>Fixed bonus points (usually 6.5) to compensate for playing second</p>
          </div>
          
          <div class="score-example">
            <h4>Example Final Score:</h4>
            <div class="example">
              <div class="player">
                <h5>⚫ Black</h5>
                <p>Territory: 85 points</p>
                <p>Prisoners: 12 points</p>
                <p><strong>Total: 97 points</strong></p>
              </div>
              
              <div class="player">
                <h5>⚪ White</h5>
                <p>Territory: 78 points</p>
                <p>Prisoners: 8 points</p>
                <p>Komi: 6.5 points</p>
                <p><strong>Total: 92.5 points</strong></p>
              </div>
            </div>
            <p class="winner">Black wins by 4.5 points!</p>
          </div>
        </div>
      </section>
      
      <section class="event-sourcing-features">
        <h2>⚡ Event Sourcing Features</h2>
        <div class="features">
          <div class="feature">
            <h3>🕰️ Time Travel</h3>
            <p>Jump back to any move in the game history and see the exact board position</p>
          </div>
          
          <div class="feature">
            <h3>🌿 Timeline Branching</h3>
            <p>Go back in time and try different moves to create alternate game paths</p>
          </div>
          
          <div class="feature">
            <h3>📈 Complete Game Record</h3>
            <p>Every move, capture, and pass is recorded as an immutable event</p>
          </div>
          
          <div class="feature">
            <h3>🎯 Strategic Analysis</h3>
            <p>Study winning patterns by replaying and analyzing game sequences</p>
          </div>
          
          <div class="feature">
            <h3>🔄 Perfect Replay</h3>
            <p>Recreate any game state from the complete event history</p>
          </div>
          
          <div class="feature">
            <h3>🏗️ Scalable Architecture</h3>
            <p>Same event sourcing pattern handles simple 9×9 games to complex 19×19 matches</p>
          </div>
        </div>
      </section>
      
      <section class="board-sizes">
        <h2>📐 Board Sizes</h2>
        <div class="boards">
          <div class="board-size">
            <h4>9×9 Board</h4>
            <p>Great for beginners</p>
            <p>Quick games (15-30 minutes)</p>
            <p>Less complex patterns</p>
          </div>
          
          <div class="board-size">
            <h4>13×13 Board</h4>
            <p>Intermediate level</p>
            <p>Medium games (30-60 minutes)</p>
            <p>Good for learning</p>
          </div>
          
          <div class="board-size">
            <h4>19×19 Board</h4>
            <p>Professional standard</p>
            <p>Long games (1-3+ hours)</p>
            <p>Maximum complexity</p>
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
    box-shadow: 0 10px 30px rgba(139, 69, 19, 0.2);
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
    background: linear-gradient(135deg, #8B4513, #D2B48C);
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
    box-shadow: 0 4px 15px rgba(139, 69, 19, 0.1);
  }
  
  section h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    color: #8B4513;
  }
  
  .concepts,
  .features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }
  
  .concept,
  .feature {
    padding: 1.5rem;
    background: #FFF8DC;
    border-radius: 0.75rem;
    border-left: 4px solid #D2B48C;
  }
  
  .concept h4,
  .feature h3 {
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #8B4513;
  }
  
  .scoring {
    display: grid;
    gap: 1.5rem;
  }
  
  .score-type {
    padding: 1rem;
    background: #F0F8FF;
    border-radius: 0.5rem;
  }
  
  .score-type h4 {
    color: #4169E1;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  
  .score-example {
    background: #E6F3FF;
    padding: 1.5rem;
    border-radius: 1rem;
    margin-top: 1rem;
  }
  
  .example {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    margin: 1rem 0;
  }
  
  .player {
    padding: 1rem;
    background: white;
    border-radius: 0.5rem;
    text-align: center;
  }
  
  .player h5 {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  
  .winner {
    text-align: center;
    font-size: 1.25rem;
    font-weight: 700;
    color: #8B4513;
    margin-top: 1rem;
  }
  
  .boards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
  }
  
  .board-size {
    padding: 1.5rem;
    background: linear-gradient(135deg, #DEB887, #F5DEB3);
    border-radius: 1rem;
    text-align: center;
  }
  
  .board-size h4 {
    font-weight: 600;
    margin-bottom: 1rem;
    color: #8B4513;
  }
  
  ul {
    padding-left: 1.5rem;
  }
  
  li {
    margin-bottom: 0.5rem;
    color: #4b5563;
    line-height: 1.6;
  }
  
  @media (max-width: 768px) {
    .rules-page {
      margin: 1rem;
      padding: 1rem;
    }
    
    h1 {
      font-size: 2rem;
    }
    
    .concepts,
    .features,
    .example,
    .boards {
      grid-template-columns: 1fr;
    }
  }
</style>