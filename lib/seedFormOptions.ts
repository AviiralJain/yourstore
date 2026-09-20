import connectToDatabase from '@/lib/db/mongodb';
import FormOption from '@/lib/models/FormOption';

const seedData = [
  { group: 'user_type', label: 'School Student', value: 'School Student', active: true, displayOrder: 10 },
  { group: 'user_type', label: 'Diploma Student', value: 'Diploma Student', active: true, displayOrder: 20 },
  { group: 'user_type', label: 'Engineering Student', value: 'Engineering Student', active: true, displayOrder: 30 },
  { group: 'user_type', label: 'College / University Team', value: 'College / University Team', active: true, displayOrder: 40 },
  { group: 'user_type', label: 'Researcher', value: 'Researcher', active: true, displayOrder: 50 },
  { group: 'user_type', label: 'Student Innovator', value: 'Student Innovator', active: true, displayOrder: 60 },
  { group: 'user_type', label: 'Startup', value: 'Startup', active: true, displayOrder: 70 },
  { group: 'user_type', label: 'Organization / Industry', value: 'Organization / Industry', active: true, displayOrder: 80 },
  { group: 'user_type', label: 'Other', value: 'Other', active: true, displayOrder: 90 },

  { group: 'project_domain', label: 'Drone & UAV Technology', value: 'Drone & UAV Technology', active: true, displayOrder: 10 },
  { group: 'project_domain', label: 'Robotics & Automation', value: 'Robotics & Automation', active: true, displayOrder: 20 },
  { group: 'project_domain', label: 'Embedded Systems & Electronics', value: 'Embedded Systems & Electronics', active: true, displayOrder: 30 },
  { group: 'project_domain', label: 'IoT & Smart Systems', value: 'IoT & Smart Systems', active: true, displayOrder: 40 },
  { group: 'project_domain', label: 'AI & Computer Vision', value: 'AI & Computer Vision', active: true, displayOrder: 50 },
  { group: 'project_domain', label: 'Autonomous Technologies', value: 'Autonomous Technologies', active: true, displayOrder: 60 },
  { group: 'project_domain', label: 'R&D & Prototyping', value: 'R&D & Prototyping', active: true, displayOrder: 70 },
  { group: 'project_domain', label: 'Other', value: 'Other', active: true, displayOrder: 80 },

  { group: 'current_stage', label: 'Idea / Concept', value: 'Idea / Concept', active: true, displayOrder: 10 },
  { group: 'current_stage', label: 'Planning', value: 'Planning', active: true, displayOrder: 20 },
  { group: 'current_stage', label: 'Design', value: 'Design', active: true, displayOrder: 30 },
  { group: 'current_stage', label: 'Development', value: 'Development', active: true, displayOrder: 40 },
  { group: 'current_stage', label: 'Prototype', value: 'Prototype', active: true, displayOrder: 50 },
  { group: 'current_stage', label: 'Testing', value: 'Testing', active: true, displayOrder: 60 },
  { group: 'current_stage', label: 'Existing Project - Need Improvements', value: 'Existing Project - Need Improvements', active: true, displayOrder: 70 },

  { group: 'timeline', label: 'No fixed deadline', value: 'No fixed deadline', active: true, displayOrder: 10 },
  { group: 'timeline', label: 'Within 1 month', value: 'Within 1 month', active: true, displayOrder: 20 },
  { group: 'timeline', label: '1-3 months', value: '1-3 months', active: true, displayOrder: 30 },
  { group: 'timeline', label: '3-6 months', value: '3-6 months', active: true, displayOrder: 40 },
  { group: 'timeline', label: 'More than 6 months', value: 'More than 6 months', active: true, displayOrder: 50 },

  { group: 'preferred_contact_method', label: 'WhatsApp', value: 'WhatsApp', active: true, displayOrder: 10 },
  { group: 'preferred_contact_method', label: 'Phone Call', value: 'Phone Call', active: true, displayOrder: 20 },
  { group: 'preferred_contact_method', label: 'Email', value: 'Email', active: true, displayOrder: 30 },

  { group: 'technology', label: 'ESP32', value: 'ESP32', active: true, displayOrder: 10 },
  { group: 'technology', label: 'Arduino', value: 'Arduino', active: true, displayOrder: 20 },
  { group: 'technology', label: 'Raspberry Pi', value: 'Raspberry Pi', active: true, displayOrder: 30 },
  { group: 'technology', label: 'STM32', value: 'STM32', active: true, displayOrder: 40 },
  { group: 'technology', label: 'Flight Controller', value: 'Flight Controller', active: true, displayOrder: 50 }
];

export async function seedFormOptions() {
  await connectToDatabase();
  const count = await FormOption.countDocuments();
  if (count === 0) {
    await FormOption.insertMany(seedData);
    return true;
  }
  return false;
}
