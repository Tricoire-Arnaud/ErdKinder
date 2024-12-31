require('dotenv').config();
const { Article, User, sequelize } = require('../models');

const articles = [
    {
        title: "L'Erdkinder : La Vision de Maria Montessori pour l'Adolescent",
        content: `
Maria Montessori a développé le concept d'Erdkinder (littéralement "enfants de la terre") comme une réponse aux besoins spécifiques des adolescents. Elle considérait l'adolescence comme une période de renaissance, où l'individu se reconstruit physiquement et psychologiquement.

Dans sa vision, l'environnement idéal pour les adolescents est une ferme-école où ils peuvent :
- Connecter leur apprentissage académique à des expériences pratiques
- Développer leur indépendance économique à travers des projets concrets
- Comprendre leur rôle dans la société à travers le travail productif
- Cultiver leur connexion avec la nature et la terre

L'Erdkinder offre un cadre où les adolescents peuvent développer :
- Leur confiance en soi à travers des réalisations concrètes
- Leurs compétences sociales dans un environnement communautaire
- Leur compréhension de l'économie par des projets pratiques
- Leur sens des responsabilités et leur autonomie`,
        published: true,
        authorId: 1
    },
    {
        title: "Le Plan d'Études Montessori pour les 12-18 ans",
        content: `
Maria Montessori a conçu un programme d'études unique pour les adolescents, basé sur leur période sensible de développement. Ce programme intègre :

1. Études Académiques
- Mathématiques et sciences appliquées à des projets concrets
- Langues vivantes à travers des échanges réels
- Histoire et géographie en lien avec l'actualité
- Expression artistique et créative

2. Travail Pratique
- Agriculture et jardinage
- Artisanat et technologies
- Gestion de projets entrepreneuriaux
- Cuisine et nutrition

3. Développement Personnel
- Conscience environnementale
- Responsabilité sociale
- Leadership et collaboration
- Gestion émotionnelle

Cette approche holistique vise à former des individus complets, capables de s'adapter et de contribuer positivement à la société.`,
        published: true,
        authorId: 1
    },
    {
        title: "L'Importance de l'Environnement Préparé pour l'Adolescent",
        content: `
Maria Montessori insistait sur l'importance cruciale de l'environnement préparé pour les adolescents. Selon elle, cet environnement doit répondre à leurs besoins de :

Développement Social
- Espaces de collaboration
- Zones de travail communautaire
- Lieux de rencontre et d'échange

Croissance Intellectuelle
- Laboratoires et ateliers
- Bibliothèque et ressources numériques
- Espaces de présentation et de débat

Expression Créative
- Studios d'art et de musique
- Espaces de théâtre et d'expression corporelle
- Ateliers de création numérique

Connection avec la Nature
- Jardins et espaces verts
- Zones d'observation scientifique
- Aires de repos et de méditation

L'environnement doit être conçu pour encourager l'indépendance tout en offrant le soutien nécessaire pendant cette période critique de développement.`,
        published: true,
        authorId: 1
    },
    {
        title: "La Valorisation du Travail Manuel dans la Pédagogie Montessori",
        content: `
Maria Montessori accordait une importance particulière au travail manuel dans l'éducation des adolescents, le considérant comme un élément essentiel de leur développement.

Bénéfices du Travail Manuel :
- Développement de la concentration et de la précision
- Renforcement de la confiance en soi
- Compréhension de la valeur du travail
- Integration des apprentissages théoriques

Activités Proposées :
- Jardinage et agriculture
- Menuiserie et artisanat
- Cuisine et transformation alimentaire
- Réparation et maintenance

Le travail manuel permet aux adolescents de :
- Développer leur coordination
- Comprendre les processus de production
- Acquérir des compétences pratiques
- Valoriser tous les types de travail

Cette approche prépare les jeunes à devenir des adultes compétents et polyvalents.`,
        published: true,
        authorId: 1
    },
    {
        title: "L'Adolescent et la Société : La Vision Montessori",
        content: `
Maria Montessori voyait l'adolescence comme une période cruciale pour l'intégration sociale. Elle préconisait une approche où l'adolescent :

Développe sa Conscience Sociale
- Participation à des projets communautaires
- Engagement dans des causes environnementales
- Compréhension des enjeux sociétaux

Expérimente la Vie en Société
- Gestion de micro-entreprises
- Organisation d'événements
- Participation aux décisions collectives

Découvre son Rôle Social
- Exploration des métiers
- Stages et observations
- Projets d'utilité sociale

Cette approche permet aux adolescents de :
- Comprendre leur place dans la société
- Développer leur responsabilité sociale
- Se préparer à leur rôle d'adulte
- Contribuer activement à leur communauté`,
        published: true,
        authorId: 1
    }
];

async function seedArticles() {
    try {
        // S'assurer qu'un admin existe
        const adminUser = await User.findOne({
            where: { email: 'admin@maisondesenfants.fr' }
        });

        if (!adminUser) {
            console.error('Aucun utilisateur admin trouvé');
            return;
        }

        // Créer les articles
        for (const article of articles) {
            await Article.create({
                ...article,
                authorId: adminUser.id
            });
            console.log(`Article créé : ${article.title}`);
        }

        console.log('Articles créés avec succès');
    } catch (error) {
        console.error('Erreur lors de la création des articles:', error);
    } finally {
        await sequelize.close();
    }
}

seedArticles(); 