require('dotenv').config();
const express = require('express');
const cors = require('cors');

const tasksRoute = require('./routes/tasks');
const trelloRoute = require('./routes/trello');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Routes pour la création de tâche et pour récupérer boards et listes
app.use('/api/tasks', tasksRoute);
app.use('/api/trello', trelloRoute);

app.listen(PORT, () => {
    console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});
