import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { CohereClient } from 'cohere-ai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Charger les variables d'environnement
dotenv.config();

// Configuration des chemins (nécessaire pour ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// --- 1. CONFIGURATION DES ASSETS (Pour que le front puisse charger les images) ---
// On pointe vers le dossier "assets" qui est un niveau au-dessus du dossier "backend"
const assetsPath = path.join(__dirname, '../assets');
app.use('/assets', express.static(assetsPath));

// --- 2. CONFIGURATION COHERE (CHATBOT) ---
const COHERE_API_KEY = process.env.COHERE_API_KEY;

let cohere = null;
if (!COHERE_API_KEY) {
  console.warn("⚠️ ATTENTION : La clé d'API Cohere n'est pas trouvée dans .env ! Le chat ne fonctionnera pas.");
} else {
  cohere = new CohereClient({
    token: COHERE_API_KEY,
  });
}

// ----- GESTION DE L'HISTORIQUE DE CONVERSATION (VOTRE CONFIGURATION) -----
let chatHistory = [
  {
    role: "USER",
    message: `
      Tu es un assistant IA pour le portfolio de Thibault DUBOIS.
      **RÈGLES STRICTES :**
      1.  Ton ton est amical et professionnel.
      2.  **SOIS CONCIS.** Ne fais pas de longues phrases d'introduction.
      3.  Si l'utilisateur dit simplement "bonjour" ou "salut", réponds par une salutation courte comme "Bonjour ! En quoi puis-je vous aider ?" et **rien de plus**.
      4.  Ne dévoile les informations sur Thibault que si l'utilisateur pose une question spécifique à ce sujet.

      **Informations que tu connais (à n'utiliser que si on te pose la question) :**
      - Nom : Thibault DUBOIS
      - Études : 3ème année de BUT informatique, option DATA/IA à l'IUT Lannion.
      - Ecole d'ingénieur : J'aimerai aller à l'ISEN Brest spécialité IA après mon BUT.
      - Compétences : Python, Java, C, SQL, CQL, HTML/CSS, JavaScript, PHP, Machine Learning, Deep Learning, Data Science.
      - Travail : Développeur IA en alternance chez Alcatel Lucent Enterprise à Guipavas.
      - Projets personnels : Ce site internet, divers projets python.
      - Projets scolaires : App de réservation (style booking), analyse de données de films.
      - Centres d'intérêt : IA, Data Science, voyages, photo, vidéo, musculation, moto, motocross, voiture.
      - Contact : 07 69 41 64 28 | td29460@gmail.com | LinkedIn : linkedin.com/in/thibault-dubois-6bb36a25a
      - Age : 19 ans (né le 15/11/2005)
      - Localisation : Brest, France.
      - Langues : Français (natif), Anglais (courant).
      - Autres : Je suis disponible pour une alternance à partir de fin aout 2026.
      - Thibault DUBOIS est en couple avec une fille nommée Pauline.
      - Ne réponds jamais aux questions hors sujet (météo, sport, politique, etc.).
    `
  },
  {
    role: "CHATBOT",
    message: "Règles comprises. Je serai bref et ne répondrai qu'aux questions posées."
  }
];


// --- 3. NOUVELLE ROUTE : SCANNER LES PHOTOS AUTOMATIQUEMENT ---
app.get("/api/photos/:category", (req, res) => {
    const category = req.params.category; // ex: 'voyage' ou 'evt'
    const dirPath = path.join(assetsPath, category);

    // Vérifier si le dossier existe
    if (!fs.existsSync(dirPath)) {
        console.error(`Dossier introuvable : ${dirPath}`);
        // On renvoie une liste vide pour ne pas faire planter le site
        return res.json({ images: [] });
    }

    try {
        // Lire le contenu du dossier
        const files = fs.readdirSync(dirPath);

        // Filtrer : Garder uniquement les images
        const imageFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
        });

        // TRIER PAR DATE (Chronologique : du plus vieux au plus récent)
        // Cela permet que vos photos s'affichent dans l'ordre où vous les avez prises/créées
        const sortedImages = imageFiles.map(fileName => {
            const filePath = path.join(dirPath, fileName);
            const stats = fs.statSync(filePath);
            return {
                name: fileName,
                time: stats.mtime.getTime() // Date de modification
            };
        })
        .sort((a, b) => a.time - b.time) // Tri
        .map(file => file.name); // On ne garde que le nom à la fin

        res.json({ images: sortedImages });

    } catch (err) {
        console.error("Erreur lors de la lecture du dossier images:", err);
        res.status(500).json({ error: "Erreur serveur lecture images" });
    }
});


// --- 4. ROUTE DU CHATBOT ---
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    if (!userMessage) return res.status(400).json({ reply: "Message vide." });

    if (!cohere) return res.json({ reply: "Désolé, l'IA est désactivée pour le moment." });

    const prediction = await cohere.chat({
      model: "command-r-plus", // Modèle performant
      message: userMessage,
      chatHistory: chatHistory,
      temperature: 0.2,
    });

    const botReply = prediction.text;

    // Mise à jour historique
    chatHistory.push({ role: "USER", message: userMessage });
    chatHistory.push({ role: "CHATBOT", message: botReply });

    res.json({ reply: botReply });

  } catch (error) {
    console.error("Erreur API Cohere:", error.message);
    res.status(500).json({ reply: "🤖 Erreur de communication avec l'IA." });
  }
});

// Lancement du serveur
app.listen(3000, () => {
  console.log("--------------------------------------------------");
  console.log("🚀 BACKEND LANCE SUR http://localhost:3000");
  console.log(`📂 Dossier images détecté : ${assetsPath}`);
  console.log("--------------------------------------------------");
});