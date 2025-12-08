import React, { useState, FormEvent } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginAction, fetchFavoritesAction } from '../../services/api-actions';
import { AppDispatch } from '../../store';
import { getAuthorizationStatus } from '../../app/selectors';

export const LoginPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const authorizationStatus = useSelector(getAuthorizationStatus);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError(null);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    // Validate email and password are not empty
    if (!trimmedEmail || !trimmedPassword) {
      setError('Please fill in all fields');
      return;
    }

    // Validate password is not only spaces (password.trim() should not be empty)
    if (trimmedPassword.length === 0 || /^\s+$/.test(password)) {
      setError('Password cannot consist of spaces only');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await dispatch(loginAction({ email: trimmedEmail, password: trimmedPassword }));

      if (loginAction.fulfilled.match(result)) {
        void dispatch(fetchFavoritesAction());
        navigate('/');
      } else if (loginAction.rejected.match(result)) {
        const errorMessage = result.payload || 'Failed to login. Please check your credentials.';
        setError(errorMessage);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authorizationStatus === 'AUTH') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="page page--gray page--login">
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <div className="header__left">
              <Link className="header__logo-link" to="/">
                <img className="header__logo" src="img/logo.svg" alt="6 cities logo" width="81" height="41" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="page__main page__main--login">
        <div className="page__login-container container">
          <section className="login">
            <h1 className="login__title">Sign in</h1>
            <form
              className="login__form form"
              action="#"
              method="post"
              onSubmit={(e) => {
                void handleSubmit(e);
              }}
            >
              {error && (
                <div className="login__error" style={{ color: 'red', marginBottom: '10px', padding: '10px', backgroundColor: '#ffebee', borderRadius: '4px' }}>
                  {error.includes('Validation error') ? 'Invalid email or password. Please check your credentials.' : error}
                </div>
              )}
              <div className="login__input-wrapper form__input-wrapper">
                <label className="visually-hidden">E-mail</label>
                <input
                  className="login__input form__input"
                  type="email"
                  name="email"
                  placeholder="Email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={handleEmailChange}
                  disabled={isSubmitting}
                />
              </div>
              <div className="login__input-wrapper form__input-wrapper">
                <label className="visually-hidden">Password</label>
                <input
                  className="login__input form__input"
                  type="password"
                  name="password"
                  placeholder="Password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={handlePasswordChange}
                  disabled={isSubmitting}
                />
              </div>
              <button
                className="login__submit form__submit button"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
          </section>
          <section className="locations locations--login locations--current">
            <div className="locations__item">
              <a className="locations__item-link" href="#">
                <span>Amsterdam</span>
              </a>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};
