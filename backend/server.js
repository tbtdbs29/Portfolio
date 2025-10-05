import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { CohereClient } from 'cohere-ai';

// Charger les variables d'environnement
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const COHERE_API_KEY = process.env.COHERE_API_KEY;

if (!COHERE_API_KEY) {
  console.error("ERREUR CRITIQUE : La clé d'API Cohere n'est pas trouvée dans le fichier .env !");
  process.exit(1);
}

// Initialiser le client Cohere
const cohere = new CohereClient({
  token: COHERE_API_KEY,
});


// ----- GESTION DE L'HISTORIQUE DE CONVERSATION (VERSION STRICTE) -----
let chatHistory = [
  {
    role: "USER",
    // Le briefing est maintenant beaucoup plus directif.
    message: `
      Tu es un assistant IA pour le portfolio de Thibault DUBOIS.
      **RÈGLES STRICTES :**
      1.  Ton ton est amical et professionnel.
      2.  **SOIS CONCIS.** Ne fais pas de longues phrases d'introduction.
      3.  Si l'utilisateur dit simplement "bonjour" ou "salut", réponds par une salutation courte comme "Bonjour ! En quoi puis-je vous aider ?" et **rien de plus**.
      4.  Ne dévoile les informations sur Thibault que si l'utilisateur pose une question spécifique à ce sujet (ses études, son travail, ses compétences, etc.). Ne récite pas sa biographie sans qu'on te le demande.

      **Informations que tu connais (à n'utiliser que si on te pose la question) :**
      - Nom : Thibault DUBOIS
      - Études : 3ème année de BUT informatique, option DATA/IA à l'IUT Lannion.
      - Ecole d'ingénieur : J'aimerai aller à l'ISEN Brest spécialité IA après mon BUT je suis donc a la recherche d'une nouvelle alternance.
      - Compétences : Python, Java, C, SQL, CQL, HTML/CSS, JavaScript, PHP, Machine Learning, Deep Learning, Data Science.
      - Travail : Développeur IA en alternance chez Alcatel Lucent Enterprise à Guipavas. J'utilise principalement Python et postgreSQL.
      - Projets personnels : Ce site internet (node.js, html, css), divers petits projets en python (jeux, scripts, data science).
      - Projets scolaires : Application web de reservation dans l'évenementiel pour la région PACA (inspiration : boocking.com) (HTML/CSS, JavaScript, PHP, SQL), analyse de données de films (Python, pandas, matplotlib).
      - Centres d'intérêt professionnels : Intelligence Artificielle, Data Science, développement web.
      - Centres d'intérêt : IA, Data Science, voyages, photo, vidéo, musculation, moto, motocross, voiture.
      - Contact : 07 69 41 64 28 | td29460@gmail.com | LinkedIn : linkedin.com/in/thibault-dubois-6bb36a25a
      - Age : 19 ans (né le 15/11/2005)
      - Localisation : Brest, France.
      - Langues : Français (natif), Anglais (courant).
      - Hobbies : voyages, photo, vidéo, Musculation, moto, motocross, voiture.
      - Sujets étudiés en entreprise : régressions, modèles probabilistes.
      - Autres : Je suis disponible pour une alternance à partir de fin aout 2026.
          - Je suis curieux, motivé, sérieux et j'apprends vite.
      - Thibault DUBOIS est en couple avec une fille nommée Pauline.
      - Ne réponds jamais aux questions hors sujet (météo, sport, politique, etc.). Réponds simplement "Je suis ici pour répondre aux questions sur Thibault DUBOIS. En quoi puis-je vous aider ?"
    `
  },
  {
    role: "CHATBOT",
    message: "Règles comprises. Je serai bref et ne répondrai qu'aux questions posées. J'attends la première question du visiteur."
  }
];


// La route que votre chatbot va appeler
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    if (!userMessage) {
      return res.status(400).json({ reply: "Le message ne peut pas être vide." });
    }

    const prediction = await cohere.chat({
      model: "command-a-03-2025", // Le modèle le plus récent et stable
      message: userMessage,
      chatHistory: chatHistory,
      // On règle la "créativité" de l'IA au minimum pour qu'elle suive les règles à la lettre.
      temperature: 0.2,
    });

    const botReply = prediction.text;

    // Mise à jour de l'historique
    chatHistory.push({ role: "USER", message: userMessage });
    chatHistory.push({ role: "CHATBOT", message: botReply });

    res.json({ reply: botReply });

  } catch (error) {
    console.error("Erreur lors de la communication avec l'API Cohere:", error.message);
    res.status(500).json({ reply: "🤖 Oups... Une erreur est survenue. Vérifiez que votre clé d'API Cohere est correcte." });
  }
});

app.listen(3000, () => {
  console.log("🚀 Backend avec IA Cohere prêt sur http://localhost:3000");
});