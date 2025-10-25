import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors'

// --- 1. INITIALIZE EXPRESS APP ---
const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

// --- 2. DATABASE CONNECTION ---
// Using the same database connection string. The data will be stored in a new collection.
const MONGO_URI = 'mongodb+srv://ionode:ionode@ionode.qgqbadm.mongodb.net/SolarMonitoring?retryWrites=true&w=majority&appName=ionode';

mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected successfully.'))
    .catch(err => console.error('MongoDB connection error:', err));

// --- 3. MONGOOSE SCHEMA DEFINITION ---
// Defines the structure for the new sensor data.
const sensorDataSchema = new mongoose.Schema({
    totalEfficiency: { type: Number, default: 0 },
    power: { type: Number, default: 0 },
    energyTotal: { type: Number, default: 0 },
    voltage: { type: Number, default: 0 },
    current: { type: Number, default: 0 },
    lightIntensity: { type: Number, default: 0 },
    panelTemp: { type: Number, default: 0 },
    dustLevel: { type: Number, default: 0 },
    inclinationAngle: { type: Number, default: 0 },
    panelDirection: { type: String, default: 'South' },
    sensorHealth: { type: String, default: 'OK' }
}, {
    // Automatically add `createdAt` and `updatedAt` timestamps
    timestamps: true
});

// --- 4. MONGOOSE MODEL CREATION ---
// This will create a 'sensordatas' collection in your database.
const SensorData = mongoose.model('SensorData', sensorDataSchema);


// --- 5. API ROUTES ---

// Welcome Route
app.get("/", (req, res) => {
    res.status(200).json({ message: "Sensor data server is working. Use /data to interact with the API." });
});


/**
 * @route   POST /data
 * @desc    Create or update the sensor data from the request body.
 * @access  Public
 * @body    JSON object with sensor data fields.
 *
 * @example To CREATE or UPDATE data:
 * POST http://localhost:62889/data
 * Body: { "panelTemp": 45.2, "power": 350.5, "sensorHealth": "Good" }
 */
app.post('/data', async (req, res) => {
    try {
        // The data to update comes from the request body.
        const updateData = req.body;

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "Request body cannot be empty." });
        }

        // `findOneAndUpdate` with `upsert: true` is ideal for this scenario.
        // It will update the single document representing the system's state,
        // or create it if it doesn't exist.
        const updatedSensorData = await SensorData.findOneAndUpdate({}, updateData, {
            new: true, // Return the modified document
            upsert: true, // Create a new document if one doesn't exist
            setDefaultsOnInsert: true // Apply schema defaults on creation
        });

        res.status(200).json({
            message: "Data created/updated successfully.",
            data: updatedSensorData
        });

    } catch (error) {
        console.error("Error updating data:", error);
        res.status(500).json({ message: "Failed to update data.", error: error.message });
    }
});


/*
 * @route   GET /data
 * @desc    Fetch the latest sensor data.
 * @access  Public
 *
 * @example To FETCH data:
 * GET http://localhost:62889/data
 */
app.get('/data', async (req, res) => {
    try {
        // Find the single document representing the sensor state.
        // Sorting by `updatedAt` ensures you get the latest data.
        const latestData = await SensorData.findOne().sort({ updatedAt: -1 });

        if (!latestData) {
            return res.status(404).json({ message: "No data found. Please POST data to create an entry." });
        }

        res.status(200).json({
            message: "Data fetched successfully.",
            data: latestData
        });

    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ message: "Failed to fetch data.", error: error.message });
    }
});


// --- 6. START SERVER ---
const port = 62889; // Using another new port to avoid conflicts
app.listen(port, () => {
    console.log(`Sensor data server is live on port: ${port}`);
});