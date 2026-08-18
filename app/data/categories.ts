export interface Subcategory {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  subcategories: Subcategory[];
}

export const categories: Category[] = [
  {
    id: "drone",
    name: "DRONE",
    description: "Drone components, hardware and accessories.",
    image: "/images/hero-drone.jpg",
    subcategories: [
      // TODO: Replace with client-approved subcategories
      { id: "motors", name: "Motors" },
      { id: "escs", name: "ESCs" },
      { id: "fcs", name: "Flight Controllers" },
      { id: "propellers", name: "Propellers" }
    ]
  },
  {
    id: "robotics",
    name: "ROBOTICS",
    description: "Robotics components, electronics and mechanical hardware.",
    image: "/images/categories/robotics.jpg",
    subcategories: [
      // TODO: Replace with client-approved subcategories
      { id: "robotic-motors", name: "Motors" },
      { id: "motor-drivers", name: "Motor Drivers" },
      { id: "controllers", name: "Controllers" },
      { id: "sensors", name: "Sensors" }
    ]
  }
];
