import React from 'react';
import { Link } from 'react-router-dom';
import { RocketLaunchIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

function Home() {
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
        }

        @keyframes gradientBG {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .home-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          text-align: center;
          padding: 1.5rem;
        }

        .launch-icon {
          width: 24px;
          height: 24px;
          animation: spin 10s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .launch-button {
          background-color: #000;
          color: white;
          border: 2px solid white;
          padding: 0.6rem 1.2rem;
          border-radius: 0.5rem;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: background-color 0.3s ease, transform 0.2s ease;
        }

        .launch-button:hover {
          background-color: #111;
          transform: scale(1.05);
        }
      `}</style>

      <div className="home-container">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Link to="/game" className="launch-button">
            <RocketLaunchIcon className="launch-icon" />
            Launch Game
          </Link>
        </motion.div>
      </div>
    </>
  );
}

export default Home;
