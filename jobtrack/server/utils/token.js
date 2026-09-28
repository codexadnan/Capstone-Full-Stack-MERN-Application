import jwt from 'jsonwebtoken';

const isProduction = () => process.env.NODE_ENV === 'production';

export const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

// Cookie settings. Vercel (frontend) and Render (backend) are different sites,
// so production needs SameSite=None + Secure for the browser to send the cookie.
const cookieOptions = () => ({
  httpOnly: true,
  secure: isProduction(),
  sameSite: isProduction() ? 'none' : 'lax',
  path: '/',
});

export const setTokenCookie = (res, token) => {
  res.cookie('token', token, {
    ...cookieOptions(),
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const clearTokenCookie = (res) => {
  res.clearCookie('token', cookieOptions());
};
