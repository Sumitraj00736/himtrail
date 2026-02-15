require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Menu = require('../models/Menu');

const menus = [
  {
    label: 'Destinations',
    style: 'mega',
    order: 1,
    columns: [
      {
        title: 'Nepal',
        items: [
          { label: 'Day Tours', href: '/trips/day-tours' },
          { label: 'Nepal Tours', href: '/trips/nepal-tours' },
          { label: 'Helicopter Tours', href: '/trips/helicopter-tours' },
          { label: 'Mountain Expeditions', href: '/trips/mountain-expeditions' },
          { label: 'Trekking in Nepal', href: '/trips/trekking-in-nepal' },
          { label: 'Yoga Treks in Nepal', href: '/trips/yoga-treks-in-nepal' },
          { label: 'Luxury Travel', href: '/trips/luxury-travel' },
          { label: 'Peak Climbing in Nepal', href: '/trips/peak-climbing-in-nepal' },
          { label: 'Adventure Sports in Nepal', href: '/trips/adventure-sports-in-nepal' },
          { label: 'Destination Wedding in Nepal', href: '/trips/destination-wedding-in-nepal' },
          { label: 'Cooking Classes in Kathmandu', href: '/trips/cooking-classes-in-kathmandu' },
        ],
      },
      {
        title: 'Tanzania',
        items: [
          { label: 'Kilimanjaro Climb', href: '/trips/kilimanjaro-climb' },
          { label: 'Zanzibar Tours and Excursions', href: '/trips/zanzibar-tours' },
          { label: 'Wildlife Safari and Tours in Tanzania', href: '/trips/wildlife-safari-tanzania' },
        ],
      },
      {
        title: 'Bhutan',
        items: [
          { label: 'Bhutan Odyssey Tour - 6 Days', href: '/trips/bhutan-odyssey-6-days' },
          { label: 'Bhutan Gateway - 8 Days', href: '/trips/bhutan-gateway-8-days' },
          { label: 'Bhutan Cultural Tour - 7 Days', href: '/trips/bhutan-cultural-7-days' },
        ],
      },
      {
        title: 'Tibet',
        items: [
          { label: 'Kailash Mansarovar Overland Tour From Nepal', href: '/trips/kailash-mansarovar-overland' },
          { label: 'Tibet Lhasa Cultural Tour - 8 Days', href: '/trips/tibet-lhasa-cultural-8-days' },
        ],
      },
    ],
  },
  {
    label: 'Trekking in Nepal',
    style: 'mega',
    order: 2,
    columns: [
      {
        title: 'Everest Region',
        items: [
          { label: 'Everest Base Camp Trek - 15 Days', href: '/trips/everest-base-camp-trek-15-days' },
          { label: 'Everest Base Camp Trek - 14 Days', href: '/trips/everest-base-camp-trek-14-days' },
          { label: 'Everest Base Camp Trek - 12 Days', href: '/trips/everest-base-camp-trek-12-days' },
          { label: 'Everest Helicopter Trek - 13 Days', href: '/trips/everest-helicopter-trek-13-days' },
          { label: 'Gokyo Lakes and Renjola Pass Trek', href: '/trips/gokyo-renjola-pass-trek' },
          { label: 'Pikey Peak Trek - 9 Days', href: '/trips/pikey-peak-trek-9-days' },
          { label: 'Footprint Special Everest Base Camp Trek - 16 Days', href: '/trips/footprint-ecb-16-days' },
          { label: 'Everest Base Camp Yoga Trek - 16 Days', href: '/trips/ebc-yoga-trek-16-days' },
          { label: 'Everest Chola Pass Trek - 18 Days', href: '/trips/everest-chola-pass-18-days' },
          { label: 'Everest Three Pass Trek - 21 Days', href: '/trips/everest-three-pass-21-days' },
          { label: 'Everest Panorama Trek - 8 Days', href: '/trips/everest-panorama-8-days' },
          { label: 'Everest Base Camp Trek via Salleri - 18 Days', href: '/trips/everest-salleri-18-days' },
        ],
      },
      {
        title: 'Annapurna Region',
        items: [
          { label: 'Mardi Himal Trek - 9 Days', href: '/trips/mardi-himal-trek-9-days' },
          { label: 'Annapurna Circuit & Tilicho Lake Trek', href: '/trips/annapurna-circuit-tilicho' },
          { label: 'Annapurna Base Camp Trek - 8 Days', href: '/trips/abc-8-days' },
          { label: 'Annapurna Base Camp Trek - 10 Days', href: '/trips/abc-10-days' },
          { label: 'Ghorepani Poon Hill Trek - 8 Days', href: '/trips/poon-hill-8-days' },
          { label: 'Tilicho Lake Trek - 9 Days', href: '/trips/tilicho-lake-9-days' },
          { label: 'Khopra Danda Trek - 10 Days', href: '/trips/khopra-danda-10-days' },
          { label: 'Annapurna Circuit Trek - 13 Days', href: '/trips/annapurna-circuit-13-days' },
          { label: 'Nar-Phu Valley Trek - 13 Days', href: '/trips/nar-phu-13-days' },
          { label: 'Annapurna Circuit Biking Trek - 14 Days', href: '/trips/annapurna-biking-14-days' },
        ],
      },
      {
        title: 'Manaslu Region',
        items: [
          { label: 'Manaslu Circuit Trek - 15 Days', href: '/trips/manaslu-circuit-15-days' },
          { label: 'Manaslu Circuit and Tsum Valley Trek - 21 Days', href: '/trips/manaslu-tsum-21-days' },
          { label: 'Tsum Valley Trek - 14 Days', href: '/trips/tsum-valley-14-days' },
        ],
      },
      {
        title: 'Langtang Region',
        items: [
          { label: 'Langtang Valley Trek - 11 Days', href: '/trips/langtang-valley-11-days' },
          { label: 'Yala Peak Climbing - 14 Days', href: '/trips/yala-peak-14-days' },
          { label: 'Ruby Valley Trek - 12 days', href: '/trips/ruby-valley-12-days' },
          { label: 'Langtang Valley and Gosaikunda Lake Trek - 16 Days', href: '/trips/langtang-gosaikunda-16-days' },
        ],
      },
      {
        title: 'Western Region',
        items: [
          { label: 'Rara Lake Trek Package - 8 Days', href: '/trips/rara-lake-8-days' },
        ],
      },
      {
        title: 'Mustang Region Trek & Tours in Nepal',
        items: [
          { label: 'Upper Mustang Jeep Tour - 13 days', href: '/trips/upper-mustang-jeep-13-days' },
        ],
      },
      {
        title: 'Eastern Region',
        items: [
          { label: 'Kanchenjunga Circuit Trek/Base Camp Round Trek - 20 Days', href: '/trips/kanchenjunga-20-days' },
        ],
      },
    ],
  },
  {
    label: 'Luxury Travel',
    style: 'list',
    order: 3,
    columns: [
      {
        title: 'Luxury Travel',
        items: [
          { label: 'Everest Base Camp Luxury Trek', href: '/trips/everest-luxury-trek' },
          { label: 'Ultimate Himalayan Escape', href: '/trips/ultimate-himalayan-escape' },
          { label: 'Annapurna Luxury Trek', href: '/trips/annapurna-luxury-trek' },
        ],
      },
    ],
  },
  {
    label: 'Travel Advise',
    style: 'list',
    order: 4,
    columns: [
      {
        title: 'Travel Advise',
        items: [
          { label: 'Lukla Flight Booking', href: '/travel-advise/lukla-flight-booking' },
          { label: 'Travel Visa', href: '/travel-advise/travel-visa' },
          { label: 'Trekking Grade', href: '/travel-advise/trekking-grade' },
          { label: 'Travel Insurance', href: '/travel-advise/travel-insurance' },
          { label: 'Nepal at a Glance', href: '/travel-advise/nepal-at-a-glance' },
          { label: 'Flight Cancellation', href: '/travel-advise/flight-cancellation' },
          { label: 'Is Nepal Safe to Travel?', href: '/travel-advise/is-nepal-safe' },
          { label: 'Transportation in Nepal', href: '/travel-advise/transportation-in-nepal' },
          { label: 'How to Make a Payment?', href: '/travel-advise/payment' },
          { label: 'Packing & Equipments List', href: '/travel-advise/packing-list' },
          { label: 'Weather & Climate in Nepal', href: '/travel-advise/weather-climate' },
          { label: 'UNESCO Heritage Sites Entry Fees', href: '/travel-advise/unesco-fees' },
          { label: 'Vaccination Requirement for Nepal', href: '/travel-advise/vaccination' },
        ],
      },
    ],
  },
  {
    label: 'About Us',
    style: 'list',
    order: 5,
    columns: [
      {
        title: 'About Us',
        items: [
          { label: 'Our Affiliations', href: '/about/affiliations' },
          { label: 'Partner With Us', href: '/about/partner' },
          { label: 'Latest Trip Review', href: '/about/reviews' },
          { label: 'Our HR Policy', href: '/about/hr-policy' },
          { label: 'Our Approach to Travel', href: '/about/approach' },
          { label: 'Why Footprint Adventure?', href: '/about/why-footprint' },
          { label: 'Terms and Conditions', href: '/about/terms' },
          { label: 'Our Team', href: '/about/team' },
          { label: 'Our Profile', href: '/about/profile' },
          { label: 'Legal Documents', href: '/about/legal' },
        ],
      },
    ],
  },
  {
    label: 'Sustainable Tourism',
    style: 'list',
    order: 6,
    columns: [
      {
        title: 'Sustainable Tourism',
        items: [
          { label: 'Footprint as CO2 Neutral', href: '/sustainable/co2-neutral' },
          { label: 'An Open Letter to our Partners', href: '/sustainable/letter-to-partners' },
          { label: 'Our Eco-Friendly Partners', href: '/sustainable/eco-partners' },
          { label: 'Planting a Future Together', href: '/sustainable/planting-future' },
          { label: 'Sustainability Policy Handbook', href: '/sustainable/policy-handbook' },
          { label: 'Responsible Travel Tips', href: '/sustainable/travel-tips' },
          { label: 'Sustainable HR Policy Handbook', href: '/sustainable/hr-policy' },
          { label: 'Adventure with a Cause: Footprint Adventure CSI', href: '/sustainable/csi' },
          { label: 'Carry Me Bag Campaign: Sustainable Trekking in Nepal', href: '/sustainable/carry-me-bag' },
        ],
      },
    ],
  },
];

const run = async () => {
  await connectDB(process.env.MONGO_URI);
  await Menu.deleteMany({});
  await Menu.insertMany(menus);
  console.log('Menus seeded');
  await mongoose.connection.close();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
