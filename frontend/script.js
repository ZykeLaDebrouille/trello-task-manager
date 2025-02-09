// Fonction pour afficher un message utilisateur
const displayMessage = (msg, color) => {
    const message = document.getElementById("message");
    message.innerText = msg;
    message.style.color = color;
};

// Charger les boards lorsque l'utilisateur clique sur le bouton dédié
document.getElementById("fetchBoards").addEventListener("click", async () => {
    const apiKey = document.getElementById("apiKey").value.trim();
    const token = document.getElementById("token").value.trim();
    const boardsSelect = document.getElementById("boardsSelect");

    if (!apiKey || !token) {
        displayMessage("Veuillez renseigner votre API Key et Token pour charger vos boards.", "red");
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/api/trello/boards?apiKey=${apiKey}&token=${token}`);
        const data = await response.json();
        if (data.boards) {
            boardsSelect.innerHTML = '<option value="">Sélectionnez un board</option>';
            data.boards.forEach(board => {
                const option = document.createElement("option");
                option.value = board.id;
                option.innerText = board.name;
                boardsSelect.appendChild(option);
            });
            displayMessage("Boards chargés avec succès !", "green");
        } else {
            displayMessage(data.error || "Erreur lors du chargement des boards.", "red");
        }
    } catch (error) {
        displayMessage("Erreur de connexion lors du chargement des boards.", "red");
    }
});

// Lorsque l'utilisateur choisit un board, charger les listes correspondantes
document.getElementById("boardsSelect").addEventListener("change", async () => {
    const apiKey = document.getElementById("apiKey").value.trim();
    const token = document.getElementById("token").value.trim();
    const boardId = document.getElementById("boardsSelect").value;
    const listsSelect = document.getElementById("listsSelect");

    if (!boardId) {
        listsSelect.innerHTML = '<option value="">Sélectionnez une liste</option>';
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/api/trello/lists?apiKey=${apiKey}&token=${token}&boardId=${boardId}`);
        const data = await response.json();
        if (data.lists) {
            listsSelect.innerHTML = '<option value="">Sélectionnez une liste</option>';
            data.lists.forEach(list => {
                const option = document.createElement("option");
                option.value = list.id;
                option.innerText = list.name;
                listsSelect.appendChild(option);
            });
            displayMessage("Listes chargées avec succès !", "green");
        } else {
            displayMessage(data.error || "Erreur lors du chargement des listes.", "red");
        }
    } catch (error) {
        displayMessage("Erreur de connexion lors du chargement des listes.", "red");
    }
});

// Créer la tâche en récupérant toutes les informations
document.getElementById("submit").addEventListener("click", async () => {
    const apiKey = document.getElementById("apiKey").value.trim();
    const token = document.getElementById("token").value.trim();
    const listId = document.getElementById("listsSelect").value;
    const labels = document.getElementById("labels").value.trim();
    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();

    // Vérification des champs obligatoires
    if (!apiKey || !token || !listId || !title || !description) {
        displayMessage("Veuillez remplir tous les champs obligatoires (API Key, Token, Liste, Titre et Description).", "red");
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ apiKey, token, listId, labels, title, description })
        });
        const data = await response.json();
        if (data.success) {
            displayMessage(`✅ Tâche créée avec succès : Voir sur Trello`, "green");
            // Optionnel : afficher le lien cliquable
            document.getElementById("message").innerHTML = `✅ Tâche créée avec succès : <a href="${data.url}" target="_blank">Voir sur Trello</a>`;
        } else {
            displayMessage(data.error || "❌ Erreur lors de la création.", "red");
        }
    } catch (error) {
        displayMessage("❌ Erreur de connexion lors de la création de la tâche.", "red");
    }
});
