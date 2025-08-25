<div class="history-page">
  <div class="container">
    <h1>📊 Tic-Tac-Toe Statistics</h1>
    
    <div class="stats-grid">
      <section class="game-facts">
        <h2>🎯 Game Facts</h2>
        <div class="facts">
          <div class="fact">
            <h3>Total Possible Games</h3>
            <p class="big-number">255,168</p>
            <small>Considering all possible move sequences</small>
          </div>
          
          <div class="fact">
            <h3>Unique Game States</h3>
            <p class="big-number">5,478</p>
            <small>Different board configurations possible</small>
          </div>
          
          <div class="fact">
            <h3>Perfect Play Result</h3>
            <p class="big-number">Draw</p>
            <small>When both players play optimally</small>
          </div>
        </div>
      </section>
      
      <section class="winning-patterns">
        <h2>🏆 Winning Patterns</h2>
        <div class="patterns">
          <div class="pattern">
            <h4>Horizontal Wins</h4>
            <div class="pattern-grid">
              <div class="mini-board">
                <div class="cell">X</div><div class="cell">X</div><div class="cell">X</div>
                <div class="cell empty">-</div><div class="cell empty">-</div><div class="cell empty">-</div>
                <div class="cell empty">-</div><div class="cell empty">-</div><div class="cell empty">-</div>
              </div>
              <span>3 possible lines</span>
            </div>
          </div>
          
          <div class="pattern">
            <h4>Vertical Wins</h4>
            <div class="pattern-grid">
              <div class="mini-board">
                <div class="cell">X</div><div class="cell empty">-</div><div class="cell empty">-</div>
                <div class="cell">X</div><div class="cell empty">-</div><div class="cell empty">-</div>
                <div class="cell">X</div><div class="cell empty">-</div><div class="cell empty">-</div>
              </div>
              <span>3 possible lines</span>
            </div>
          </div>
          
          <div class="pattern">
            <h4>Diagonal Wins</h4>
            <div class="pattern-grid">
              <div class="mini-board">
                <div class="cell">X</div><div class="cell empty">-</div><div class="cell empty">-</div>
                <div class="cell empty">-</div><div class="cell">X</div><div class="cell empty">-</div>
                <div class="cell empty">-</div><div class="cell empty">-</div><div class="cell">X</div>
              </div>
              <span>2 possible lines</span>
            </div>
          </div>
        </div>
      </section>
      
      <section class="strategy-stats">
        <h2>🧠 Strategic Analysis</h2>
        <div class="analysis">
          <div class="analysis-item">
            <h4>Best Opening Move</h4>
            <p>Center (position 5) or any corner</p>
            <div class="percentage">85% win rate</div>
          </div>
          
          <div class="analysis-item">
            <h4>Worst Opening Move</h4>
            <p>Any edge (positions 2, 4, 6, 8)</p>
            <div class="percentage">45% win rate</div>
          </div>
          
          <div class="analysis-item">
            <h4>Average Game Length</h4>
            <p>5.5 moves per game</p>
            <div class="percentage">Min: 5, Max: 9</div>
          </div>
          
          <div class="analysis-item">
            <h4>First Player Advantage</h4>
            <p>X (first player) has slight advantage</p>
            <div class="percentage">52% win rate</div>
          </div>
        </div>
      </section>
      
      <section class="event-sourcing-benefits">
        <h2>⚡ Event Sourcing Benefits</h2>
        <div class="benefits">
          <div class="benefit">
            <h4>🕰️ Time Travel Debugging</h4>
            <p>See exactly how any game state was reached by replaying events in sequence</p>
          </div>
          
          <div class="benefit">
            <h4>🌿 Infinite Branching</h4>
            <p>Explore alternate timelines - "What if I played here instead?"</p>
          </div>
          
          <div class="benefit">
            <h4>📈 Perfect Audit Trail</h4>
            <p>Every decision is recorded with timestamps and can be analyzed later</p>
          </div>
          
          <div class="benefit">
            <h4>🔄 State Recovery</h4>
            <p>Game state can be reconstructed from events even after crashes</p>
          </div>
          
          <div class="benefit">
            <h4>🎯 Learning Tool</h4>
            <p>Study winning strategies by replaying successful game patterns</p>
          </div>
          
          <div class="benefit">
            <h4>🏗️ Scalable Architecture</h4>
            <p>Same pattern works for simple games like Tic-Tac-Toe or complex ones like Go</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</div>

<style>
  .history-page {
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
  
  .stats-grid {
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
  
  .facts {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
  }
  
  .fact {
    text-align: center;
    padding: 1.5rem;
    background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
    border-radius: 1rem;
  }
  
  .fact h3 {
    font-size: 1rem;
    font-weight: 600;
    color: #0369a1;
    margin-bottom: 0.5rem;
  }
  
  .big-number {
    font-size: 2rem;
    font-weight: 700;
    color: #1e40af;
    margin: 0.5rem 0;
  }
  
  .patterns {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
  }
  
  .pattern {
    text-align: center;
  }
  
  .pattern h4 {
    font-weight: 600;
    margin-bottom: 1rem;
    color: #374151;
  }
  
  .pattern-grid {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  
  .mini-board {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2px;
    background: #374151;
    padding: 4px;
    border-radius: 4px;
  }
  
  .cell {
    width: 30px;
    height: 30px;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 0.875rem;
    color: #3b82f6;
  }
  
  .cell.empty {
    color: #9ca3af;
  }
  
  .analysis {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
  }
  
  .analysis-item {
    padding: 1.5rem;
    background: #fef3c7;
    border-radius: 1rem;
    text-align: center;
  }
  
  .analysis-item h4 {
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #92400e;
  }
  
  .percentage {
    font-size: 1.25rem;
    font-weight: 700;
    color: #d97706;
    margin-top: 0.5rem;
  }
  
  .benefits {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }
  
  .benefit {
    padding: 1.5rem;
    background: #f0f9ff;
    border-radius: 1rem;
    border-left: 4px solid #3b82f6;
  }
  
  .benefit h4 {
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #1e40af;
  }
  
  @media (max-width: 768px) {
    .history-page {
      margin: 1rem;
      padding: 1rem;
    }
    
    h1 {
      font-size: 2rem;
    }
    
    .facts,
    .patterns,
    .analysis,
    .benefits {
      grid-template-columns: 1fr;
    }
  }
</style>