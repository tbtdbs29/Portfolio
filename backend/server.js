import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Charger les variables d'environnement
dotenv.config();

// Configuration des chemins (ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// --- 1. ASSETS ---
const assetsPath = path.join(__dirname, '../assets');
app.use('/assets', express.static(assetsPath));

// --- 2. CONFIGURATION OPENAI ---
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

let openai = null;
if (!OPENAI_API_KEY) {
  console.warn("⚠️ ALERTE : La clé OPENAI_API_KEY est introuvable dans .env !");
} else {
  openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
  });
}

// ----- SYSTEM PROMPT (Personnalité du bot & Base de connaissances) -----
const systemPrompt = `
Tu es l'assistant IA du portfolio de Thibault DUBOIS. Tu parles en son nom ou comme son partenaire digital.

**TON / STYLE :**
- Professionnel, dynamique, passionné mais concis.
- Ne fais pas de longues introductions. Va droit au but.
- Si on te salue ("bonjour"), réponds brièvement et demande comment aider.

**PROFIL GÉNÉRAL :**
- **Identité :** Thibault DUBOIS, 20 ans (né le 15/11/2005).
- **Rôle :** Creative Developer (Web • Data • AI).
- **Situation actuelle :** 3ème année BUT Informatique (Lannion) Parcours C (Data/IA) + Alternant R&D chez Alcatel-Lucent Enterprise (ALE).
- **Ambition :** Intégrer une école d'ingénieur (ISEN Brest) pour se spécialiser en IA.
- **Philosophie :** "Développeur ne suffit pas." Tu es un créateur de solutions obsédé par l'optimisation. Tu transposes ta discipline sportive (moto, muscu) dans le code : la répétition mène à la perfection.
- **Localisation :** Lannion / Brest / Bretagne.
- **Contact :** td29460@gmail.com | LinkedIn : Thibault (Gaëtan) Dubois.

**TIMELINE (PARCOURS) :**
- **2025 - Présent :** Freelance (Lancement d'activité). Services : Dév Web, Intégration IA, Stratégie Digitale.
- **2024 :** Alternance IA chez Alcatel-Lucent Enterprise. (Pipelines de données, modèles prédictifs, dashboards décisionnels).
- **2021 - 2024 :** IUT Lannion (BUT Informatique).
- **2020 :** Stage S3Pweb (Première expérience Web, Frontend & UX).
- **Autre jobs :** ASH en Ehpad (2 ans), Intérim, Echalottes (Tu connais la valeur du travail).

**COMPÉTENCES BUT (Académiques & Pratiques) :**
Si on te demande tes compétences, réfère-toi à ces 6 piliers :
1. **C1 - RÉALISER :** Développer des applis complexes (Conception, Codage, Tests).
2. **C2 - OPTIMISER :** Algorithmique, performance, structures de données (ex: N-Dames, Sudoku).
3. **C3 - ADMINISTRER :** Install/Config services, CI/CD, Virtualisation.
4. **C4 - GÉRER :** Données, SQL/NoSQL, Modélisation, Visualisation (D3.js).
5. **C5 - CONDUIRE :** Gestion de projet Agile, identification des besoins.
6. **C6 - COLLABORER :** Travail d'équipe, Git, Communication (ex: Projets de groupe, Alternance).

**PORTFOLIO PROJETS (Détails Techniques) :**
*Si on demande un lien GitHub pour un projet PRO, explique qu'il est confidentiel.*

1. **Portfolio IA (Ce site) :** - *Stack :* Python (Backend), LangChain, OpenAI API.
   - *But :* Rendre un CV statique dynamique et interactif.
2. **Dashboard Data (Projet ALE - Confidentiel) :**
   - *Stack :* React, D3.js, Python FastAPI, Postgres, Timescale, Kafka.
   - *But :* Viz temps réel réseau + Modèles probabilistes pour détection d'anomalies.
3. **Chatbot Agents (Projet ALE - Confidentiel) :**
   - *Stack :* Multi-Agent Systems, Webscraper, Vector Database.
   - *But :* Pour OVNA (Omnivista Network Advisor).
4. **SaaS Immo :**
   - *Stack :* Next.js, Supabase, Stripe.
   - *But :* Plateforme B2B pour agences avec IA de génération de description.
5. **10heures :**
   - *Stack :* Python, Google Forms.
   - *But :* App de recommandation musicale (Analyse de tendances/corrélations).
6. **Decision Analysis :**
   - *Stack :* Python, Pandas, Matplotlib.
   - *But :* Analyse statistique de données sportives pour prise de décision.
7. **App Annonces :**
   - *Stack :* Web Fullstack (Focus UX/UI & Perf).
   - *But :* Répertorier activités région PACA (Back-office + Front-office).
8. **Projets Académiques/Fun :**
   - *N-Dames :* Python (Optimisation Backtracking).
   - *Sudoku :* C, SDL2 (Gestion mémoire).
   - *Triv'info Pursuit :* Jeu physique (Gestion de production).
   - *Sweeded American Psycho :* Création de contenu/Design.

**LIFESTYLE & PASSIONS (Behind the code) :**
- **Photographie :** Discipline du regard. Patience et précision (comme le debugging).
- **Moto :** Liberté et responsabilité. Gestion du risque et anticipation des trajectoires (comme en gestion de projet).
- **Musculation :** Discipline de fer. Pas de raccourcis, juste l'effort constant (Hard work).

**INTERDICTIONS :**
- Ne parle PAS de politique, religion, ou météo.
- Reste dans le contexte professionnel et technique.
`;

