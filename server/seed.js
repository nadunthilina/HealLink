import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import Booking from './src/models/Booking.js';
import Notification from './src/models/Notification.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/heallink';

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Booking.deleteMany({});
    await Notification.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@heallink.com',
      passwordHash: adminPassword,
      phone: '+1234567890',
      role: 'admin',
      status: 'active'
    });
    console.log('👤 Created admin user:', admin.email);

    // Create caretakers
    const caretakerPassword = await bcrypt.hash('caretaker123', 10);
    const caretakers = await User.insertMany([
      {
        name: 'John Doe',
        email: 'john.caretaker@heallink.com',
        passwordHash: caretakerPassword,
        phone: '+1234567891',
        role: 'caretaker',
        status: 'active'
      },
      {
        name: 'Jane Smith',
        email: 'jane.caretaker@heallink.com',
        passwordHash: caretakerPassword,
        phone: '+1234567892',
        role: 'caretaker',
        status: 'active'
      },
      {
        name: 'Michael Johnson',
        email: 'michael.caretaker@heallink.com',
        passwordHash: caretakerPassword,
        phone: '+1234567893',
        role: 'caretaker',
        status: 'active'
      },
      {
        name: 'Sarah Williams',
        email: 'sarah.caretaker@heallink.com',
        passwordHash: caretakerPassword,
        phone: '+1234567894',
        role: 'caretaker',
        status: 'active'
      }
    ]);
    console.log(`👥 Created ${caretakers.length} caretakers`);

    // Create patients
    const patientPassword = await bcrypt.hash('patient123', 10);
    const patients = await User.insertMany([
      {
        name: 'Alice Brown',
        email: 'alice.patient@heallink.com',
        passwordHash: patientPassword,
        phone: '+1234567895',
        role: 'patient',
        status: 'active'
      },
      {
        name: 'Bob Wilson',
        email: 'bob.patient@heallink.com',
        passwordHash: patientPassword,
        phone: '+1234567896',
        role: 'patient',
        status: 'active'
      }
    ]);
    console.log(`👥 Created ${patients.length} patients`);

    // Create sample bookings
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const bookings = await Booking.insertMany([
      {
        patient: patients[0]._id,
        caretaker: caretakers[0]._id,
        serviceType: 'Elderly Care',
        preferredDate: tomorrow,
        notes: 'Need assistance with daily activities',
        status: 'confirmed'
      },
      {
        patient: patients[0]._id,
        caretaker: caretakers[1]._id,
        serviceType: 'Hospital Assistance',
        preferredDate: nextWeek,
        notes: 'Post-surgery care required',
        status: 'pending'
      },
      {
        patient: patients[1]._id,
        caretaker: caretakers[2]._id,
        serviceType: 'Home Care',
        preferredDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        notes: 'Regular checkup and medication reminder',
        status: 'completed'
      }
    ]);
    console.log(`📅 Created ${bookings.length} sample bookings`);

    // Create sample notifications
    const notifications = await Notification.insertMany([
      {
        user: patients[0]._id,
        type: 'booking',
        title: 'Booking Confirmed',
        message: 'Your booking for Elderly Care has been confirmed',
        relatedBooking: bookings[0]._id,
        isRead: false
      },
      {
        user: patients[0]._id,
        type: 'booking',
        title: 'New Booking Request',
        message: 'Your booking request for Hospital Assistance is pending',
        relatedBooking: bookings[1]._id,
        isRead: false
      },
      {
        user: patients[0]._id,
        type: 'system',
        title: 'Welcome to HealLink',
        message: 'Thank you for joining HealLink. We\'re here to help!',
        isRead: true,
        readAt: new Date()
      },
      {
        user: caretakers[0]._id,
        type: 'booking',
        title: 'New Booking Assignment',
        message: 'You have been assigned to a new booking for Elderly Care',
        relatedBooking: bookings[0]._id,
        isRead: false
      }
    ]);
    console.log(`🔔 Created ${notifications.length} sample notifications`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📝 Test Credentials:');
    console.log('─────────────────────────────────────');
    console.log('Admin:');
    console.log('  Email: admin@heallink.com');
    console.log('  Password: admin123');
    console.log('\nPatient (Alice):');
    console.log('  Email: alice.patient@heallink.com');
    console.log('  Password: patient123');
    console.log('\nPatient (Bob):');
    console.log('  Email: bob.patient@heallink.com');
    console.log('  Password: patient123');
    console.log('\nCaretaker (John):');
    console.log('  Email: john.caretaker@heallink.com');
    console.log('  Password: caretaker123');
    console.log('\nCaretaker (Jane):');
    console.log('  Email: jane.caretaker@heallink.com');
    console.log('  Password: caretaker123');
    console.log('─────────────────────────────────────\n');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

seedDatabase();
