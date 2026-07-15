require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const TeamMember = require('../models/TeamMember');

const dummyMembers = [
  {
    name: 'Pemba Sherpa',
    role: 'Managing Director & Founder',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
    bio: 'Pemba has climbed Mt. Everest six times and founded Himtrail with a vision of carbon-neutral mountain expeditions.',
    order: 1,
    isActive: true,
    socialLinks: {
      linkedin: 'https://linkedin.com/in/pemba-sherpa',
      facebook: 'https://facebook.com/pemba-sherpa',
      twitter: 'https://twitter.com/pemba-sherpa',
      instagram: 'https://instagram.com/pemba-sherpa'
    }
  },
  {
    name: 'Sarah Jenkins',
    role: 'Co-Director & Operations Chief',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    bio: 'Sarah manages global partnerships and runs the logistics of Himtrail’s international trekking packages.',
    order: 2,
    isActive: true,
    socialLinks: {
      linkedin: 'https://linkedin.com/in/sarah-jenkins',
      facebook: 'https://facebook.com/sarah-jenkins',
      instagram: 'https://instagram.com/sarah-jenkins'
    }
  },
  {
    name: 'Mingma Tenzing Sherpa',
    role: 'Senior Expedition Guide',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80',
    bio: 'Certified by the IFMGA, Mingma has led over 30 high-altitude peak expeditions in Nepal, Tibet, and Bhutan.',
    order: 3,
    isActive: true,
    socialLinks: {
      facebook: 'https://facebook.com/mingma-tenzing',
      instagram: 'https://instagram.com/mingma-tenzing'
    }
  },
  {
    name: 'Dr. Angela Rossi',
    role: 'High-Altitude Medical Advisor',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80',
    bio: 'A specialist in wilderness medicine, Dr. Rossi oversees safety protocols and guide training for oxygenation systems.',
    order: 4,
    isActive: true,
    socialLinks: {
      linkedin: 'https://linkedin.com/in/angela-rossi',
      twitter: 'https://twitter.com/angela-rossi'
    }
  },
  {
    name: 'Nima Dorjee Sherpa',
    role: 'Lead Trekking Guide',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
    bio: 'Nima has 12 years of experience guiding treks through Everest and Annapurna regions. He speaks fluent English and Japanese.',
    order: 5,
    isActive: true,
    socialLinks: {
      facebook: 'https://facebook.com/nima-dorjee',
      instagram: 'https://instagram.com/nima-dorjee'
    }
  },
  {
    name: 'Pema Lhamo',
    role: 'Sustainability & Eco-Tourism Officer',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80',
    bio: 'Pema leads the "Carry-Me-Bag" campaign and coordinates zero-waste projects in various Himalayan tea-houses.',
    order: 6,
    isActive: true,
    socialLinks: {
      linkedin: 'https://linkedin.com/in/pema-lhamo',
      instagram: 'https://instagram.com/pema-lhamo'
    }
  },
  {
    name: 'Dawa Tshering',
    role: 'Lead Camp Chef',
    image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=80',
    bio: 'Dawa is famous for preparing three-course warm meals at 5,000 meters altitude during camp-style trekking peaks.',
    order: 7,
    isActive: true,
    socialLinks: {}
  },
  {
    name: 'Elena Rostova',
    role: 'Customer Experience Coordinator',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&auto=format&fit=crop&q=80',
    bio: 'Elena helps clients customize itineraries and answers all accommodation, training, and packing list queries.',
    order: 8,
    isActive: true,
    socialLinks: {
      linkedin: 'https://linkedin.com/in/elena-rostova',
      facebook: 'https://facebook.com/elena-rostova'
    }
  },
  {
    name: 'Lakpa Gelu Sherpa',
    role: 'Rescue & Technical Support Head',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=80',
    bio: 'Lakpa is a trained helicopter rescue technician, ensuring immediate response for high-altitude emergency cases.',
    order: 9,
    isActive: true,
    socialLinks: {
      facebook: 'https://facebook.com/lakpa-gelu'
    }
  },
  {
    name: 'Maya Thapa',
    role: 'Finance & HR Manager',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop&q=80',
    bio: 'Maya looks after compliance, fair wages for our Sherpa porters, and administrative operations in Kathmandu.',
    order: 10,
    isActive: true,
    socialLinks: {
      linkedin: 'https://linkedin.com/in/maya-thapa'
    }
  }
];

const seed = async () => {
  await connectDB(process.env.MONGO_URI);
  
  // Clean existing team members
  console.log('Cleaning existing team members...');
  await TeamMember.deleteMany({});
  
  // Insert team members
  console.log('Seeding team members...');
  await TeamMember.insertMany(dummyMembers);
  
  console.log('Seeding complete! 10 team members added.');
  await mongoose.connection.close();
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
