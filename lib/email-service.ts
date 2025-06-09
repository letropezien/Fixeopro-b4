// Service d'envoi d'emails pour FixeoPro
export interface EmailConfig {
  provider: "smtp" | "sendgrid" | "mailgun" | "resend"
  smtpHost?: string
  smtpPort?: number
  smtpUser?: string
  smtpPassword?: string
  apiKey?: string
  fromEmail: string
  fromName: string
  isEnabled: boolean
  testMode: boolean
}

export interface EmailTemplate {
  id: string
  name: string
  subject: string
  htmlContent: string
  textContent: string
  variables: string[]
}

export interface ContactEmail {
  id: string
  requestId: string
  repairerId: string
  clientEmail: string
  subject: string
  message: string
  repairer: {
    name: string
    email: string
    phone?: string
    company?: string
  }
  sentAt: string
  status: "pending" | "sent" | "failed"
  errorMessage?: string
}

class EmailService {
  private config: EmailConfig | null = null

  // Charger la configuration depuis localStorage
  loadConfig(): EmailConfig {
    if (typeof window === "undefined") {
      return this.getDefaultConfig()
    }

    try {
      const saved = localStorage.getItem("fixeopro_email_config")
      if (saved) {
        this.config = JSON.parse(saved)
        return this.config!
      }
    } catch (error) {
      console.error("Erreur lors du chargement de la config email:", error)
    }

    return this.getDefaultConfig()
  }

  // Sauvegarder la configuration
  saveConfig(config: EmailConfig): void {
    if (typeof window === "undefined") return

    try {
      this.config = config
      localStorage.setItem("fixeopro_email_config", JSON.stringify(config))
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de la config email:", error)
    }
  }

  // Configuration par défaut
  private getDefaultConfig(): EmailConfig {
    return {
      provider: "smtp",
      smtpHost: "smtp.gmail.com",
      smtpPort: 587,
      smtpUser: "",
      smtpPassword: "",
      fromEmail: "noreply@fixeopro.com",
      fromName: "FixeoPro",
      isEnabled: false,
      testMode: true,
    }
  }

