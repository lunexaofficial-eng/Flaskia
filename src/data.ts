/**
 * Developed by MOHAMMAD NURULLAH
 * The Founder of OMYRA TECHNOLOGIES
 * Contact email: contact@omyra.org
 * Secondary email: matrixgyan0786@gmail.com
 * OMYRA ECOSYSTEM URL: www.omyra.org
 */

export interface SDSSection {
  title: string;
  content: string[];
}

export interface Product {
  id: string;
  name: string;
  formula: string;
  grade: "ACS Reagent" | "USP Grade" | "Technical" | "Educational Grade" | "AR Grade";
  cas: string;
  purity: string;
  description: string;
  price: number;
  unit: string;
  stock: number;
  category: string;
  image: string;
  videoUrl?: string;
  galleryUrls?: string[];
  physicalState: string;
  boilingPoint?: string;
  sdsUrl?: string;
  meltingPoint?: string;
  molecularWeight: string;
  ghsPictograms: (
    | "corrosive"
    | "toxic"
    | "irritant"
    | "environment"
    | "flammable"
    | "safe"
  )[];
  nfpa: {
    health: number;
    flammability: number;
    instability: number;
    special?: string;
  };
  sds: {
    hazardStatements: string[];
    precautionaryStatements: string[];
    sections: SDSSection[];
  };
}

