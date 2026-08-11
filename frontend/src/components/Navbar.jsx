import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  function handleLogout() {
    setMenuOpen(false);
    logout();
  }

  const linkClass = ({ isActive }) => `nav-link${isActive ? ' nav-link-active' : ''}`;
  const isAdmin = (user?.role || '').toLowerCase() === 'admin';

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <NavLink to={isAdmin ? '/admin' : '/'} className="brand" onClick={() => setMenuOpen(false)}>
          <span className="brand-mark">CN</span>
          <span className="brand-name">CartNova</span>
        </NavLink>

        <button
          className="nav-toggle"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`nav-links${menuOpen ? ' nav-links-open' : ''}`}>
          {isAdmin ? (
            <>
              <NavLink to="/admin" className={linkClass} onClick={() => setMenuOpen(false)} end>
                Dashboard
              </NavLink>
              <NavLink to="/admin/products" className={linkClass} onClick={() => setMenuOpen(false)}>
                Products
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/" className={linkClass} onClick={() => setMenuOpen(false)} end>
                Products
              </NavLink>
              {isAuthenticated && (
                <>
                  <NavLink to="/cart" className={linkClass} onClick={() => setMenuOpen(false)}>
                    Cart
                  </NavLink>
                  <NavLink to="/orders" className={linkClass} onClick={() => setMenuOpen(false)}>
                    My Orders
                  </NavLink>
                </>
              )}
            </>
          )}

          <div className="nav-auth">
            {isAuthenticated ? (
              <>
                <span className="nav-user">Hi, {user?.name?.split(' ')[0] || 'there'}</span>
                <button className="btn btn-outline btn-sm" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate('/login');
                  }}
                >
                  Login
                </button>
                <button
                  className="btn btn-accent btn-sm"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate('/register');
                  }}
                >
                  Register
                </button>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
