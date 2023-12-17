const pool = require('../config').pool;

const ProfileController = {
    getProfile: async (req, res) => {
        const userId = req.user.userId;

        try {
            const userProfile = await pool.query('SELECT * FROM Users inner join gender gender on gender.genderid=users.genderid WHERE UserId = $1', [userId]);

            if (userProfile.rows.length === 1) {
                const profileData = userProfile.rows[0];
                const interestsArray = JSON.parse(profileData.interests || '[]');
                const enhancedProfile = {
                    ...profileData,
                    interests: interestsArray,
                };

                res.status(200).json({
                    success: true,
                    message: 'Profile retrieved successfully',
                    profile: enhancedProfile,
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: 'Profile not found',
                });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    },

    updateProfile: async (req, res) => {
        const userId = req.user.userId;
        const { username, interests, email, password, profilepic, userbio, dob } = req.body;
        try {
            await pool.query(`
                UPDATE Users
                SET username = $1, interests = $2, email = $3, password = $4,
                    profilepic = $5, userbio = $6, dob = $7
                WHERE UserId = $8
            `, [username, JSON.stringify(interests), email, password, profilepic, userbio, dob, userId]);
    
            res.status(200).json({
                success: true,
                message: 'Profile updated successfully',
            });
        } catch (error) {
            console.error('Error updating profile:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    },
    
};

module.exports = ProfileController;