export const PRODUCTS: Product[] = [
  {
    id: "copper-sulfate",
    name: "Kupfer(II)-sulfat-Pentahydrat",
    formula: "CuSO4 · 5H2O",
    grade: "ACS Reagent",
    cas: "7758-99-8",
    purity: "≥99.0%",
    description:
      "Hochreines blaues Kristallsalz, weit verbreitet in der Ausbildung für Kristallzüchtungsexperimente, als analytisches Reagenz und im Chemieunterricht.",
    price: 34.5,
    unit: "500g",
    stock: 45,
    category: "Reagenzien",
    image:
      "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?auto=format&fit=crop&q=80&w=600",
    physicalState: "Blauer kristalliner Feststoff",
    meltingPoint: "110 °C (verliert Kristallwasser)",
    molecularWeight: "249.69 g/mol",
    ghsPictograms: ["environment", "irritant", "toxic"],
    nfpa: {
      health: 2,
      flammability: 0,
      instability: 0,
    },
    sds: {
      hazardStatements: [
        "H302: Gesundheitsschädlich bei Verschlucken.",
        "H315: Verursacht Hautreizungen.",
        "H319: Verursacht schwere Augenreizung.",
        "H410: Sehr giftig für Wasserorganismen mit langfristiger Wirkung.",
      ],
      precautionaryStatements: [
        "P264: Nach Gebrauch Haut gründlich waschen.",
        "P273: Freisetzung in die Umwelt vermeiden.",
        "P280: Schutzhandschuhe / Augenschutz / Gesichtsschutz tragen.",
        "P305+P351+P338: BEI KONTAKT MIT DEN AUGEN: Einige Minuten lang behutsam mit Wasser spülen.",
      ],
      sections: [
        {
          title: "Abschnitt 1: Bezeichnung des Stoffs",
          content: [
            "Produktname: Kupfer(II)-sulfat-Pentahydrat",
            "Empfohlene Verwendung: Laborchemikalie, analytisches Reagenz, Lehrdemonstration.",
            "Hersteller: Flaskia Supplies International Co.",
          ],
        },
        {
          title: "Abschnitt 4: Erste-Hilfe-Maßnahmen",
          content: [
            "Einatmen: Betroffene Person an die frische Luft bringen. Bei Atembeschwerden Arzt aufsuchen.",
            "Hautkontakt: Haut sofort mit viel Wasser und Seife abwaschen. Kontaminierte Kleidung entfernen.",
            "Augenkontakt: Augen mindestens 15 Minuten lang bei geöffnetem Lidspalt mit fließendem Wasser spülen. Augenarzt konsultieren.",
            "Verschlucken: Sofort ärztlichen Rat einholen. Einer bewusstlosen Person niemals etwas durch den Mund verabreichen.",
          ],
        },
        {
          title: "Abschnitt 7: Handhabung und Lagerung",
          content: [
            "Sichere Handhabung: Staub- und Aerosolbildung vermeiden. Nach Umgang mit chemischen Reagenzien Hände waschen.",
            "Lagerbedingungen: In einem dicht verschlossenen Behälter aufbewahren. An einem trockenen, kühlen und gut belüfteten Ort lagern.",
          ],
        },
        {
          title: "Abschnitt 8: Begrenzung und Überwachung der Exposition / PSA",
          content: [
            "Technische Schutzmaßnahmen: Für ausreichende Belüftung sorgen, insbesondere in geschlossenen Räumen.",
            "Augenschutz: Dicht schließende Schutzbrille (EN 166 / ANSI Z87.1 geprüft).",
            "Hautschutz: Nitrilhandschuhe (Mindeststärke 0,11 mm) und Standard-Laborkittel.",
            "Atemschutz: Bei wahrscheinlicher Staubentwicklung Staubmaske oder Partikelfilter tragen.",
          ],
        },
      ],
    },
  },
  {
    id: "citric-acid",
    name: "Zitronensäure-Monohydrat",
    formula: "C6H8O7 · H2O",
    grade: "USP Grade",
    cas: "5949-29-1",
    purity: "99.5% - 100.5%",
    description:
      "Hochreine organische Säure, geeignet für Pufferformulierungen, Neutralisationen, Reinigung und chemische Standardisierung. Ideal für Säure-Base-Titrationen im Labor.",
    price: 18.2,
    unit: "1kg",
    stock: 120,
    category: "Pufferlösungen",
    image:
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600",
    physicalState: "Weißes kristallines Pulver",
    meltingPoint: "135 °C",
    molecularWeight: "210.14 g/mol",
    ghsPictograms: ["irritant"],
    nfpa: {
      health: 1,
      flammability: 1,
      instability: 0,
    },
    sds: {
      hazardStatements: [
        "H319: Verursacht schwere Augenreizung.",
        "H315: Verursacht Hautreizungen.",
      ],
      precautionaryStatements: [
        "P280: Schutzhandschuhe und Augenschutz tragen.",
        "P305+P351+P338: BEI KONTAKT MIT DEN AUGEN: Einige Minuten lang behutsam mit Wasser spülen.",
      ],
      sections: [
        {
          title: "Abschnitt 1: Bezeichnung des Stoffs",
          content: [
            "Produktname: Zitronensäure-Monohydrat",
            "Empfohlene Verwendung: Laborpuffersubstanz, Wirkstoff, analytisches Reagenz.",
          ],
        },
        {
          title: "Abschnitt 4: Erste-Hilfe-Maßnahmen",
          content: [
            "Einatmen: Für Frischluft sorgen. Bei anhaltendem Husten oder Reizung Arzt aufsuchen.",
            "Hautkontakt: Haut mit kühlem Wasser abspülen.",
            "Augenkontakt: Augen gründlich mit Wasser ausspülen. Bei anhaltenden Beschwerden Arzt aufsuchen.",
          ],
        },
        {
          title: "Abschnitt 7: Handhabung und Lagerung",
          content: [
            "Lagerung: Trocken und kühl lagern. Wasserlöslich, vor Feuchtigkeit und Nässe schützen.",
          ],
        },
        {
          title: "Abschnitt 8: Begrenzung und Überwachung der Exposition / PSA",
          content: [
            "Standard-Schutzbrille mit Seitenschutz tragen. Im Laborumfeld werden Nitrilhandschuhe empfohlen.",
          ],
        },
      ],
    },
  },
  {
    id: "sodium-bicarbonate",
    name: "Natriumhydrogencarbonat",
    formula: "NaHCO3",
    grade: "ACS Reagent",
    cas: "144-55-8",
    purity: "≥99.7%",
    description:
      "Erstklassiges Säureneutralisationsmittel, Pufferreagenz und sichere Reaktionsbasis. Unverzichtbar für Labordemonstrationen und pH-Kalibrierung.",
    price: 14.8,
    unit: "1kg",
    stock: 85,
    category: "Pufferlösungen",
    image:
      "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&q=80&w=600",
    physicalState: "Weißes kristallines Pulver",
    meltingPoint: "270 °C (Zersetzung)",
    molecularWeight: "84.01 g/mol",
    ghsPictograms: ["safe"],
    nfpa: {
      health: 0,
      flammability: 0,
      instability: 0,
    },
    sds: {
      hazardStatements: [
        "Kein gefährlicher Stoff gemäß GHS-Richtlinien.",
      ],
      precautionaryStatements: [
        "P262: Nicht in die Augen gelangen lassen.",
        "P281: Vorgeschriebene persönliche Schutzausrüstung verwenden.",
      ],
      sections: [
        {
          title: "Abschnitt 1: Bezeichnung des Stoffs",
          content: [
            "Produktname: Natriumhydrogencarbonat",
            "Empfohlene Verwendung: Puffersubstanz, Neutralisationsmittel, Laborreaktant.",
          ],
        },
        {
          title: "Abschnitt 4: Erste-Hilfe-Maßnahmen",
          content: [
            "Einatmen: Nach übermäßigem Einatmen von Staub an die frische Luft bringen.",
            "Augenkontakt: Mit reichlich Wasser auswaschen.",
          ],
        },
        {
          title: "Abschnitt 7: Handhabung und Lagerung",
          content: [
            "Lagerbedingungen: Vor Feuchtigkeit schützen. In trockener Atmosphäre getrennt von starken Säuren aufbewahren.",
          ],
        },
      ],
    },
  },
  {
    id: "methyl-orange",
    name: "Methylorange-Indikatorlösung 0,1%",
    formula: "C14H14N3NaO3S",
    grade: "ACS Reagent",
    cas: "547-58-0",
    purity: "0,1% wässrige Lösung",
    description:
      "Klassischer pH-Indikator. Farbumschlag von Rot (pH 3,1) nach Gelb (pH 4,4) zur präzisen Überwachung von Säure-Base-Titrationen in Analytik und Ausbildung.",
    price: 22.0,
    unit: "125mL",
    stock: 38,
    category: "Indikatoren",
    image:
      "https://images.unsplash.com/photo-1617155093730-a8bf47be792d?auto=format&fit=crop&q=80&w=600",
    physicalState: "Orangefarbene Flüssigkeit, geruchlos",
    boilingPoint: "ca. 100 °C",
    molecularWeight: "327.33 g/mol",
    ghsPictograms: ["toxic", "irritant"],
    nfpa: {
      health: 2,
      flammability: 0,
      instability: 0,
    },
    sds: {
      hazardStatements: [
        "H301: Giftig bei Verschlucken.",
        "H317: Kann allergische Hautreaktionen verursachen.",
      ],
      precautionaryStatements: [
        "P261: Einatmen von Dampf oder Aerosol vermeiden.",
        "P280: Schutzhandschuhe und Schutzbrille tragen.",
        "P301+P310: BEI VERSCHLUCKEN: Sofort GIFTINFORMATIONSZENTRUM oder Arzt anrufen.",
      ],
      sections: [
        {
          title: "Abschnitt 1: Bezeichnung des Stoffs",
          content: [
            "Produktname: Methylorange 0,1% wässrige Lösung",
            "Empfohlene Verwendung: Laborindikator für pH-Übergangstitrationen.",
          ],
        },
        {
          title: "Abschnitt 4: Erste-Hilfe-Maßnahmen",
          content: [
            "Verschlucken: Vergiftungsgefahr! Sofort Giftnotrufzentrale anrufen. Bei Bewusstsein Mund gründlich mit Wasser ausspülen.",
            "Hautkontakt: Sofort mit milder Seife und Wasser abwaschen.",
          ],
        },
      ],
    },
  },
  {
    id: "borosilicate-beaker-set",
    name: "Borosilikatglas-Becherglas-Set (5-teilig)",
    formula: "SiO2 / B2O3 Glas",
    grade: "ACS Reagent",
    cas: "65997-17-3",
    purity: "Klasse A Borosilikat GG-17",
    description:
      "Robustes Becherglas-Set in Laborqualität, bestehend aus 50 mL, 100 mL, 250 mL, 500 mL und 1000 mL Bechergläsern mit doppelter Graduierung und Ausguss.",
    price: 39.9,
    unit: "1 Set",
    stock: 55,
    category: "Glaswaren",
    image:
      "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=600",
    physicalState: "Transparentes hitzebeständiges Glas",
    meltingPoint: "820 °C (Erweichungspunkt)",
    molecularWeight: "N/A",
    ghsPictograms: ["safe"],
    nfpa: {
      health: 0,
      flammability: 0,
      instability: 0,
    },
    sds: {
      hazardStatements: [
        "Kein gefährliches Erzeugnis. Physikalische Gefahr bei Bruch (Schnittgefahr durch scharfes Glas).",
      ],
      precautionaryStatements: [
        "P280: Beim Umgang mit angeschlagenem oder zerbrochenem Glas Schutzhandschuhe tragen.",
        "P233: Vor extremen mechanischen Stößen schützen.",
      ],
      sections: [
        {
          title: "Abschnitt 1: Sicherheitsrichtlinien für Glaswaren",
          content: [
            "Material: Borosilikatglas (hohe Temperaturbeständigkeit, niedriger Wärmeausdehnungskoeffizient).",
            "Physikalische Gefahr: Vorsicht vor plötzlichen Temperaturschocks über 150 °C Temperaturdifferenz.",
          ],
        },
        {
          title: "Abschnitt 4: Erste Hilfe bei Glasbruch",
          content: [
            "Stich-/Schnittwunden: Sofort mit Wasser und Seife reinigen. Mit sterilem Verband abdecken und Erste Hilfe leisten.",
          ],
        },
      ],
    },
  },
  {
    id: "distilled-water",
    name: "Deionisiertes / Destilliertes Reinwasser",
    formula: "H2O",
    grade: "ACS Reagent",
    cas: "7732-18-5",
    purity: "Reinstwasser spezifischer Widerstand ≥18 MΩ·cm",
    description:
      "Hochgradig demineralisiertes Reinstwasser für analytische Verdünnungen, HPLC-Eluentenherstellung, Medienrekonstitution und allgemeines Labor-Spülen.",
    price: 12.0,
    unit: "4L (1 Gal)",
    stock: 200,
    category: "Pufferlösungen",
    image:
      "https://images.unsplash.com/photo-1495556650867-99238382b61a?auto=format&fit=crop&q=80&w=600",
    physicalState: "Klare farblose Flüssigkeit",
    boilingPoint: "100 °C",
    meltingPoint: "0 °C",
    molecularWeight: "18.015 g/mol",
    ghsPictograms: ["safe"],
    nfpa: {
      health: 0,
      flammability: 0,
      instability: 0,
    },
    sds: {
      hazardStatements: ["Kein gefährlicher Stoff oder Gemisch."],
      precautionaryStatements: [
        "Keine besonderen Vorsichtsmaßnahmen erforderlich. Saubere Laborpraxis einhalten.",
      ],
      sections: [
        {
          title: "Abschnitt 1: Angaben zur Zusammensetzung",
          content: [
            "Bestandteil: Destilliertes Wasser 100%. Frei von organischen, ionischen, partikulären und biologischen Bestandteilen.",
          ],
        },
        {
          title: "Abschnitt 4: Erste-Hilfe-Maßnahmen",
          content: [
            "Keine schädlichen Symptome zu erwarten. Verschüttete Flüssigkeit sofort aufwischen, um Rutschgefahr zu vermeiden.",
          ],
        },
      ],
    },
  },
];