  // Obtenir les templates d'emails
  getTemplates(): EmailTemplate[] {
    return [
      {
        id: "contact_client",
        name: "Contact client par réparateur",
        subject: "Nouveau message d'un réparateur - {{requestTitle}}",
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #2563eb; margin: 0;">Nouveau message de réparateur</h2>
              <p style="margin: 10px 0 0 0; color: #6b7280;">Concernant votre demande de dépannage</p>
            </div>
            
            <div style="background: white; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #374151; margin-top: 0;">Votre demande : {{requestTitle}}</h3>
              <p style="color: #6b7280; margin: 5px 0;"><strong>Catégorie :</strong> {{requestCategory}}</p>
              <p style="color: #6b7280; margin: 5px 0;"><strong>Localisation :</strong> {{requestLocation}}</p>
            </div>

            <div style="background: white; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #374151; margin-top: 0;">Message du réparateur</h3>
              <div style="background: #f9fafb; padding: 15px; border-radius: 6px; border-left: 4px solid #2563eb;">
                <p style="margin: 0; color: #374151; line-height: 1.6;">{{message}}</p>
              </div>
            </div>

            <div style="background: white; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #374151; margin-top: 0;">Informations du réparateur</h3>
              <p style="margin: 5px 0; color: #374151;"><strong>Nom :</strong> {{repairerName}}</p>
              <p style="margin: 5px 0; color: #374151;"><strong>Email :</strong> {{repairerEmail}}</p>
              {{#if repairerPhone}}<p style="margin: 5px 0; color: #374151;"><strong>Téléphone :</strong> {{repairerPhone}}</p>{{/if}}
              {{#if repairerCompany}}<p style="margin: 5px 0; color: #374151;"><strong>Entreprise :</strong> {{repairerCompany}}</p>{{/if}}
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="{{platformUrl}}/demande/{{requestId}}" 
                 style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Voir ma demande sur FixeoPro
              </a>
            </div>

            <div style="background: #f9fafb; padding: 15px; border-radius: 6px; text-align: center; margin-top: 30px;">
              <p style="margin: 0; color: #6b7280; font-size: 14px;">
                Cet email a été envoyé via la plateforme FixeoPro.<br>
                Si vous ne souhaitez plus recevoir ces notifications, 
                <a href="{{unsubscribeUrl}}" style="color: #2563eb;">cliquez ici</a>.
              </p>
            </div>
          </div>
        `,
        textContent: `
Nouveau message d'un réparateur

Votre demande : {{requestTitle}}
Catégorie : {{requestCategory}}
Localisation : {{requestLocation}}

Message du réparateur :
{{message}}

Informations du réparateur :
Nom : {{repairerName}}
Email : {{repairerEmail}}
{{#if repairerPhone}}Téléphone : {{repairerPhone}}{{/if}}
{{#if repairerCompany}}Entreprise : {{repairerCompany}}{{/if}}

Voir votre demande : {{platformUrl}}/demande/{{requestId}}

---
Cet email a été envoyé via FixeoPro.
        `,
        variables: [
          "requestTitle",
          "requestCategory",
          "requestLocation",
          "requestId",
          "message",
          "repairerName",
          "repairerEmail",
          "repairerPhone",
          "repairerCompany",
          "platformUrl",
          "unsubscribeUrl",
        ],
      },
      {
        id: "test_email",
        name: "Email de test",
        subject: "Test de configuration email - FixeoPro",
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #10b981; color: white; padding: 20px; border-radius: 8px; text-align: center;">
              <h2 style="margin: 0;">✅ Test de configuration réussi !</h2>
            </div>
            
            <div style="padding: 20px; background: white; border: 1px solid #e5e7eb; border-radius: 8px; margin-top: 20px;">
              <p>Félicitations ! Votre configuration email fonctionne correctement.</p>
              <p><strong>Heure du test :</strong> {{testTime}}</p>
              <p><strong>Configuration :</strong> {{provider}}</p>
              <p><strong>Serveur :</strong> {{server}}</p>
            </div>

            <div style="background: #f9fafb; padding: 15px; border-radius: 6px; text-align: center; margin-top: 20px;">
              <p style="margin: 0; color: #6b7280; font-size: 14px;">
                Email de test envoyé depuis l'interface d'administration FixeoPro
              </p>
            </div>
          </div>
        `,
        textContent: `
✅ Test de configuration réussi !

Félicitations ! Votre configuration email fonctionne correctement.

Heure du test : {{testTime}}
Configuration : {{provider}}
Serveur : {{server}}

---
Email de test envoyé depuis l'interface d'administration FixeoPro
        `,
        variables: ["testTime", "provider", "server"],
      },
    ]
  }

  // Remplacer les variables dans un template
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

  // Envoyer un email de contact
  async sendContactEmail(contactData: {
    requestId: string
    repairerId: string
    clientEmail: string
    message: string
    repairer: {
      name: string
      email: string
      phone?: string
      company?: string
    }
    request: {
      title: string
      category: string
      city: string
      postalCode: string
    }
  }): Promise<{ success: boolean; error?: string; emailId?: string }> {
    const config = this.loadConfig()

    if (!config.isEnabled) {
      return { success: false, error: "Service d'email désactivé" }
    }

    const template = this.getTemplates().find((t) => t.id === "contact_client")
    if (!template) {
      return { success: false, error: "Template email introuvable" }
    }

    const variables = {
      requestTitle: contactData.request.title,
      requestCategory: contactData.request.category,
      requestLocation: `${contactData.request.city} (${contactData.request.postalCode})`,
      requestId: contactData.requestId,
      message: contactData.message,
      repairerName: contactData.repairer.name,
      repairerEmail: contactData.repairer.email,
      repairerPhone: contactData.repairer.phone,
      repairerCompany: contactData.repairer.company,
      platformUrl: typeof window !== "undefined" ? window.location.origin : "https://fixeopro.com",
      unsubscribeUrl: `${typeof window !== "undefined" ? window.location.origin : "https://fixeopro.com"}/unsubscribe`,
    }

    const emailData = {
      to: contactData.clientEmail,
      from: `${config.fromName} <${config.fromEmail}>`,
      subject: this.replaceVariables(template.subject, variables),
      html: this.replaceVariables(template.htmlContent, variables),
      text: this.replaceVariables(template.textContent, variables),
    }

    // Créer l'enregistrement de l'email
    const emailRecord: ContactEmail = {
      id: `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      requestId: contactData.requestId,
      repairerId: contactData.repairerId,
      clientEmail: contactData.clientEmail,
      subject: emailData.subject,
      message: contactData.message,
      repairer: contactData.repairer,
      sentAt: new Date().toISOString(),
      status: "pending",
    }

    try {
      // Sauvegarder l'email en attente
      this.saveEmailRecord(emailRecord)

      // Simuler l'envoi (en production, utiliser un vrai service)
      if (config.testMode) {
        console.log("📧 EMAIL SIMULÉ:", emailData)
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Marquer comme envoyé
        emailRecord.status = "sent"
        this.saveEmailRecord(emailRecord)

        return { success: true, emailId: emailRecord.id }
      } else {
        // En production, utiliser le vrai service d'email
        const result = await this.sendRealEmail(emailData, config)
        emailRecord.status = result.success ? "sent" : "failed"
        if (!result.success) {
          emailRecord.errorMessage = result.error
        }
        this.saveEmailRecord(emailRecord)

        return result
      }
    } catch (error) {
      emailRecord.status = "failed"
      emailRecord.errorMessage = error instanceof Error ? error.message : "Erreur inconnue"
      this.saveEmailRecord(emailRecord)

      return { success: false, error: emailRecord.errorMessage }
    }
  }

  // Envoyer un email de test
  async sendTestEmail(testEmail: string): Promise<{ success: boolean; error?: string }> {
    const config = this.loadConfig()

    if (!config.isEnabled) {
      return { success: false, error: "Service d'email désactivé" }
    }

    const template = this.getTemplates().find((t) => t.id === "test_email")
    if (!template) {
      return { success: false, error: "Template de test introuvable" }
    }

    const variables = {
      testTime: new Date().toLocaleString("fr-FR"),
      provider: config.provider.toUpperCase(),
      server: config.smtpHost || "API",
    }

    const emailData = {
      to: testEmail,
      from: `${config.fromName} <${config.fromEmail}>`,
      subject: this.replaceVariables(template.subject, variables),
      html: this.replaceVariables(template.htmlContent, variables),
      text: this.replaceVariables(template.textContent, variables),
    }

    try {
      if (config.testMode) {
        console.log("📧 EMAIL DE TEST SIMULÉ:", emailData)
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return { success: true }
      } else {
        return await this.sendRealEmail(emailData, config)
      }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Erreur inconnue" }
    }
  }

  // Envoyer un vrai email (à implémenter selon le provider)
  private async sendRealEmail(
    emailData: any,
    config: EmailConfig,
  ): Promise<{ success: boolean; error?: string; emailId?: string }> {
    // En production, implémenter selon le provider choisi
    switch (config.provider) {
      case "smtp":
        // Utiliser nodemailer ou similar
        break
      case "sendgrid":
        // Utiliser l'API SendGrid
        break
      case "mailgun":
        // Utiliser l'API Mailgun
        break
      case "resend":
        // Utiliser l'API Resend
        break
    }

    // Pour le moment, simuler
    console.log("📧 EMAIL RÉEL (simulation):", emailData)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    return { success: true, emailId: `real_${Date.now()}` }
  }

  // Sauvegarder un enregistrement d'email
  private saveEmailRecord(email: ContactEmail): void {
    if (typeof window === "undefined") return

    try {
      const emails = this.getEmailHistory()
      const existingIndex = emails.findIndex((e) => e.id === email.id)

      if (existingIndex >= 0) {
        emails[existingIndex] = email
      } else {
        emails.push(email)
      }

      localStorage.setItem("fixeopro_email_history", JSON.stringify(emails))
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de l'email:", error)
    }
  }

  // Obtenir l'historique des emails
  getEmailHistory(): ContactEmail[] {
    if (typeof window === "undefined") return []

    try {
      const saved = localStorage.getItem("fixeopro_email_history")
      return saved ? JSON.parse(saved) : []
    } catch (error) {
      console.error("Erreur lors du chargement de l'historique:", error)
      return []
    }
  }

  // Tester la configuration
  async testConfiguration(): Promise<{ success: boolean; error?: string }> {
    const config = this.loadConfig()

    if (!config.isEnabled) {
      return { success: false, error: "Service d'email désactivé" }
    }

    try {
      // Simuler un test de connexion
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (config.testMode) {
        return { success: true }
      }

      // En production, tester la vraie connexion
      return { success: true }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Erreur de connexion" }
    }
  }
}

export const emailService = new EmailService()
