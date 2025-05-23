import React from 'react';

function About() {
  return (
    <>
      <style>{`
        html, body, #root {
          margin: 0;
          padding: 0;
          height: 100%;
          width: 100%;
          background: linear-gradient(-45deg, #003300, #00cc66, #000000, #004d26);
          background-size: 400% 400%;
          animation: gradientBG 30s ease infinite;
          color: white;
          font-family: sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        @keyframes gradientBG {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .about-container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 2rem;
          box-sizing: border-box;
          text-align: center;
        }

        .about-box {
          background-color: rgba(0, 0, 0, 0.6);
          padding: 2rem;
          border-radius: 16px;
          max-width: 600px;
          box-shadow: 0 0 10px #00cc66;
        }
      `}</style>

      <div className="about-container">
        <div className="about-box">
          <h1>About This Project</h1>
          <p>
            This project was created for educational and non-commercial purposes only. It explores how classic game experiences can be presented through modern web technologies.
          </p>
          <p>
            All rights to <strong>Tetris</strong> and related trademarks or assets are owned by <strong>The Tetris Company, LLC</strong> and other respective rightsholders.
          </p>
          <p>
            This is an unofficial work, not endorsed by or affiliated with any trademark holders.
          </p>
          <p>
            Special thanks to the developers of <strong>TetrisGYM</strong> for their inspiration and dedication to the game’s legacy.
          </p>
        </div>
      </div>
    </>
  );
}

export default About;
