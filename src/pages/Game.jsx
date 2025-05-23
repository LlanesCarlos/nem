import React, { useEffect, useRef } from 'react';
import { NES, Controller } from 'jsnes';

function Game() {
  const canvasRef = useRef(null);
  const nesRef = useRef(null);
  const animationFrameId = useRef(null);
  const imageDataRef = useRef(null);
  const ctxRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctxRef.current = ctx;
    canvas.width = 256;
    canvas.height = 240;

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const scriptNode = audioContext.createScriptProcessor(1024, 0, 2);
    const audioBufferL = [];
    const audioBufferR = [];

    const resumeAudio = () => {
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      window.removeEventListener('click', resumeAudio);
    };
    window.addEventListener('click', resumeAudio, { once: true });

    scriptNode.onaudioprocess = (e) => {
      const outputL = e.outputBuffer.getChannelData(0);
      const outputR = e.outputBuffer.getChannelData(1);
      for (let i = 0; i < outputL.length; i++) {
        outputL[i] = audioBufferL.length ? audioBufferL.shift() : 0;
        outputR[i] = audioBufferR.length ? audioBufferR.shift() : 0;
      }
    };
    scriptNode.connect(audioContext.destination);

    imageDataRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);

    nesRef.current = new NES({
      onFrame(frameBuffer) {
        const imageData = imageDataRef.current;
        for (let i = 0; i < frameBuffer.length; i++) {
          const color = frameBuffer[i];
          imageData.data[i * 4 + 0] = (color >> 16) & 0xff;
          imageData.data[i * 4 + 1] = (color >> 8) & 0xff;
          imageData.data[i * 4 + 2] = color & 0xff;
          imageData.data[i * 4 + 3] = 0xff;
        }
      },
      onAudioSample(left, right) {
        if (audioBufferL.length < 2048) {
          audioBufferL.push(left);
          audioBufferR.push(right);
        }
      },
    });

    fetch('/Tetris.nes')
      .then(res => res.arrayBuffer())
      .then(buffer => {
        const byteArray = new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < byteArray.length; i++) {
          binary += String.fromCharCode(byteArray[i]);
        }
        nesRef.current.loadROM(binary);

        const NES_FPS = 30;
        const frameInterval = 1000 / NES_FPS;

        let lastFrameTime = performance.now();

        const emulationLoop = () => {
          const now = performance.now();
          const delta = now - lastFrameTime;

          if (delta >= frameInterval) {
            nesRef.current.frame();
            lastFrameTime = now - (delta % frameInterval);
          }

          animationFrameId.current = requestAnimationFrame(emulationLoop);
        };

        animationFrameId.current = requestAnimationFrame(emulationLoop);

        const renderLoop = () => {
          ctx.putImageData(imageDataRef.current, 0, 0);
          animationFrameId.current = requestAnimationFrame(renderLoop);
        };
        renderLoop();
      })
      .catch(err => console.error('ROM load error:', err));

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          nesRef.current.buttonDown(1, Controller.BUTTON_LEFT);
          break;
        case 'ArrowRight':
          nesRef.current.buttonDown(1, Controller.BUTTON_RIGHT);
          break;
        case 'ArrowDown':
          nesRef.current.buttonDown(1, Controller.BUTTON_DOWN);
          break;
        case 'ArrowUp':
          nesRef.current.buttonDown(1, Controller.BUTTON_UP);
          break;
        case 'z':
        case 'x':
          nesRef.current.buttonDown(1, Controller.BUTTON_A);
          break;
        case 'Enter':
          nesRef.current.buttonDown(1, Controller.BUTTON_START);
          break;
        case 'Shift':
          nesRef.current.buttonDown(1, Controller.BUTTON_SELECT);
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          nesRef.current.buttonUp(1, Controller.BUTTON_LEFT);
          break;
        case 'ArrowRight':
          nesRef.current.buttonUp(1, Controller.BUTTON_RIGHT);
          break;
        case 'ArrowDown':
          nesRef.current.buttonUp(1, Controller.BUTTON_DOWN);
          break;
        case 'ArrowUp':
          nesRef.current.buttonUp(1, Controller.BUTTON_UP);
          break;
        case 'z':
        case 'x':
          nesRef.current.buttonUp(1, Controller.BUTTON_A);
          break;
        case 'Enter':
          nesRef.current.buttonUp(1, Controller.BUTTON_START);
          break;
        case 'Shift':
          nesRef.current.buttonUp(1, Controller.BUTTON_SELECT);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      cancelAnimationFrame(animationFrameId.current);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      scriptNode.disconnect();
      audioContext.close();
      window.removeEventListener('click', resumeAudio);
    };
  }, []);

  return (
    <>
      <style>{`
        html, body, #root {
          margin: 0;
          padding: 0;
          height: 100%;
          width: 100%;
          overflow: hidden;
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
      `}</style>


      <div
        style={{
          height: '100vh',
          width: '100vw',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '1rem',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            width: '80vmin',
            height: '60vmin', // 4:3 aspect ratio
            position: 'relative',
            border: '2px solid white',
            imageRendering: 'pixelated',
            backgroundColor: '#000',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxSizing: 'border-box',
          }}
        >
          <canvas
            ref={canvasRef}
            style={{
              width: '100%',
              height: '100%',
              imageRendering: 'pixelated',
              display: 'block',
            }}
          />
        </div>

        <p
          style={{
            marginTop: '1rem',
            textAlign: 'center',
            maxWidth: '80vmin',
            userSelect: 'none',
            color: 'white',
          }}
        >
          Z/X: 🔄 &nbsp;&nbsp; Arrow keys: ⬅️➡️⬆️⬇️ &nbsp;&nbsp; Enter: ▶️ &nbsp;&nbsp;
        </p>
      </div>
    </>
  );
}

export default Game;
