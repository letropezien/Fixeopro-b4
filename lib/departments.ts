export interface Department {
  code: string
  name: string
  region: string
}

export const FRENCH_DEPARTMENTS: Department[] = [
  { code: "01", name: "Ain", region: "Auvergne-Rhône-Alpes" },
  { code: "02", name: "Aisne", region: "Hauts-de-France" },
  { code: "03", name: "Allier", region: "Auvergne-Rhône-Alpes" },
  { code: "04", name: "Alpes-de-Haute-Provence", region: "Provence-Alpes-Côte d'Azur" },
  { code: "05", name: "Hautes-Alpes", region: "Provence-Alpes-Côte d'Azur" },
  { code: "06", name: "Alpes-Maritimes", region: "Provence-Alpes-Côte d'Azur" },
  { code: "07", name: "Ardèche", region: "Auvergne-Rhône-Alpes" },
  { code: "08", name: "Ardennes", region: "Grand Est" },
  { code: "09", name: "Ariège", region: "Occitanie" },
  { code: "10", name: "Aube", region: "Grand Est" },
  { code: "11", name: "Aude", region: "Occitanie" },
  { code: "12", name: "Aveyron", region: "Occitanie" },
  { code: "13", name: "Bouches-du-Rhône", region: "Provence-Alpes-Côte d'Azur" },
  { code: "14", name: "Calvados", region: "Normandie" },
  { code: "15", name: "Cantal", region: "Auvergne-Rhône-Alpes" },
  { code: "16", name: "Charente", region: "Nouvelle-Aquitaine" },
  { code: "17", name: "Charente-Maritime", region: "Nouvelle-Aquitaine" },
  { code: "18", name: "Cher", region: "Centre-Val de Loire" },
  { code: "19", name: "Corrèze", region: "Nouvelle-Aquitaine" },
  { code: "21", name: "Côte-d'Or", region: "Bourgogne-Franche-Comté" },
  { code: "22", name: "Côtes-d'Armor", region: "Bretagne" },
  { code: "23", name: "Creuse", region: "Nouvelle-Aquitaine" },
  { code: "24", name: "Dordogne", region: "Nouvelle-Aquitaine" },
  { code: "25", name: "Doubs", region: "Bourgogne-Franche-Comté" },
  { code: "26", name: "Drôme", region: "Auvergne-Rhône-Alpes" },
  { code: "27", name: "Eure", region: "Normandie" },
  { code: "28", name: "Eure-et-Loir", region: "Centre-Val de Loire" },
  { code: "29", name: "Finistère", region: "Bretagne" },
  { code: "30", name: "Gard", region: "Occitanie" },
  { code: "31", name: "Haute-Garonne", region: "Occitanie" },
  { code: "32", name: "Gers", region: "Occitanie" },
  { code: "33", name: "Gironde", region: "Nouvelle-Aquitaine" },
  { code: "34", name: "Hérault", region: "Occitanie" },
  { code: "35", name: "Ille-et-Vilaine", region: "Bretagne" },
  { code: "36", name: "Indre", region: "Centre-Val de Loire" },
  { code: "37", name: "Indre-et-Loire", region: "Centre-Val de Loire" },
  { code: "38", name: "Isère", region: "Auvergne-Rhône-Alpes" },
  { code: "39", name: "Jura", region: "Bourgogne-Franche-Comté" },
  { code: "40", name: "Landes", region: "Nouvelle-Aquitaine" },
  { code: "41", name: "Loir-et-Cher", region: "Centre-Val de Loire" },
  { code: "42", name: "Loire", region: "Auvergne-Rhône-Alpes" },
  { code: "43", name: "Haute-Loire", region: "Auvergne-Rhône-Alpes" },
  { code: "44", name: "Loire-Atlantique", region: "Pays de la Loire" },
  { code: "45", name: "Loiret", region: "Centre-Val de Loire" },
  { code: "46", name: "Lot", region: "Occitanie" },
  { code: "47", name: "Lot-et-Garonne", region: "Nouvelle-Aquitaine" },
  { code: "48", name: "Lozère", region: "Occitanie" },
  { code: "49", name: "Maine-et-Loire", region: "Pays de la Loire" },
  { code: "50", name: "Manche", region: "Normandie" },
  { code: "51", name: "Marne", region: "Grand Est" },
  { code: "52", name: "Haute-Marne", region: "Grand Est" },
  { code: "53", name: "Mayenne", region: "Pays de la Loire" },
  { code: "54", name: "Meurthe-et-Moselle", region: "Grand Est" },
  { code: "55", name: "Meuse", region: "Grand Est" },
  { code: "56", name: "Morbihan", region: "Bretagne" },
  { code: "57", name: "Moselle", region: "Grand Est" },
  { code: "58", name: "Nièvre", region: "Bourgogne-Franche-Comté" },
  { code: "59", name: "Nord", region: "Hauts-de-France" },
  { code: "60", name: "Oise", region: "Hauts-de-France" },
  { code: "61", name: "Orne", region: "Normandie" },
  { code: "62", name: "Pas-de-Calais", region: "Hauts-de-France" },
  { code: "63", name: "Puy-de-Dôme", region: "Auvergne-Rhône-Alpes" },
  { code: "64", name: "Pyrénées-Atlantiques", region: "Nouvelle-Aquitaine" },
  { code: "65", name: "Hautes-Pyrénées", region: "Occitanie" },
  { code: "66", name: "Pyrénées-Orientales", region: "Occitanie" },
  { code: "67", name: "Bas-Rhin", region: "Grand Est" },
  { code: "68", name: "Haut-Rhin", region: "Grand Est" },
  { code: "69", name: "Rhône", region: "Auvergne-Rhône-Alpes" },
  { code: "70", name: "Haute-Saône", region: "Bourgogne-Franche-Comté" },
  { code: "71", name: "Saône-et-Loire", region: "Bourgogne-Franche-Comté" },
  { code: "72", name: "Sarthe", region: "Pays de la Loire" },
  { code: "73", name: "Savoie", region: "Auvergne-Rhône-Alpes" },
  { code: "74", name: "Haute-Savoie", region: "Auvergne-Rhône-Alpes" },
  { code: "75", name: "Paris", region: "Île-de-France" },
  { code: "76", name: "Seine-Maritime", region: "Normandie" },
  { code: "77", name: "Seine-et-Marne", region: "Île-de-France" },
  { code: "78", name: "Yvelines", region: "Île-de-France" },
  { code: "79", name: "Deux-Sèvres", region: "Nouvelle-Aquitaine" },
  { code: "80", name: "Somme", region: "Hauts-de-France" },
  { code: "81", name: "Tarn", region: "Occitanie" },
  { code: "82", name: "Tarn-et-Garonne", region: "Occitanie" },
  { code: "83", name: "Var", region: "Provence-Alpes-Côte d'Azur" },
  { code: "84", name: "Vaucluse", region: "Provence-Alpes-Côte d'Azur" },
  { code: "85", name: "Vendée", region: "Pays de la Loire" },
  { code: "86", name: "Vienne", region: "Nouvelle-Aquitaine" },
  { code: "87", name: "Haute-Vienne", region: "Nouvelle-Aquitaine" },
  { code: "88", name: "Vosges", region: "Grand Est" },
  { code: "89", name: "Yonne", region: "Bourgogne-Franche-Comté" },
  { code: "90", name: "Territoire de Belfort", region: "Bourgogne-Franche-Comté" },
  { code: "91", name: "Essonne", region: "Île-de-France" },
  { code: "92", name: "Hauts-de-Seine", region: "Île-de-France" },
  { code: "93", name: "Seine-Saint-Denis", region: "Île-de-France" },
  { code: "94", name: "Val-de-Marne", region: "Île-de-France" },
  { code: "95", name: "Val-d'Oise", region: "Île-de-France" },
  // DOM-TOM
  { code: "971", name: "Guadeloupe", region: "Guadeloupe" },
  { code: "972", name: "Martinique", region: "Martinique" },
  { code: "973", name: "Guyane", region: "Guyane" },
  { code: "974", name: "La Réunion", region: "La Réunion" },
  { code: "976", name: "Mayotte", region: "Mayotte" },
]

export class DepartmentService {
  static getAllDepartments(): Department[] {
    return FRENCH_DEPARTMENTS
  }

  static getDepartmentByCode(code: string): Department | null {
    return FRENCH_DEPARTMENTS.find((dept) => dept.code === code) || null
  }

  static getDepartmentsByRegion(region: string): Department[] {
    return FRENCH_DEPARTMENTS.filter((dept) => dept.region === region)
  }

  static getAllRegions(): string[] {
    const regions = new Set(FRENCH_DEPARTMENTS.map((dept) => dept.region))
    return Array.from(regions).sort()
  }

  static getDepartmentFromPostalCode(postalCode: string): Department | null {
    if (!postalCode || postalCode.length < 2) return null

    let deptCode = postalCode.substring(0, 2)

    // Cas spéciaux
    if (postalCode.startsWith("20")) {
      // Corse
      if (postalCode.startsWith("200") || postalCode.startsWith("201")) {
        deptCode = "2A" // Corse-du-Sud
      } else {
        deptCode = "2B" // Haute-Corse
      }
    }

    return this.getDepartmentByCode(deptCode)
  }

  static formatDepartmentDisplay(department: Department): string {
    return `${department.code} - ${department.name}`
  }
}
