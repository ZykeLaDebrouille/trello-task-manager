const express = require('express');
const axios = require('axios');
const { TRELLO_API_KEY, TRELLO_TOKEN, TRELLO_LIST_ID } = require('../config/env');

const router = express.Router();

// Route pour créer une tâche sur Trello
router.post('/', async (req, res) => {
    const { title, description, apiKey, token, listId, labels } = req.body;

    // On utilise les credentials fournis par l'utilisateur ou les valeurs par défaut (pour la démo)
    const key = apiKey || TRELLO_API_KEY;
    const userToken = token || TRELLO_TOKEN;
    const boardList = listId || TRELLO_LIST_ID;

    // Vérification des champs obligatoires
    if (!title || !description || !key || !userToken || !boardList) {
        return res.status(400).json({ error: "Titre, description, API Key, Token et List ID sont obligatoires" });
    }

    // Préparation des paramètres pour l'API Trello
    const params = {
        key: key,
        token: userToken,
        idList: boardList,
        name: title,
        desc: description
    };

    // Ajout optionnel des étiquettes (labels) si fournis
    if (labels) {
        const cleanedLabels = labels.split(',').map(label => label.trim()).join(',');
        params.idLabels = cleanedLabels;
    }

    try {
        const response = await axios.post(
            `https://api.trello.com/1/cards`,
            null,
            { params }
        );
        res.json({ success: true, url: response.data.shortUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.response?.data || "Erreur inconnue lors de la création de la tâche" });
    }
});

module.exports = router;
