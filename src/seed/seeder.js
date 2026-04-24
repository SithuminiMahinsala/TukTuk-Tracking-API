import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

import Province from '../models/Province.js';
import District from '../models/District.js';
import PoliceStation from '../models/PoliceStation.js';
import User from '../models/User.js';
import TukTuk from '../models/TukTuk.js';
import LocationPing from '../models/LocationPing.js';

import { provinces, districts, policeStations } from './seedData.js';

dotenv.config();

// Sri Lanka approximate coordinates per district
const districtCoords = {
  'Colombo':      { lat: 6.9271,  lng: 79.8612 },
  'Gampaha':      { lat: 7.0840,  lng: 80.0098 },
  'Kalutara':     { lat: 6.5854,  lng: 79.9607 },
  'Kandy':        { lat: 7.2906,  lng: 80.6337 },
  'Matale':       { lat: 7.4675,  lng: 80.6234 },
  'Nuwara Eliya': { lat: 6.9497,  lng: 80.7891 },
  'Galle':        { lat: 6.0535,  lng: 80.2210 },
  'Matara':       { lat: 5.9549,  lng: 80.5550 },
  'Hambantota':   { lat: 6.1241,  lng: 81.1185 },
  'Jaffna':       { lat: 9.6615,  lng: 80.0255 },
  'Kilinochchi':  { lat: 9.3803,  lng: 80.3770 },
  'Mannar':       { lat: 8.9810,  lng: 79.9044 },
  'Vavuniya':     { lat: 8.7514,  lng: 80.4971 },
  'Mullaitivu':   { lat: 9.2671,  lng: 80.8128 },
  'Batticaloa':   { lat: 7.7102,  lng: 81.6924 },
  'Ampara':       { lat: 7.2833,  lng: 81.6748 },
  'Trincomalee':  { lat: 8.5874,  lng: 81.2152 },
  'Kurunegala':   { lat: 7.4863,  lng: 80.3647 },
  'Puttalam':     { lat: 8.0362,  lng: 79.8283 },
  'Anuradhapura': { lat: 8.3114,  lng: 80.4037 },
  'Polonnaruwa':  { lat: 7.9403,  lng: 81.0188 },
  'Badulla':      { lat: 6.9934,  lng: 81.0550 },
  'Monaragala':   { lat: 6.8728,  lng: 81.3507 },
  'Ratnapura':    { lat: 6.6828,  lng: 80.3992 },
  'Kegalle':      { lat: 7.2513,  lng: 80.3464 },
};

const randomInRange = (min, max) => Math.random() * (max - min) + min;

