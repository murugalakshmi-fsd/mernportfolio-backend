import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { users } from '../modules/adminmodule.mjs';
dotenv.config();

const authMiddleware = async (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    console.log(token);
    const tokenString = token.split(' ')[1];
    console.log('Token string:', tokenString); // Log token for debugging
    console.log('Secret key:', process.env.SECRET_KEY);
    const decoded = jwt.verify(tokenString, process.env.SECRET_KEY);
    
    console.log(decoded);
    console.log(decoded._id);
  
    // Find user by _id and validate the token
    const user = await users.findOne({ _id: decoded._id, 'tokens.token': tokenString });
     console.log(user)
    if (!user) {
      throw new Error('User not found');
    }

    req.token = tokenString;
    req.users = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Invalid token.' });
  }
};

export default authMiddleware;
