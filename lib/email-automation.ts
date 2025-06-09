// Service de gestion des emails automatiques pour FixeoPro
export interface EmailEvent {
  id: string
  name: string
  description: string
  category: "user" | "request" | "system"
  enabled: boolean
  template: EmailTemplate
  variables: EmailVariable[]
}

export interface EmailVariable {
  key: string
  name: string
  description: string
  example: string
  required: boolean
}

export interface EmailTemplate {
  id: string
  name: string
  subject: string
  htmlContent: string
  textContent: string
  variables: string[]
}

export interface EmailSettings {
  events: { [eventId: string]: boolean }
  templates: { [templateId: string]: EmailTemplate }
  globalSettings: {
    fromName: string
    fromEmail: string
    replyTo: string
    footerText: string
    unsubscribeUrl: string
    logoUrl: string
  }
}

class EmailAutomationService {
  private settings: EmailSettings | null = null

  // Charger les paramètres
  loadSettings(): EmailSettings {
    if (typeof window === "undefined") {
      return this.getDefaultSettings()
    }

    try {
      const saved = localStorage.getItem("fixeopro_email_automation")
      if (saved) {
        this.settings = JSON.parse(saved)
        return this.settings!
      }
    } catch (error) {
      console.error("Erreur lors du chargement des paramètres email:", error)
    }

    return this.getDefaultSettings()
  }

  // Sauvegarder les paramètres
  saveSettings(settings: EmailSettings): void {
    if (typeof window === "undefined") return

    try {
      this.settings = settings
      localStorage.setItem("fixeopro_email_automation", JSON.stringify(settings))
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des paramètres email:", error)
    }
  }

  // Paramètres par défaut
  private getDefaultSettings(): EmailSettings {
    return {
      events: {
        user_registration_client: true,
        user_registration_repairer: true,
        user_email_verification: true,
        request_created: true,
        request_response_received: true,
        request_repairer_selected: true,
        request_completed: true,
        request_cancelled: true,
        repairer_contact_client: true,
        subscription_trial_ending: true,
        subscription_expired: true,
        admin_new_user: true,
        admin_new_request: true,
      },
      templates: this.getDefaultTemplates(),
      globalSettings: {
        fromName: "FixeoPro",
        fromEmail: "contact@fixeo.pro",
        replyTo: "contact@fixeo.pro",
        footerText: "FixeoPro - Plateforme de mise en relation pour réparations",
        unsubscribeUrl: "{{platformUrl}}/unsubscribe",
        logoUrl: "{{platformUrl}}/logo.png",
      },
    }
  }