const generateLocationHistory = (tukTukId, baseCoords, days = 7) => {
  const pings = [];
  const now = new Date();

  for (let day = days; day >= 0; day--) {
    // Morning rush: 6am - 9am (more pings)
    for (let i = 0; i < 12; i++) {
      const timestamp = new Date(now);
      timestamp.setDate(now.getDate() - day);
      timestamp.setHours(6 + Math.floor(randomInRange(0, 3)));
      timestamp.setMinutes(Math.floor(randomInRange(0, 60)));

      pings.push({
        tukTuk: tukTukId,
        latitude:  baseCoords.lat + randomInRange(-0.05, 0.05),
        longitude: baseCoords.lng + randomInRange(-0.05, 0.05),
        speed: randomInRange(10, 40),
        timestamp,
      });
    }

    // Afternoon: 12pm - 5pm
    for (let i = 0; i < 8; i++) {
      const timestamp = new Date(now);
      timestamp.setDate(now.getDate() - day);
      timestamp.setHours(12 + Math.floor(randomInRange(0, 5)));
      timestamp.setMinutes(Math.floor(randomInRange(0, 60)));

      pings.push({
        tukTuk: tukTukId,
        latitude:  baseCoords.lat + randomInRange(-0.03, 0.03),
        longitude: baseCoords.lng + randomInRange(-0.03, 0.03),
        speed: randomInRange(5, 30),
        timestamp,
      });
    }

    // Night: idle/parked - very few pings
    for (let i = 0; i < 2; i++) {
      const timestamp = new Date(now);
      timestamp.setDate(now.getDate() - day);
      timestamp.setHours(22 + Math.floor(randomInRange(0, 2)));
      timestamp.setMinutes(Math.floor(randomInRange(0, 60)));

      pings.push({
        tukTuk: tukTukId,
        latitude:  baseCoords.lat + randomInRange(-0.005, 0.005),
        longitude: baseCoords.lng + randomInRange(-0.005, 0.005),
        speed: 0,
        timestamp,
      });
    }
  }

  return pings;
};

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      ssl: true,
      family: 4,
    });
    console.log('MongoDB connected');

    // Clear existing data
    await Promise.all([
      Province.deleteMany(),
      District.deleteMany(),
      PoliceStation.deleteMany(),
      User.deleteMany(),
      TukTuk.deleteMany(),
      LocationPing.deleteMany(),
    ]);
    console.log('Cleared existing data');

    // Seed provinces
    const createdProvinces = await Province.insertMany(provinces);
    console.log(`${createdProvinces.length} provinces seeded`);

    // Seed districts
    const districtDocs = districts.map(d => ({
      name: d.name,
      code: d.code,
      province: createdProvinces.find(p => p.name === d.provinceName)._id,
    }));
    const createdDistricts = await District.insertMany(districtDocs);
    console.log(`${createdDistricts.length} districts seeded`);

    // Seed police stations
    const stationDocs = policeStations.map(s => {
      const district = createdDistricts.find(d => d.name === s.districtName);
      const province = createdProvinces.find(p =>
        p._id.equals(district.province)
      );
      return {
        name: s.name,
        code: s.code,
        district: district._id,
        province: province._id,
      };
    });
    const createdStations = await PoliceStation.insertMany(stationDocs);
    console.log(`${createdStations.length} police stations seeded`);

    // Seed admin user
    const hashedPassword = await bcrypt.hash('Admin@1234', 10);
    await User.create({
      name: 'HQ Admin',
      email: 'admin@police.lk',
      password: hashedPassword,
      role: 'hq_admin',
    });
    console.log('Admin user created — email: admin@police.lk password: Admin@1234');

    // Seed 200 tuk-tuks with location history
    console.log('Seeding 200 tuk-tuks and location history...');
    let totalPings = 0;

    for (let i = 1; i <= 200; i++) {
      const randomDistrict = createdDistricts[Math.floor(Math.random() * createdDistricts.length)];
      const randomStation  = createdStations.filter(s =>
        s.district.equals(randomDistrict._id)
      );
      const station = randomStation.length > 0
        ? randomStation[Math.floor(Math.random() * randomStation.length)]
        : createdStations[0];

      const tuktuk = await TukTuk.create({
        registrationNumber: `TUK-${String(i).padStart(4, '0')}`,
        ownerName: `Owner ${i}`,
        ownerNIC: `${Math.floor(Math.random() * 900000000 + 100000000)}V`,
        ownerContact: `07${Math.floor(Math.random() * 90000000 + 10000000)}`,
        deviceId: `DEV-${String(i).padStart(4, '0')}`,
        province: randomDistrict.province,
        district: randomDistrict._id,
        policeStation: station._id,
        isActive: true,
      });

      // Generate location history
      const baseCoords = districtCoords[randomDistrict.name] ||
        { lat: 7.8731, lng: 80.7718 };
      const pings = generateLocationHistory(tuktuk._id, baseCoords, 7);

      await LocationPing.insertMany(pings);
      totalPings += pings.length;

      // Update last known location
      const lastPing = pings[pings.length - 1];
      await TukTuk.findByIdAndUpdate(tuktuk._id, {
        lastLocation: {
          latitude: lastPing.latitude,
          longitude: lastPing.longitude,
          timestamp: lastPing.timestamp,
        },
      });

      if (i % 50 === 0) console.log(`   ${i}/200 tuk-tuks seeded...`);
    }

    console.log(`200 tuk-tuks seeded`);
    console.log(` ${totalPings} location pings seeded`);
    console.log(' All seed data inserted successfully!');
    process.exit(0);

  } catch (err) {
    console.error('Seeding failed:', err.message);
    process.exit(1);
  }
};

seed();