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
    name: "Copper(II) Sulfate Pentahydrate",
    formula: "CuSO4 · 5H2O",
    grade: "ACS Reagent",
    cas: "7758-99-8",
    purity: "≥99.0%",
    description:
      "High-purity blue crystalline salt widely used in education for crystal growing experiments, as an analytical reagent, and in school laboratory chemistry curriculum.",
    price: 34.5,
    unit: "500g",
    stock: 45,
    category: "Reagents",
    image:
      "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?auto=format&fit=crop&q=80&w=600",
    physicalState: "Blue crystalline solid",
    meltingPoint: "110 °C (loses water of hydration)",
    molecularWeight: "249.69 g/mol",
    ghsPictograms: ["environment", "irritant", "toxic"],
    nfpa: {
      health: 2,
      flammability: 0,
      instability: 0,
    },
    sds: {
      hazardStatements: [
        "H302: Harmful if swallowed.",
        "H315: Causes skin irritation.",
        "H319: Causes serious eye irritation.",
        "H410: Very toxic to aquatic life with long lasting effects.",
      ],
      precautionaryStatements: [
        "P264: Wash skin thoroughly after handling.",
        "P273: Avoid release to the environment.",
        "P280: Wear protective gloves / eye protection / face protection.",
        "P305+P351+P338: IF IN EYES: Rinse cautiously with water for several minutes.",
      ],
      sections: [
        {
          title: "Section 1: Identification",
          content: [
            "Product Name: Copper(II) Sulfate Pentahydrate",
            "Recommended Use: Laboratory chemical, analytical reagent, educational demonstration.",
            "Manufacturer: Flaskia Supplies International Co.",
          ],
        },
        {
          title: "Section 4: First-Aid Measures",
          content: [
            "Inhalation: Move subject to fresh air. Seek medical attention if breathing is difficult.",
            "Skin Contact: Immediately flush skin with plenty of soap and water. Remove contaminated clothing.",
            "Eye Contact: Flush eyes with warm running water for at least 15 minutes, holding eyelids open. Consult an ophthalmologist.",
            "Ingestion: Induce vomiting immediately as directed by medical personnel. Never give anything by mouth to an unconscious person.",
          ],
        },
        {
          title: "Section 7: Handling and Storage",
          content: [
            "Safe Handling: Avoid formation of dust and aerosols. Wash hands after handling chemical reagents.",
            "Storage Conditions: Store in a tightly closed container. Keep in a dry, cool, well-ventilated location, remote from incompatible bases.",
          ],
        },
        {
          title: "Section 8: Exposure Controls & PPE",
          content: [
            "Engineering Controls: Ensure adequate ventilation, especially in confined areas.",
            "Eye Protection: Tight-fitting safety goggles (ANSI Z87.1 approved).",
            "Skin Protection: Nitrile gloves (minimum thickness 0.11 mm) and standard laboratory white coat.",
            "Respiratory Protection: Wear dust mask or particulate respirator when dust generation is likely.",
          ],
        },
      ],
    },
  },
  {
    id: "citric-acid",
    name: "Citric Acid Monohydrate",
    formula: "C6H8O7 · H2O",
    grade: "USP Grade",
    cas: "5949-29-1",
    purity: "99.5% - 100.5%",
    description:
      "Highly pure organic acid suitable for food formulations, neutralizations, cleaning, and chemical standardizing. Great for school laboratory acid-base titrations.",
    price: 18.2,
    unit: "1kg",
    stock: 120,
    category: "Buffers",
    image:
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600",
    physicalState: "White crystalline powder",
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
        "H319: Causes serious eye irritation.",
        "H315: Causes skin irritation.",
      ],
      precautionaryStatements: [
        "P280: Wear protective gloves and eye protection.",
        "P305+P351+P338: IF IN EYES: Rinse cautiously with water for several minutes. Remove contact lenses if present.",
      ],
      sections: [
        {
          title: "Section 1: Identification",
          content: [
            "Product Name: Citric Acid Monohydrate",
            "Recommended Use: Food additive, active ingredient, laboratory buffer agent.",
          ],
        },
        {
          title: "Section 4: First-Aid Measures",
          content: [
            "Inhalation: Provide fresh air. If coughing or throat irritation persists, consult a physician.",
            "Skin Contact: Rinse skin with cool water. Soap can be used.",
            "Eye Contact: Flush eyes thoroughly with water. Seek medical evaluation if discomfort persists.",
          ],
        },
        {
          title: "Section 7: Handling and Storage",
          content: [
            "Storage: Keep in a dry, cool warehouse. Soluble in water, protect from moisture and humidity.",
          ],
        },
        {
          title: "Section 8: Exposure Controls & PPE",
          content: [
            "Wear standard safety glasses with side shields. Standard rubber or nitrile gloves are recommended inside the laboratory environment.",
          ],
        },
      ],
    },
  },
  {
    id: "sodium-bicarbonate",
    name: "Sodium Bicarbonate",
    formula: "NaHCO3",
    grade: "ACS Reagent",
    cas: "144-55-8",
    purity: "≥99.7%",
    description:
      "Premium acid-neutralizing agent, buffer reagent, and safe student reaction base. Vital for school volcano demonstrations and pH chemistry calibration.",
    price: 14.8,
    unit: "1kg",
    stock: 85,
    category: "Buffers",
    image:
      "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&q=80&w=600",
    physicalState: "White crystalline powder",
    meltingPoint: "270 °C (decomposes)",
    molecularWeight: "84.01 g/mol",
    ghsPictograms: ["safe"],
    nfpa: {
      health: 0,
      flammability: 0,
      instability: 0,
    },
    sds: {
      hazardStatements: [
        "Not a hazardous substance according to GHS guidelines.",
      ],
      precautionaryStatements: [
        "P262: Avoid contact with eyes.",
        "P281: Use personal protective equipment as required.",
      ],
      sections: [
        {
          title: "Section 1: Identification",
          content: [
            "Product Name: Sodium Bicarbonate",
            "Recommended Use: Buffer substance, neutralizer, baking component, laboratory reactant.",
          ],
        },
        {
          title: "Section 4: First-Aid Measures",
          content: [
            "Inhalation: In case of excessive dust inhalation, remove to fresh air.",
            "Eye Contact: Wash with plenty of water. Mild mechanical irritation may occur.",
          ],
        },
        {
          title: "Section 7: Handling and Storage",
          content: [
            "Storage Constraints: Protect from moisture. Keep in dry atmosphere away from strong acids.",
          ],
        },
      ],
    },
  },
  {
    id: "methyl-orange",
    name: "Methyl Orange Indicator Solution 0.1%",
    formula: "C14H14N3NaO3S",
    grade: "ACS Reagent",
    cas: "547-58-0",
    purity: "0.1% aqueous solution",
    description:
      "Classic pH indicator. Changes color from red (pH 3.1) to yellow (pH 4.4) for precise acid-base titration monitoring in analytical and educational settings.",
    price: 22.0,
    unit: "125mL",
    stock: 38,
    category: "Indicators",
    image:
      "https://images.unsplash.com/photo-1617155093730-a8bf47be792d?auto=format&fit=crop&q=80&w=600",
    physicalState: "Orange liquid, odorless",
    boilingPoint: "approx. 100 °C",
    molecularWeight: "327.33 g/mol",
    ghsPictograms: ["toxic", "irritant"],
    nfpa: {
      health: 2,
      flammability: 0,
      instability: 0,
    },
    sds: {
      hazardStatements: [
        "H301: Toxic if swallowed.",
        "H317: May cause an allergic skin reaction.",
      ],
      precautionaryStatements: [
        "P261: Avoid breathing vapor or spray.",
        "P280: Wear protective gloves and safety glasses.",
        "P301+P310: IF SWALLOWED: Immediately call a POISON CENTER or doctor/physician.",
      ],
      sections: [
        {
          title: "Section 1: Identification",
          content: [
            "Product Name: Methyl Orange 0.1% Aqueous Solution",
            "Recommended Use: Laboratory laboratory indicator for pH transition titration.",
          ],
        },
        {
          title: "Section 4: First-Aid Measures",
          content: [
            "Ingestion: Poison risk! Call poison center immediately. If conscious, rinse mouth thoroughly with water.",
            "Skin Exposure: Wash immediately with mild soap and water.",
          ],
        },
      ],
    },
  },
  {
    id: "borosilicate-beaker-set",
    name: "Borosilicate Glass Beaker Set (5 Pieces)",
    formula: "SiO2 / B2O3 Glass",
    grade: "ACS Reagent",
    cas: "65997-17-3",
    purity: "Class A Borosilicate GG-17",
    description:
      "Heavy-duty lab laboratory grade glassware beaker set including 50mL, 100mL, 250mL, 500mL, and 1000mL beakers with double graduations and spouts.",
    price: 39.9,
    unit: "1 Set",
    stock: 55,
    category: "Glassware",
    image:
      "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=600",
    physicalState: "Transparent heat-resistant glass",
    meltingPoint: "820 °C (softening point)",
    molecularWeight: "N/A",
    ghsPictograms: ["safe"],
    nfpa: {
      health: 0,
      flammability: 0,
      instability: 0,
    },
    sds: {
      hazardStatements: [
        "Non-hazardous article. Physical hazard if broken (sharp glass puncture hazard).",
      ],
      precautionaryStatements: [
        "P280: Wear leather gloves when handling chipped or broken glass.",
        "P233: Protect against extreme mechanical shock.",
      ],
      sections: [
        {
          title: "Section 1: Glassware Safety Guidelines",
          content: [
            "Material: Borosilicate Glass (high thermo-resistance, low coefficient of thermal expansion).",
            "Physical Hazard: Exercise caution against sudden thermal shocks exceeding 150 °C temperature delta.",
          ],
        },
        {
          title: "Section 4: Broken Glass First-Aid",
          content: [
            "Punctures/Cuts: Wash immediately with soap and water. Cover with sterile dressing and seek first aid.",
          ],
        },
      ],
    },
  },
  {
    id: "distilled-water",
    name: "Deionized / Distilled Pure Water",
    formula: "H2O",
    grade: "ACS Reagent",
    cas: "7732-18-5",
    purity: "Ultra-pure resistivity ≥18 MΩ·cm",
    description:
      "Highly demineralized ultra-pure water designed for analytical dilution, HPLC mobile phase preparation, media reconstitution, and general clean rinsing.",
    price: 12.0,
    unit: "4L (1 Gal)",
    stock: 200,
    category: "Buffers",
    image:
      "https://images.unsplash.com/photo-1495556650867-99238382b61a?auto=format&fit=crop&q=80&w=600",
    physicalState: "Clear color liquid",
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
      hazardStatements: ["Not a hazardous substance or mixture."],
      precautionaryStatements: [
        "No special precautions needed. Practice clean laboratory habits.",
      ],
      sections: [
        {
          title: "Section 1: Composition Information",
          content: [
            "Component: Distilled water 100%. Free from organic, ionic, particulate, and biological elements.",
          ],
        },
        {
          title: "Section 4: First-Aid",
          content: [
            "No harmful symptoms expected. In case of spills, dry off immediately to avoid slips.",
          ],
        },
      ],
    },
  },
];
