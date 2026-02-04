import {
    image8,
    image9,
    image10,
    image11,
    image12,
    image13,
    image14
  } from "$lib/assets/images";

export type Service = {
  id: string;
  image: string;
  title: string;
  description: string;
  fullDescription: string;
  features: string[];
};

export const services: Service[] = [
  {
    id: "general-construction",
    image: image8,
    title: "General Construction",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo sapiente odit at atque ea id suscipit dolores culpa, ducimus vitae.",
    fullDescription: "We provide comprehensive construction services for residential, commercial, and industrial projects. Our experienced team ensures quality workmanship and timely delivery on every project.",
    features: [
      "Residential building construction",
      "Commercial property development",
      "Industrial facility construction",
      "Renovation and remodeling",
      "Project management"
    ]
  },
  {
    id: "eco-leasing-sales",
    image: image9,
    title: "Eco Leasing / Sales",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo sapiente odit at atque ea id suscipit dolores culpa, ducimus vitae.",
    fullDescription: "Offering eco-friendly equipment leasing and sales solutions for construction projects. Modern, efficient machinery that reduces environmental impact while maximizing productivity.",
    features: [
      "Heavy machinery leasing",
      "Equipment sales",
      "Maintenance packages",
      "Operator training",
      "24/7 technical support"
    ]
  },
  {
    id: "real-estate",
    image: image10,
    title: "Real Estate",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo sapiente odit at atque ea id suscipit dolores culpa, ducimus vitae.",
    fullDescription: "Expert real estate development and property management services. From land acquisition to property sales, we handle every aspect of real estate projects.",
    features: [
      "Property development",
      "Land acquisition",
      "Property management",
      "Real estate consultation",
      "Investment advisory"
    ]
  },
  {
    id: "import-export",
    image: image11,
    title: "Import & Export",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo sapiente odit at atque ea id suscipit dolores culpa, ducimus vitae.",
    fullDescription: "Facilitating international trade of construction materials and equipment. Reliable logistics and customs handling for seamless cross-border transactions.",
    features: [
      "Construction materials import",
      "Equipment export services",
      "Customs clearance",
      "Logistics coordination",
      "Quality assurance"
    ]
  },
  {
    id: "consultant",
    image: image12,
    title: "Consultant",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo sapiente odit at atque ea id suscipit dolores culpa, ducimus vitae.",
    fullDescription: "Professional construction and project management consulting. We help clients optimize their construction projects with expert guidance and strategic planning.",
    features: [
      "Project feasibility studies",
      "Construction planning",
      "Cost estimation",
      "Risk assessment",
      "Quality control"
    ]
  },
  {
    id: "agriculture",
    image: image13,
    title: "Agriculture",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo sapiente odit at atque ea id suscipit dolores culpa, ducimus vitae.",
    fullDescription: "Agricultural infrastructure development and farming solutions. Building modern facilities that support sustainable agriculture and food production.",
    features: [
      "Farm infrastructure",
      "Irrigation systems",
      "Storage facilities",
      "Agricultural machinery",
      "Greenhouse construction"
    ]
  },
  {
    id: "petroleum",
    image: image14,
    title: "Petroleum",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo sapiente odit at atque ea id suscipit dolores culpa, ducimus vitae.",
    fullDescription: "Specialized construction services for petroleum and energy sector. Safe, compliant infrastructure for oil and gas operations.",
    features: [
      "Refinery construction",
      "Pipeline installation",
      "Storage tank fabrication",
      "Safety system installation",
      "Maintenance services"
    ]
  }
];