  // Templates par défaut
  private getDefaultTemplates(): { [templateId: string]: EmailTemplate } {
    return {
      user_registration_client: {
        id: "user_registration_client",
        name: "Inscription client",
        subject: "Bienvenue sur FixeoPro, {{firstName}} !",
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #2563eb; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; font-size: 28px;">🎉 Bienvenue sur FixeoPro !</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Votre compte client a été créé avec succès</p>
            </div>
            
            <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
              <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">Bonjour {{firstName}} {{lastName}},</p>
              
              <p style="color: #6b7280; line-height: 1.6; margin-bottom: 20px;">
                Félicitations ! Votre compte client FixeoPro a été créé avec succès. Vous pouvez maintenant publier vos demandes de dépannage et entrer en contact avec nos réparateurs professionnels.
              </p>

              <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #374151; margin-top: 0;">Vos informations de compte :</h3>
                <p style="margin: 5px 0; color: #6b7280;"><strong>Email :</strong> {{email}}</p>
                <p style="margin: 5px 0; color: #6b7280;"><strong>Téléphone :</strong> {{phone}}</p>
                <p style="margin: 5px 0; color: #6b7280;"><strong>Ville :</strong> {{city}}</p>
                <p style="margin: 5px 0; color: #6b7280;"><strong>Date d'inscription :</strong> {{registrationDate}}</p>
              </div>

              <div style="background: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #1e40af; margin-top: 0;">🚀 Prochaines étapes :</h3>
                <ul style="color: #1e40af; margin: 0; padding-left: 20px;">
                  <li>Vérifiez votre adresse email (si pas encore fait)</li>
                  <li>Complétez votre profil</li>
                  <li>Publiez votre première demande de dépannage</li>
                  <li>Explorez notre réseau de réparateurs</li>
                </ul>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="{{platformUrl}}/profil" 
                   style="background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                  Accéder à mon compte
                </a>
              </div>

              <div style="text-align: center; margin: 20px 0;">
                <a href="{{platformUrl}}/demande-reparation" 
                   style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  Publier une demande
                </a>
              </div>
            </div>

            <div style="background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
              <p style="margin: 0; color: #6b7280; font-size: 14px;">
                {{footerText}}<br>
                <a href="{{unsubscribeUrl}}" style="color: #6b7280;">Se désabonner</a>
              </p>
            </div>
          </div>
        `,
        textContent: `
Bienvenue sur FixeoPro !

Bonjour {{firstName}} {{lastName}},

Félicitations ! Votre compte client FixeoPro a été créé avec succès.

Vos informations de compte :
- Email : {{email}}
- Téléphone : {{phone}}
- Ville : {{city}}
- Date d'inscription : {{registrationDate}}

Prochaines étapes :
- Vérifiez votre adresse email
- Complétez votre profil
- Publiez votre première demande de dépannage

Accéder à votre compte : {{platformUrl}}/profil
Publier une demande : {{platformUrl}}/demande-reparation

{{footerText}}
Se désabonner : {{unsubscribeUrl}}
        `,
        variables: [
          "firstName",
          "lastName",
          "email",
          "phone",
          "city",
          "registrationDate",
          "platformUrl",
          "footerText",
          "unsubscribeUrl",
        ],
      },

      user_registration_repairer: {
        id: "user_registration_repairer",
        name: "Inscription réparateur",
        subject: "Bienvenue dans le réseau FixeoPro, {{firstName}} !",
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #10b981; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; font-size: 28px;">🔧 Bienvenue dans notre réseau !</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Votre compte réparateur professionnel est prêt</p>
            </div>
            
            <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
              <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">Bonjour {{firstName}} {{lastName}},</p>
              
              <p style="color: #6b7280; line-height: 1.6; margin-bottom: 20px;">
                Félicitations ! Vous faites maintenant partie du réseau de réparateurs professionnels FixeoPro. Votre période d'essai gratuite de 15 jours commence dès maintenant.
              </p>

              <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #374151; margin-top: 0;">Vos informations professionnelles :</h3>
                <p style="margin: 5px 0; color: #6b7280;"><strong>Email :</strong> {{email}}</p>
                <p style="margin: 5px 0; color: #6b7280;"><strong>Téléphone :</strong> {{phone}}</p>
                <p style="margin: 5px 0; color: #6b7280;"><strong>Ville :</strong> {{city}}</p>
                <p style="margin: 5px 0; color: #6b7280;"><strong>Entreprise :</strong> {{companyName}}</p>
                <p style="margin: 5px 0; color: #6b7280;"><strong>Spécialités :</strong> {{specialties}}</p>
              </div>

              <div style="background: #dcfce7; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #166534; margin-top: 0;">🎁 Période d'essai gratuite :</h3>
                <p style="color: #166534; margin: 0;">
                  <strong>15 jours gratuits</strong> avec toutes les fonctionnalités premium !<br>
                  Fin de l'essai : {{trialEndDate}}
                </p>
              </div>

              <div style="background: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #1e40af; margin-top: 0;">🚀 Commencez dès maintenant :</h3>
                <ul style="color: #1e40af; margin: 0; padding-left: 20px;">
                  <li>Complétez votre profil professionnel</li>
                  <li>Ajoutez vos photos d'entreprise</li>
                  <li>Consultez les demandes disponibles</li>
                  <li>Répondez à vos premières demandes</li>
                </ul>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="{{platformUrl}}/profil-pro" 
                   style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                  Accéder à mon espace pro
                </a>
              </div>

              <div style="text-align: center; margin: 20px 0;">
                <a href="{{platformUrl}}/liste-demandes" 
                   style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  Voir les demandes
                </a>
              </div>
            </div>

            <div style="background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
              <p style="margin: 0; color: #6b7280; font-size: 14px;">
                {{footerText}}<br>
                <a href="{{unsubscribeUrl}}" style="color: #6b7280;">Se désabonner</a>
              </p>
            </div>
          </div>
        `,
        textContent: `
Bienvenue dans le réseau FixeoPro !

Bonjour {{firstName}} {{lastName}},

Félicitations ! Vous faites maintenant partie du réseau de réparateurs professionnels FixeoPro.

Vos informations professionnelles :
- Email : {{email}}
- Téléphone : {{phone}}
- Ville : {{city}}
- Entreprise : {{companyName}}
- Spécialités : {{specialties}}

Période d'essai gratuite :
15 jours gratuits avec toutes les fonctionnalités premium !
Fin de l'essai : {{trialEndDate}}

Commencez dès maintenant :
- Complétez votre profil professionnel
- Ajoutez vos photos d'entreprise
- Consultez les demandes disponibles
- Répondez à vos premières demandes

Accéder à votre espace pro : {{platformUrl}}/profil-pro
Voir les demandes : {{platformUrl}}/liste-demandes

{{footerText}}
Se désabonner : {{unsubscribeUrl}}
        `,
        variables: [
          "firstName",
          "lastName",
          "email",
          "phone",
          "city",
          "companyName",
          "specialties",
          "trialEndDate",
          "platformUrl",
          "footerText",
          "unsubscribeUrl",
        ],
      },

      request_created: {
        id: "request_created",
        name: "Nouvelle demande créée",
        subject: "Votre demande de dépannage a été publiée - {{requestTitle}}",
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #2563eb; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; font-size: 24px;">📝 Demande publiée avec succès !</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Votre demande est maintenant visible par nos réparateurs</p>
            </div>
            
            <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
              <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">Bonjour {{clientName}},</p>
              
              <p style="color: #6b7280; line-height: 1.6; margin-bottom: 20px;">
                Votre demande de dépannage a été publiée avec succès sur FixeoPro. Nos réparateurs professionnels peuvent maintenant la consulter et vous proposer leurs services.
              </p>

              <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #374151; margin-top: 0;">Détails de votre demande :</h3>
                <p style="margin: 5px 0; color: #6b7280;"><strong>Titre :</strong> {{requestTitle}}</p>
                <p style="margin: 5px 0; color: #6b7280;"><strong>Catégorie :</strong> {{requestCategory}}</p>
                <p style="margin: 5px 0; color: #6b7280;"><strong>Urgence :</strong> {{requestUrgency}}</p>
                <p style="margin: 5px 0; color: #6b7280;"><strong>Budget :</strong> {{requestBudget}}</p>
                <p style="margin: 5px 0; color: #6b7280;"><strong>Localisation :</strong> {{requestLocation}}</p>
                <p style="margin: 5px 0; color: #6b7280;"><strong>Date de création :</strong> {{requestDate}}</p>
              </div>

              <div style="background: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #1e40af; margin-top: 0;">📱 Que se passe-t-il maintenant ?</h3>
                <ul style="color: #1e40af; margin: 0; padding-left: 20px;">
                  <li>Les réparateurs de votre région vont consulter votre demande</li>
                  <li>Vous recevrez des propositions par email</li>
                  <li>Vous pourrez comparer les offres et choisir votre réparateur</li>
                  <li>Le réparateur sélectionné vous contactera directement</li>
                </ul>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="{{platformUrl}}/demande/{{requestId}}" 
                   style="background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                  Voir ma demande
                </a>
              </div>

              <div style="text-align: center; margin: 20px 0;">
                <a href="{{platformUrl}}/mes-demandes" 
                   style="background: #6b7280; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  Toutes mes demandes
                </a>
              </div>
            </div>

            <div style="background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
              <p style="margin: 0; color: #6b7280; font-size: 14px;">
                {{footerText}}<br>
                <a href="{{unsubscribeUrl}}" style="color: #6b7280;">Se désabonner</a>
              </p>
            </div>
          </div>
        `,
        textContent: `
Demande publiée avec succès !

Bonjour {{clientName}},

Votre demande de dépannage a été publiée avec succès sur FixeoPro.

Détails de votre demande :
- Titre : {{requestTitle}}
- Catégorie : {{requestCategory}}
- Urgence : {{requestUrgency}}
- Budget : {{requestBudget}}
- Localisation : {{requestLocation}}
- Date de création : {{requestDate}}

Que se passe-t-il maintenant ?
- Les réparateurs de votre région vont consulter votre demande
- Vous recevrez des propositions par email
- Vous pourrez comparer les offres et choisir votre réparateur
- Le réparateur sélectionné vous contactera directement

Voir votre demande : {{platformUrl}}/demande/{{requestId}}
Toutes vos demandes : {{platformUrl}}/mes-demandes

{{footerText}}
Se désabonner : {{unsubscribeUrl}}
        `,
        variables: [
          "clientName",
          "requestTitle",
          "requestCategory",
          "requestUrgency",
          "requestBudget",
          "requestLocation",
          "requestDate",
          "requestId",
          "platformUrl",
          "footerText",
          "unsubscribeUrl",
        ],
      },

      admin_new_user: {
        id: "admin_new_user",
        name: "Notification admin - Nouvel utilisateur",
        subject: "[ADMIN] Nouvel utilisateur inscrit : {{userType}} - {{userName}}",
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; font-size: 20px;">🔔 Nouvelle inscription</h1>
            </div>
            
            <div style="background: white; padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
              <p><strong>Type :</strong> {{userType}}</p>
              <p><strong>Nom :</strong> {{userName}}</p>
              <p><strong>Email :</strong> {{userEmail}}</p>
              <p><strong>Téléphone :</strong> {{userPhone}}</p>
              <p><strong>Ville :</strong> {{userCity}}</p>
              <p><strong>Date :</strong> {{registrationDate}}</p>
              
              <div style="text-align: center; margin: 20px 0;">
                <a href="{{platformUrl}}/admin" 
                   style="background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  Voir dans l'admin
                </a>
              </div>
            </div>
          </div>
        `,
        textContent: `
Nouvelle inscription

Type : {{userType}}
Nom : {{userName}}
Email : {{userEmail}}
Téléphone : {{userPhone}}
Ville : {{userCity}}
Date : {{registrationDate}}

Voir dans l'admin : {{platformUrl}}/admin
        `,
        variables: ["userType", "userName", "userEmail", "userPhone", "userCity", "registrationDate", "platformUrl"],
      },

      admin_new_request: {
        id: "admin_new_request",
        name: "Notification admin - Nouvelle demande",
        subject: "[ADMIN] Nouvelle demande : {{requestCategory}} - {{requestTitle}}",
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; font-size: 20px;">📝 Nouvelle demande</h1>
            </div>
            
            <div style="background: white; padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
              <p><strong>Titre :</strong> {{requestTitle}}</p>
              <p><strong>Catégorie :</strong> {{requestCategory}}</p>
              <p><strong>Client :</strong> {{clientName}}</p>
              <p><strong>Urgence :</strong> {{requestUrgency}}</p>
              <p><strong>Budget :</strong> {{requestBudget}}</p>
              <p><strong>Localisation :</strong> {{requestLocation}}</p>
              <p><strong>Date :</strong> {{requestDate}}</p>
              
              <div style="text-align: center; margin: 20px 0;">
                <a href="{{platformUrl}}/admin" 
                   style="background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  Voir dans l'admin
                </a>
              </div>
            </div>
          </div>
        `,
        textContent: `
Nouvelle demande

Titre : {{requestTitle}}
Catégorie : {{requestCategory}}
Client : {{clientName}}
Urgence : {{requestUrgency}}
Budget : {{requestBudget}}
Localisation : {{requestLocation}}
Date : {{requestDate}}

Voir dans l'admin : {{platformUrl}}/admin
        `,
        variables: [
          "requestTitle",
          "requestCategory",
          "clientName",
          "requestUrgency",
          "requestBudget",
          "requestLocation",
          "requestDate",
          "platformUrl",
        ],
      },
    }
  }

  // Obtenir tous les événements disponibles
  getAvailableEvents(): EmailEvent[] {
    return [
      {
        id: "user_registration_client",
        name: "Inscription client",
        description: "Email envoyé lors de l'inscription d'un nouveau client",
        category: "user",
        enabled: true,
        template: this.getDefaultTemplates().user_registration_client,
        variables: [
          { key: "firstName", name: "Prénom", description: "Prénom de l'utilisateur", example: "Jean", required: true },
          { key: "lastName", name: "Nom", description: "Nom de l'utilisateur", example: "Dupont", required: true },
          { key: "email", name: "Email", description: "Adresse email", example: "jean@example.com", required: true },
          {
            key: "phone",
            name: "Téléphone",
            description: "Numéro de téléphone",
            example: "06 12 34 56 78",
            required: false,
          },
          { key: "city", name: "Ville", description: "Ville de résidence", example: "Paris", required: false },
          {
            key: "registrationDate",
            name: "Date d'inscription",
            description: "Date et heure d'inscription",
            example: "15/01/2024 14:30",
            required: true,
          },
        ],
      },
      {
        id: "user_registration_repairer",
        name: "Inscription réparateur",
        description: "Email envoyé lors de l'inscription d'un nouveau réparateur",
        category: "user",
        enabled: true,
        template: this.getDefaultTemplates().user_registration_repairer,
        variables: [
          { key: "firstName", name: "Prénom", description: "Prénom du réparateur", example: "Marie", required: true },
          { key: "lastName", name: "Nom", description: "Nom du réparateur", example: "Martin", required: true },
          {
            key: "email",
            name: "Email",
            description: "Adresse email professionnelle",
            example: "marie@repartech.com",
            required: true,
          },
          {
            key: "phone",
            name: "Téléphone",
            description: "Numéro de téléphone",
            example: "06 98 76 54 32",
            required: false,
          },
          { key: "city", name: "Ville", description: "Ville d'intervention", example: "Lyon", required: false },
          {
            key: "companyName",
            name: "Entreprise",
            description: "Nom de l'entreprise",
            example: "RéparTech SARL",
            required: false,
          },
          {
            key: "specialties",
            name: "Spécialités",
            description: "Domaines de spécialité",
            example: "Électroménager, Informatique",
            required: true,
          },
          {
            key: "trialEndDate",
            name: "Fin d'essai",
            description: "Date de fin de la période d'essai",
            example: "30/01/2024",
            required: true,
          },
        ],
      },
      {
        id: "request_created",
        name: "Demande créée",
        description: "Email envoyé au client quand il crée une nouvelle demande",
        category: "request",
        enabled: true,
        template: this.getDefaultTemplates().request_created,
        variables: [
          {
            key: "clientName",
            name: "Nom du client",
            description: "Nom complet du client",
            example: "Jean Dupont",
            required: true,
          },
          {
            key: "requestTitle",
            name: "Titre de la demande",
            description: "Titre de la demande de réparation",
            example: "Réparation lave-linge",
            required: true,
          },
          {
            key: "requestCategory",
            name: "Catégorie",
            description: "Catégorie de la demande",
            example: "Électroménager",
            required: true,
          },
          {
            key: "requestUrgency",
            name: "Urgence",
            description: "Niveau d'urgence",
            example: "Urgent",
            required: true,
          },
          { key: "requestBudget", name: "Budget", description: "Budget prévu", example: "100-200€", required: true },
          {
            key: "requestLocation",
            name: "Localisation",
            description: "Ville et code postal",
            example: "Paris (75001)",
            required: true,
          },
          {
            key: "requestDate",
            name: "Date de création",
            description: "Date et heure de création",
            example: "15/01/2024 14:30",
            required: true,
          },
          {
            key: "requestId",
            name: "ID de la demande",
            description: "Identifiant unique de la demande",
            example: "req_123456",
            required: true,
          },
        ],
      },
      {
        id: "admin_new_user",
        name: "Notification admin - Nouvel utilisateur",
        description: "Email envoyé aux administrateurs lors d'une nouvelle inscription",
        category: "system",
        enabled: true,
        template: this.getDefaultTemplates().admin_new_user,
        variables: [
          {
            key: "userType",
            name: "Type d'utilisateur",
            description: "Client ou Réparateur",
            example: "Client",
            required: true,
          },
          {
            key: "userName",
            name: "Nom de l'utilisateur",
            description: "Nom complet",
            example: "Jean Dupont",
            required: true,
          },
          {
            key: "userEmail",
            name: "Email de l'utilisateur",
            description: "Adresse email",
            example: "jean@example.com",
            required: true,
          },
          {
            key: "userPhone",
            name: "Téléphone",
            description: "Numéro de téléphone",
            example: "06 12 34 56 78",
            required: false,
          },
          { key: "userCity", name: "Ville", description: "Ville de l'utilisateur", example: "Paris", required: false },
          {
            key: "registrationDate",
            name: "Date d'inscription",
            description: "Date et heure",
            example: "15/01/2024 14:30",
            required: true,
          },
        ],
      },
      {
        id: "admin_new_request",
        name: "Notification admin - Nouvelle demande",
        description: "Email envoyé aux administrateurs lors d'une nouvelle demande",
        category: "system",
        enabled: true,
        template: this.getDefaultTemplates().admin_new_request,
        variables: [
          {
            key: "requestTitle",
            name: "Titre de la demande",
            description: "Titre de la demande",
            example: "Réparation lave-linge",
            required: true,
          },
          {
            key: "requestCategory",
            name: "Catégorie",
            description: "Catégorie de la demande",
            example: "Électroménager",
            required: true,
          },
          {
            key: "clientName",
            name: "Nom du client",
            description: "Nom du client",
            example: "Jean Dupont",
            required: true,
          },
          {
            key: "requestUrgency",
            name: "Urgence",
            description: "Niveau d'urgence",
            example: "Urgent",
            required: true,
          },
          { key: "requestBudget", name: "Budget", description: "Budget prévu", example: "100-200€", required: true },
          {
            key: "requestLocation",
            name: "Localisation",
            description: "Ville et code postal",
            example: "Paris (75001)",
            required: true,
          },
          {
            key: "requestDate",
            name: "Date de création",
            description: "Date et heure",
            example: "15/01/2024 14:30",
            required: true,
          },
        ],
      },
    ]
  }

  // Déclencher un événement email
  async triggerEvent(eventId: string, data: Record<string, any>): Promise<{ success: boolean; error?: string }> {
    const settings = this.loadSettings()

    // Vérifier si l'événement est activé
    if (!settings.events[eventId]) {
      console.log(`📧 Événement ${eventId} désactivé, email non envoyé`)
      return { success: true } // Pas d'erreur, juste désactivé
    }

    const template = settings.templates[eventId]
    if (!template) {
      return { success: false, error: `Template ${eventId} introuvable` }
    }

    try {
      // Préparer les variables globales
      const globalVariables = {
        ...data,
        platformUrl: typeof window !== "undefined" ? window.location.origin : "https://fixeopro.com",
        footerText: settings.globalSettings.footerText,
        unsubscribeUrl: this.replaceVariables(settings.globalSettings.unsubscribeUrl, data),
        logoUrl: this.replaceVariables(settings.globalSettings.logoUrl, data),
      }

      // Remplacer les variables dans le template
      const emailData = {
        to: data.email || data.userEmail || data.clientEmail,
        from: `${settings.globalSettings.fromName} <${settings.globalSettings.fromEmail}>`,
        replyTo: settings.globalSettings.replyTo,
        subject: this.replaceVariables(template.subject, globalVariables),
        html: this.replaceVariables(template.htmlContent, globalVariables),
        text: this.replaceVariables(template.textContent, globalVariables),
      }

      // Envoyer l'email via le service d'email
      const { emailService } = await import("./email-service")
      const result = await emailService.sendRealEmail(emailData, emailService.loadConfig())

      console.log(`📧 Événement ${eventId} déclenché:`, result.success ? "✅ Succès" : "❌ Échec")
      return result
    } catch (error) {
      console.error(`❌ Erreur lors du déclenchement de l'événement ${eventId}:`, error)
      return { success: false, error: error instanceof Error ? error.message : "Erreur inconnue" }
    }
  }

  // Remplacer les variables dans un texte
  private replaceVariables(template: string, variables: Record<string, any>): string {
    let result = template

    // Remplacer les variables simples {{variable}}
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, "g")
      result = result.replace(regex, value || "")
    })

    // Gérer les conditions {{#if variable}}...{{/if}}
    result = result.replace(/{{#if\s+(\w+)}}(.*?){{\/if}}/gs, (match, variable, content) => {
      return variables[variable] ? content : ""
    })

    return result
  }

  // Tester un événement
  async testEvent(eventId: string, testEmail: string): Promise<{ success: boolean; error?: string }> {
    const events = this.getAvailableEvents()
    const event = events.find((e) => e.id === eventId)

    if (!event) {
      return { success: false, error: "Événement introuvable" }
    }

    // Données de test
    const testData: Record<string, any> = {
      email: testEmail,
      firstName: "Jean",
      lastName: "Dupont",
      phone: "06 12 34 56 78",
      city: "Paris",
      registrationDate: new Date().toLocaleString("fr-FR"),
      companyName: "RéparTech SARL",
      specialties: "Électroménager, Informatique",
      trialEndDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString("fr-FR"),
      clientName: "Jean Dupont",
      requestTitle: "Réparation lave-linge Samsung",
      requestCategory: "Électroménager",
      requestUrgency: "Urgent",
      requestBudget: "100-200€",
      requestLocation: "Paris (75001)",
      requestDate: new Date().toLocaleString("fr-FR"),
      requestId: "req_test_123456",
      userType: "Client",
      userName: "Jean Dupont",
      userEmail: testEmail,
      userPhone: "06 12 34 56 78",
      userCity: "Paris",
    }

    return await this.triggerEvent(eventId, testData)
  }
}

export const emailAutomationService = new EmailAutomationService()
