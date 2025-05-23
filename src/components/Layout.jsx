import React from 'react';
import { Outlet, Link } from 'react-router-dom';

function Layout() {
  return (
    <div>
      <nav className="navbar navbar-dark bg-dark px-4">
        <Link to="/" className="navbar-brand">NEM</Link>
        <div>
          <Link to="/" className="btn btn-outline-light me-2">Home</Link>
          <Link to="/game" className="btn btn-outline-light me-2">Game</Link>
          <Link to="/about" className="btn btn-outline-light ">About</Link>
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
