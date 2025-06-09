export interface LegalContent {
  mentionsLegales: {
    title: string
    content: string
    lastUpdated: string
  }
  politiqueConfidentialite: {
    title: string
    content: string
    lastUpdated: string
  }
  conditionsUtilisation: {
    title: string
    content: string
    lastUpdated: string
  }
}

export class LegalContentService {
  private static readonly STORAGE_KEY = "fixeopro_legal_content"

  static getDefaultContent(): LegalContent {
    return {
      mentionsLegales: {
        title: "Mentions légales",
        content: `
# Mentions légales

## Éditeur du site

**Fixeo.pro**  
Les Saquèdes  
83120 Sainte-Maxime  
France  

**Email :** contact@fixeo.pro  
**Téléphone :** 07 83 49 72 62  

## Directeur de la publication

Le directeur de la publication est le représentant légal de Fixeo.pro.

## Hébergement

Ce site est hébergé par :  
**Vercel Inc.**  
340 S Lemon Ave #4133  
Walnut, CA 91789  
États-Unis  

## Propriété intellectuelle

L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.

La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est formellement interdite sauf autorisation expresse du directeur de la publication.

## Données personnelles

Conformément à la loi "Informatique et Libertés" du 6 janvier 1978 modifiée et au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition aux données personnelles vous concernant.

Pour exercer ces droits, vous pouvez nous contacter à l'adresse : contact@fixeo.pro

## Cookies

Ce site utilise des cookies pour améliorer l'expérience utilisateur et analyser le trafic. En continuant à naviguer sur ce site, vous acceptez l'utilisation de cookies.

## Responsabilité

Les informations contenues sur ce site sont aussi précises que possible et le site est périodiquement remis à jour, mais peut toutefois contenir des inexactitudes, des omissions ou des lacunes.

Fixeo.pro ne pourra être tenu responsable des dommages directs et indirects causés au matériel de l'utilisateur, lors de l'accès au site.

## Liens hypertextes

Les liens hypertextes mis en place dans le cadre du présent site web en direction d'autres ressources présentes sur le réseau Internet ne sauraient engager la responsabilité de Fixeo.pro.

## Litiges

Les présentes conditions du site web et votre utilisation de ce site web sont régies par la loi française. Tout litige portant sur l'utilisation du site web sera de la compétence exclusive des tribunaux français.

---

*Dernière mise à jour : ${new Date().toLocaleDateString("fr-FR")}*
        `,
        lastUpdated: new Date().toISOString(),
      },
      politiqueConfidentialite: {
        title: "Politique de confidentialité",
        content: `
# Politique de confidentialité

## Introduction

Fixeo.pro s'engage à protéger la confidentialité de vos données personnelles. Cette politique explique comment nous collectons, utilisons et protégeons vos informations.

## Données collectées

### Données d'inscription
- Nom et prénom
- Adresse email
- Numéro de téléphone
- Adresse postale
- Type de compte (client ou réparateur)

### Données de navigation
- Adresse IP
- Type de navigateur
- Pages visitées
- Durée de visite
- Cookies techniques

### Données de service
- Demandes de réparation
- Messages échangés
- Évaluations et commentaires
- Historique des transactions

## Utilisation des données

Vos données sont utilisées pour :

### Services principaux
- Créer et gérer votre compte
- Traiter vos demandes de réparation
- Mettre en relation clients et réparateurs
- Assurer le support client

### Communications
- Envoyer des notifications importantes
- Informer des nouvelles fonctionnalités
- Répondre à vos questions
- Envoyer des newsletters (avec votre consentement)

### Amélioration du service
- Analyser l'utilisation du site
- Améliorer nos fonctionnalités
- Personnaliser votre expérience
- Prévenir la fraude

## Base légale du traitement

Nous traitons vos données sur la base de :
- **Contrat** : Exécution de nos services
- **Intérêt légitime** : Amélioration du service, sécurité
- **Consentement** : Newsletters, cookies non essentiels
- **Obligation légale** : Facturation, comptabilité

## Partage des données

### Réparateurs partenaires
Vos coordonnées peuvent être partagées avec les réparateurs pour traiter vos demandes.

### Prestataires techniques
Nous utilisons des prestataires pour :
- Hébergement (Vercel)
- Emails (services SMTP)
- Paiements (prestataires certifiés)
- Analytics (anonymisées)

### Autorités
En cas d'obligation légale ou de demande judiciaire.

## Conservation des données

- **Comptes actifs** : Durée de vie du compte + 3 ans
- **Comptes supprimés** : 1 an pour les obligations légales
- **Données de navigation** : 13 mois maximum
- **Données comptables** : 10 ans (obligation légale)

## Vos droits

Conformément au RGPD, vous disposez des droits suivants :

### Droit d'accès
Obtenir une copie de vos données personnelles.

### Droit de rectification
Corriger des données inexactes ou incomplètes.

### Droit à l'effacement
Supprimer vos données dans certaines conditions.

### Droit à la limitation
Limiter le traitement de vos données.

### Droit à la portabilité
Récupérer vos données dans un format structuré.

### Droit d'opposition
Vous opposer au traitement pour des raisons légitimes.

## Exercer vos droits

Pour exercer vos droits, contactez-nous :
- **Email** : contact@fixeo.pro
- **Courrier** : Fixeo.pro, Les Saquèdes, 83120 Sainte-Maxime

Nous répondrons dans un délai d'un mois.

## Sécurité

Nous mettons en place des mesures techniques et organisationnelles pour protéger vos données :
- Chiffrement des données sensibles
- Accès restreint aux données
- Surveillance des accès
- Sauvegardes régulières
- Formation du personnel

## Cookies

### Cookies essentiels
Nécessaires au fonctionnement du site (connexion, panier).

### Cookies analytiques
Pour comprendre l'utilisation du site (avec votre consentement).

### Cookies marketing
Pour personnaliser la publicité (avec votre consentement).

Vous pouvez gérer vos préférences de cookies dans les paramètres de votre navigateur.

## Modifications

Cette politique peut être modifiée. Les changements importants vous seront notifiés par email ou sur le site.

## Contact

Pour toute question sur cette politique :
- **Email** : contact@fixeo.pro
- **Téléphone** : 07 83 49 72 62

## Autorité de contrôle

En cas de litige, vous pouvez saisir la CNIL :
**Commission Nationale de l'Informatique et des Libertés**  
3 Place de Fontenoy - TSA 80715  
75334 PARIS CEDEX 07  
Téléphone : 01 53 73 22 22  

---

*Dernière mise à jour : ${new Date().toLocaleDateString("fr-FR")}*
        `,
        lastUpdated: new Date().toISOString(),
      },
      conditionsUtilisation: {
        title: "Conditions générales d'utilisation",
        content: `
# Conditions générales d'utilisation

## Article 1 - Objet

Les présentes Conditions Générales d'Utilisation (CGU) régissent l'utilisation de la plateforme Fixeo.pro, service de mise en relation entre particuliers et professionnels de la réparation.

## Article 2 - Définitions

- **Plateforme** : Le site web Fixeo.pro et ses services
- **Utilisateur** : Toute personne utilisant la plateforme
- **Client** : Utilisateur demandant un service de réparation
- **Réparateur** : Professionnel proposant des services de réparation
- **Demande** : Annonce de besoin de réparation publiée par un client

## Article 3 - Accès à la plateforme

### 3.1 Conditions d'accès
L'accès à la plateforme est gratuit pour la consultation. L'inscription est nécessaire pour publier des demandes ou proposer des services.

### 3.2 Inscription
L'inscription nécessite :
- Être majeur ou avoir l'autorisation parentale
- Fournir des informations exactes et à jour
- Accepter les présentes CGU
- Vérifier son adresse email

### 3.3 Compte utilisateur
Chaque utilisateur est responsable de :
- La confidentialité de ses identifiants
- L'exactitude de ses informations
- Les activités réalisées avec son compte

## Article 4 - Services proposés

### 4.1 Pour les clients
- Publication de demandes de réparation
- Réception de devis de réparateurs
- Sélection du réparateur
- Évaluation du service

### 4.2 Pour les réparateurs
- Consultation des demandes
- Envoi de devis
- Communication avec les clients
- Gestion du profil professionnel

## Article 5 - Obligations des utilisateurs

### 5.1 Obligations générales
- Utiliser la plateforme conformément à sa destination
- Respecter la législation en vigueur
- Ne pas porter atteinte aux droits des tiers
- Fournir des informations exactes

### 5.2 Obligations des clients
- Décrire précisément le problème
- Fournir des informations complètes
- Respecter les rendez-vous convenus
- Payer les services selon les modalités convenues

### 5.3 Obligations des réparateurs
- Posséder les qualifications nécessaires
- Respecter les devis proposés
- Effectuer les réparations dans les règles de l'art
- Respecter les délais convenus

## Article 6 - Interdictions

Il est strictement interdit de :
- Publier des contenus illégaux, diffamatoires ou inappropriés
- Utiliser la plateforme à des fins commerciales non autorisées
- Contourner les systèmes de sécurité
- Usurper l'identité d'autrui
- Harceler ou menacer d'autres utilisateurs

## Article 7 - Tarification

### 7.1 Utilisation gratuite
- Consultation des demandes
- Inscription et création de profil
- Communication de base

### 7.2 Services payants
- Abonnements réparateurs pour répondre aux demandes
- Services premium (visibilité accrue, etc.)
- Commission sur les transactions

### 7.3 Paiements
Les paiements s'effectuent par les moyens proposés sur la plateforme. Les tarifs sont indiqués TTC.

## Article 8 - Responsabilité

### 8.1 Responsabilité de Fixeo.pro
Fixeo.pro est un intermédiaire technique. Sa responsabilité est limitée à :
- La fourniture de la plateforme
- La sécurité des données
- Le respect de la réglementation

### 8.2 Exclusions de responsabilité
Fixeo.pro n'est pas responsable :
- De la qualité des services fournis par les réparateurs
- Des litiges entre utilisateurs
- Des dommages causés lors des réparations
- Des pannes techniques indépendantes de sa volonté

### 8.3 Responsabilité des utilisateurs
Chaque utilisateur est responsable de ses actes et des dommages qu'il pourrait causer.

## Article 9 - Propriété intellectuelle

### 9.1 Contenu de la plateforme
Tous les éléments de la plateforme (textes, images, logos, etc.) sont protégés par le droit d'auteur.

### 9.2 Contenu des utilisateurs
En publiant du contenu, les utilisateurs accordent à Fixeo.pro une licence d'utilisation non exclusive.

## Article 10 - Données personnelles

Le traitement des données personnelles est régi par notre Politique de Confidentialité, partie intégrante des présentes CGU.

## Article 11 - Modération

Fixeo.pro se réserve le droit de :
- Modérer les contenus publiés
- Suspendre ou supprimer des comptes
- Refuser l'accès à certains utilisateurs

## Article 12 - Résiliation

### 12.1 Résiliation par l'utilisateur
L'utilisateur peut supprimer son compte à tout moment depuis son profil.

### 12.2 Résiliation par Fixeo.pro
En cas de violation des CGU, Fixeo.pro peut suspendre ou supprimer un compte après mise en demeure.

## Article 13 - Modifications

Les présentes CGU peuvent être modifiées à tout moment. Les utilisateurs seront informés des modifications importantes.

## Article 14 - Droit applicable

Les présentes CGU sont soumises au droit français. Tout litige relève de la compétence des tribunaux français.

## Article 15 - Contact

Pour toute question relative aux présentes CGU :
- **Email** : contact@fixeo.pro
- **Adresse** : Fixeo.pro, Les Saquèdes, 83120 Sainte-Maxime, France

---

*Dernière mise à jour : ${new Date().toLocaleDateString("fr-FR")}*
        `,
        lastUpdated: new Date().toISOString(),
      },
    }
  }

  static getContent(): LegalContent {
    if (typeof window === "undefined") return this.getDefaultContent()

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (!stored) {
        const defaultContent = this.getDefaultContent()
        this.saveContent(defaultContent)
        return defaultContent
      }
      return { ...this.getDefaultContent(), ...JSON.parse(stored) }
    } catch (error) {
      console.error("Erreur lors du chargement du contenu légal:", error)
      return this.getDefaultContent()
    }
  }

  static saveContent(content: LegalContent): void {
    if (typeof window === "undefined") return

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(content))
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du contenu légal:", error)
    }
  }

  static updateSection(section: keyof LegalContent, data: { title: string; content: string }): void {
    const currentContent = this.getContent()
    currentContent[section] = {
      ...data,
      lastUpdated: new Date().toISOString(),
    }
    this.saveContent(currentContent)
  }
}
