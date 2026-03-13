const commentForm = document.querySelector('.comment-form');
    const commentList = document.querySelector('.comment-list');
    const commentCount = document.querySelector('.comment-header h3');

    // 1. Charger les commentaires sauvegardés au démarrage
    window.onload = () => {
        const savedComments = JSON.parse(localStorage.getItem('myBlogComments')) || [];
        savedComments.forEach(comment => {
            renderComment(comment.text, comment.date, false);
        });
        updateCounter();
    };

    // 2. Fonction pour afficher un commentaire dans le HTML
    function renderComment(text, date, isNew = true) {
        const newComment = document.createElement('div');
        newComment.classList.add('comment-item');
        newComment.innerHTML = `
            <div class="comment-avatar" style="background-color: #27ae60;">U</div>
            <div class="comment-content">
                <div class="comment-author">Utilisateur <span class="comment-date">• ${date}</span></div>
                <p>${text}</p>
            </div>
        `;
        commentList.appendChild(newComment);
        
        if (isNew) {
            saveComment(text, date);
            updateCounter();
        }
    }

    // 3. Sauvegarder dans le localStorage
    function saveComment(text, date) {
        const savedComments = JSON.parse(localStorage.getItem('myBlogComments')) || [];
        savedComments.push({ text, date });
        localStorage.setItem('myBlogComments', JSON.stringify(savedComments));
    }

    // 4. Mettre à jour le compteur (les 2 statiques + les sauvegardés)
    function updateCounter() {
        const extraComments = JSON.parse(localStorage.getItem('myBlogComments')) || [];
        const total = 2 + extraComments.length;
        commentCount.innerText = `Commentaires (${total})`;
    }

    // 5. Gérer l'envoi du formulaire
    commentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const textarea = this.querySelector('textarea');
        const message = textarea.value.trim();
        const now = new Date().toLocaleDateString('fr-FR', { hour: '2-digit', minute: '2-digit' });

        if (message !== "") {
            renderComment(message, "Le " + now, true);
            textarea.value = "";
        }
    });