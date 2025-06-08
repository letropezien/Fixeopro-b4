export interface ValidationError {
  field: string
  message: string
}

export function validateRepairRequest(formData: any): ValidationError[] {
  const errors: ValidationError[] = []

  // Validation catégorie
  if (!formData.category) {
    errors.push({ field: "category", message: "Veuillez sélectionner une catégorie" })
  }

  // Validation urgence
  if (!formData.urgency) {
    errors.push({ field: "urgency", message: "Veuillez sélectionner un niveau d'urgence" })
  }

  // Validation description
  if (!formData.description?.trim()) {
    errors.push({ field: "description", message: "Veuillez décrire votre problème" })
  } else if (formData.description.trim().length < 10) {
    errors.push({ field: "description", message: "La description doit contenir au moins 10 caractères" })
  }

  // Validation localisation
  if (!formData.contact?.city?.trim()) {
    errors.push({ field: "city", message: "Veuillez indiquer votre ville" })
  }

  if (!formData.contact?.postalCode?.trim()) {
    errors.push({ field: "postalCode", message: "Veuillez indiquer votre code postal" })
  } else if (!/^\d{5}$/.test(formData.contact.postalCode.trim())) {
    errors.push({ field: "postalCode", message: "Le code postal doit contenir 5 chiffres" })
  }

  // Validation contact
  if (!formData.contact?.firstName?.trim()) {
    errors.push({ field: "firstName", message: "Veuillez indiquer votre prénom" })
  }

  if (!formData.contact?.lastName?.trim()) {
    errors.push({ field: "lastName", message: "Veuillez indiquer votre nom" })
  }

  if (!formData.contact?.email?.trim()) {
    errors.push({ field: "email", message: "Veuillez indiquer votre email" })
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact.email.trim())) {
    errors.push({ field: "email", message: "Veuillez indiquer un email valide" })
  }

  if (!formData.contact?.phone?.trim()) {
    errors.push({ field: "phone", message: "Veuillez indiquer votre téléphone" })
  } else if (!/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/.test(formData.contact.phone.trim())) {
    errors.push({ field: "phone", message: "Veuillez indiquer un numéro de téléphone français valide" })
  }

  return errors
}

export function validateRepairerRegistration(formData: any): ValidationError[] {
  const errors: ValidationError[] = []

  // Validation informations personnelles
  if (!formData.personal?.firstName?.trim()) {
    errors.push({ field: "firstName", message: "Veuillez indiquer votre prénom" })
  }

  if (!formData.personal?.lastName?.trim()) {
    errors.push({ field: "lastName", message: "Veuillez indiquer votre nom" })
  }

  if (!formData.personal?.email?.trim()) {
    errors.push({ field: "email", message: "Veuillez indiquer votre email" })
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.personal.email.trim())) {
    errors.push({ field: "email", message: "Veuillez indiquer un email valide" })
  }

  if (!formData.personal?.phone?.trim()) {
    errors.push({ field: "phone", message: "Veuillez indiquer votre téléphone" })
  }

  // Validation informations professionnelles
  if (!formData.professional?.experience) {
    errors.push({ field: "experience", message: "Veuillez indiquer votre expérience" })
  }

  if (!formData.professional?.specialties?.length) {
    errors.push({ field: "specialties", message: "Veuillez sélectionner au moins une spécialité" })
  }

  if (!formData.professional?.description?.trim()) {
    errors.push({ field: "description", message: "Veuillez décrire votre activité" })
  } else if (formData.professional.description.trim().length < 50) {
    errors.push({ field: "description", message: "La description doit contenir au moins 50 caractères" })
  }

  return errors
}
