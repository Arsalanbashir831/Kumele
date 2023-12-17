const pool = require('../config').pool;
const jwt = require('jsonwebtoken');



const AuthController = {
    signup: async (req, res) => {
        const { username, email, password, gender, referralCode, DOB,interests,latitude,longitude } = req.body;
        try {
            const registerUser = await pool.query(
                "INSERT INTO Users (email, password, referralCode, genderId, dob, username,interests,latitude,longitude) VALUES ($1, $2, $3, $4, $5, $6, $7 ,$8 ,$9) RETURNING *",
                [email, password, referralCode, gender, DOB, username, JSON.stringify(interests),latitude,longitude]
            );

            const user = registerUser.rows[0];
            const token = generateToken(user);

            res.status(200).json({
                success: true,
                message: 'User registered successfully',
                user,
                token,
            });
        } catch (error) {
            console.error('Error during user registration:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                errorDetails: error.message,  
            });
        }
    },

    login: async (req, res) => {
        const { email, password } = req.body;
        try {
            const loginUser = await pool.query(
                "SELECT * FROM Users WHERE email = $1 AND password = $2",
                [email, password]
            );

            if (loginUser.rows.length === 1) {
                const user = loginUser.rows[0];
                const token = generateToken(user);

                res.status(200).json({
                    success: true,
                    message: 'Login successful',
                    token,
                });
            } else {
                res.status(401).json({
                    success: false,
                    message: 'Invalid credentials',
                });
            }
        } catch (error) {
            console.error('Error during user login:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    },

    verifyToken: async (req, res, next) => {
      const token = req.headers.authorization;
      try {
          if (!token || !token.startsWith('Bearer ')) {
              throw new Error('Invalid token format');
          }
          const decoded = jwt.verify(token.slice(7), 'your-secret-key');
          req.user = decoded;
          next();
      } catch (error) {
          console.error('Error during token verification:', error.message);
          res.status(401).json({
              success: false,
              message: 'Invalid token',
          });
      }
  },
  
};

function generateToken(user) {
    const token = jwt.sign(
        { userId: user.userid, email: user.email },
        'your-secret-key',
        { expiresIn: '1h' }
    );

    return token;
}

module.exports = AuthController;
