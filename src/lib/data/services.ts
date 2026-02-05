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
      "We provide comprehensive construction services for residential, commercial, and industrial projects.",
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
      "Offering eco-friendly equipment leasing and sales solutions for construction projects. Modern, efficient machinery that reduces environmental impact.",
    fullDescription: "Access top-tier construction equipment through flexible leasing options or direct purchase. Our eco-friendly machinery fleet reduces environmental impact while maximizing productivity and operational efficiency for your projects.",
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
    description: "Expert real estate development and property management services. From land acquisition to property sales, we handle every aspect of real estate projects.",
    fullDescription: "Complete real estate development and property management solutions. From land acquisition to project completion, we guide you through every stage of property development with strategic insights and market expertise.",
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
    description: "Facilitating international trade of construction materials and equipment. Reliable logistics and customs handling for seamless cross-border transactions.",
    fullDescription: "Streamlined international trade services for construction materials and equipment. We handle customs, logistics, and quality assurance to ensure seamless cross-border transactions and timely delivery of your supplies.",
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
    description: "Professional construction and project management consulting. We help clients optimize their construction projects with expert guidance and strategic planning.",
    fullDescription: "Expert construction consulting services to optimize your projects. Our seasoned professionals provide strategic planning, cost management, and risk assessment to ensure your construction ventures achieve maximum efficiency and profitability.",
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
    description: "Agricultural infrastructure development and farming solutions. Building modern facilities that support sustainable agriculture and food production.",
    fullDescription: "Modern agricultural infrastructure development for sustainable farming. We design and build irrigation systems, storage facilities, and farming structures that enhance productivity while supporting environmentally responsible agriculture practices.",
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
    description: "Specialized construction services for petroleum and energy sector. Safe, compliant infrastructure for oil and gas operations.",
    fullDescription: "Specialized construction for the petroleum and energy sector. We deliver safe, compliant infrastructure including refineries, pipelines, and storage facilities, adhering to the highest industry standards and safety regulations.",
    features: [
      "Refinery construction",
      "Pipeline installation",
      "Storage tank fabrication",
      "Safety system installation",
      "Maintenance services"
    ]
  }
];
