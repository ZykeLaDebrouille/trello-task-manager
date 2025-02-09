const express = require('express');
const axios = require('axios');

const router = express.Router();

// Endpoint pour récupérer les boards de l'utilisateur
router.get('/boards', async (req, res) => {
    const { apiKey, token } = req.query;

    if (!apiKey || !token) {
        return res.status(400).json({ error: "API Key et Token sont requis." });
    }

    try {
        const response = await axios.get(`https://api.trello.com/1/members/me/boards`, {
            params: {
                key: apiKey,
                token: token,
                fields: "id,name"
            }
        });
        res.json({ boards: response.data });
    } catch (error) {
        res.status(500).json({ error: error.response?.data || "Erreur lors de la récupération des boards." });
    }
});

// Endpoint pour récupérer les listes d'un board spécifique
router.get('/lists', async (req, res) => {
    const { apiKey, token, boardId } = req.query;

    if (!apiKey || !token || !boardId) {
        return res.status(400).json({ error: "API Key, Token et Board ID sont requis." });
    }

    try {
        const response = await axios.get(`https://api.trello.com/1/boards/${boardId}/lists`, {
            params: {
                key: apiKey,
                token: token,
                fields: "id,name"
            }
        });
        res.json({ lists: response.data });
    } catch (error) {
        res.status(500).json({ error: error.response?.data || "Erreur lors de la récupération des listes." });
    }
});

module.exports = router;
