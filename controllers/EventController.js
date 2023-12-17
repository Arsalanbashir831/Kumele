
const pool = require('../config').pool

const calculateDistance = (lat1, lon1, lat2, lon2) => {
    // Haversine formula to calculate distance between two points on Earth
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
};

const EventController = {
    createEvent : async (req, res ) => {
        const userId = req.user.userId;
        const { cashpaymentonentry, categoryid, eventaddress, eventdate, eventdescription, eventendtime, eventimg, eventname, eventstarttime, ispaypal, maxage, minage, numofguest, priceofevent,latitude,longitude } = req.body;
        try {
            const query ="INSERT INTO event (cashpaymentonentry, categoryid, eventaddress, eventdate, eventdescription, eventendtime, eventimg, eventname, eventstarttime, ispaypal,maxage,minage,numofguest,priceofevent,userId,latitude,longitude) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,$11,$12,$13,$14,$15,$16,$17)";
            const values = [cashpaymentonentry,categoryid, eventaddress, eventdate,eventdescription,eventendtime,eventimg,eventname,eventstarttime,ispaypal,maxage,minage,numofguest,priceofevent, userId,latitude,longitude];
            await pool.query(query, values);
            res.status(200).json({
                success: true,
                message: 'Event added successfully',
            });
        } catch (error) {
            console.log(error);
        }
      
    },
    
    getMatchedEvents: async (req, res) => {
        const userId = req.user.userId;
        const maxDistance = 10; // Maximum distance in kilometers for matching events

        try {
            const query = `
                SELECT e.* 
                FROM event e
                JOIN users u ON e.userId = u.userId
                WHERE 
                    u.userId = $1 AND
                    ABS(e.latitude - $2) < 1 AND
                    ABS(e.longitude - $3) < 1
            `;

            const events = await pool.query(query, [userId, req.user.latitude, req.user.longitude]);

            // Filter events based on distance
            const matchedEvents = events.rows.filter(event =>
                calculateDistance(
                    req.user.latitude,
                    req.user.longitude,
                    event.latitude,
                    event.longitude
                ) <= maxDistance
            );

            res.status(200).json({
                success: true,
                events: matchedEvents,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    },

    getEventById : async (req, res) => {
        const eventId = req.params.id; // Assuming you have the event ID in the request parameters
        try {
            const query = "SELECT * FROM event WHERE id = $1";
            const values = [eventId];
            const event = await pool.query(query, values);
            res.status(200).json({
                success: true,
                event: event.rows[0],
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }   
    },
    updateEvent: async (req, res) => {
        const eventId = req.params.id; // Assuming you have the event ID in the request parameters
    
        try {
            const query = `
                UPDATE event 
                SET 
                    cashpaymentonentry = $1, 
                    categoryid = $2, 
                    eventaddress = $3, 
                    eventdate = $4, 
                    eventdescription = $5, 
                    eventendtime = $6, 
                    eventimg = $7, 
                    eventname = $8, 
                    eventstarttime = $9, 
                    ispaypal = $10, 
                    maxage = $11, 
                    minage = $12, 
                    numofguest = $13, 
                    priceofevent = $14 ,
                    latitude = $15,
                    longitude = $16,
                WHERE 
                    id = $15 AND userId = $16
            `;
    
            const values = [
                ...Object.values(req.body),
                eventId,
                req.user.userId,
            ];
    
            await pool.query(query, values);
            res.status(200).json({
                success: true,
                message: 'Event updated successfully',
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    },
    

    deleteEvent: async (req, res) => {
        const eventId = req.params.id; // Assuming you have the event ID in the request parameters

        try {
            const query = "DELETE FROM event WHERE id = $1 AND userId = $2";
            const values = [eventId, req.user.userId];
            await pool.query(query, values);
            res.status(200).json({
                success: true,
                message: 'Event deleted successfully',
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    },
}
module.exports = EventController;