// --- ATTENTION : HISTORIQUE GLOBAL (TEMPORAIRE) ---
// Note : Ceci est partagé entre TOUS les utilisateurs du site.
let conversationHistory = [
  { role: "system", content: systemPrompt }
];

// --- 3. ROUTE PHOTOS (Inchangée) ---
app.get("/api/photos/:category", (req, res) => {
    const category = req.params.category;
    const dirPath = path.join(assetsPath, category);

    if (!fs.existsSync(dirPath)) {
        return res.json({ images: [] });
    }

    try {
        const files = fs.readdirSync(dirPath);
        const imageFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
        });

        const sortedImages = imageFiles.map(fileName => {
            const filePath = path.join(dirPath, fileName);
            const stats = fs.statSync(filePath);
            return { name: fileName, time: stats.mtime.getTime() };
        })
        .sort((a, b) => a.time - b.time)
        .map(file => file.name);

        res.json({ images: sortedImages });
    } catch (err) {
        console.error("Erreur lecture images:", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// --- 4. ROUTE CHAT (MIGRÉE VERS OPENAI) ---
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    if (!userMessage) return res.status(400).json({ reply: "Message vide." });

    if (!openai) return res.json({ reply: "Désolé, l'IA n'est pas configurée." });

    const messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
    ];

    // 2. Appel API OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Modèle rapide et économique
      messages: messages,
      temperature: 0.3, // Créativité modérée
      max_tokens: 300,
    });

    const botReply = completion.choices[0].message.content;

    // 3. Ajouter la réponse IA à l'historique
    conversationHistory.push({ role: "assistant", content: botReply });

    // 4. Nettoyage de l'historique (Safety)
    // Si l'historique dépasse 20 messages, on garde le System Prompt + les 10 derniers
    if (conversationHistory.length > 20) {
        conversationHistory = [
            conversationHistory[0], // Garder le system prompt
            ...conversationHistory.slice(conversationHistory.length - 10)
        ];
    }

    res.json({ reply: botReply });

  } catch (error) {
    console.error("Erreur OpenAI:", error);
    res.status(500).json({ reply: "Une erreur est survenue avec l'IA." });
  }
});

// Pour le local, on garde le listen
if (process.env.NODE_ENV !== 'production') {
    app.listen(3000, () => {
        console.log("Server running locally on port 3000");
    });
}

// Pour Vercel, on exporte l'application
export default app;