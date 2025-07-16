// MongoDB initialization script to create pre-defined users

db = db.getSiblingDB('wellness_events');

// Create users collection with pre-defined accounts
db.users.insertMany([
  {
    username: 'hr_techcorp',
    password: '$2a$10$g4gsTEB2zbaM5I.kwZ9Q2utoYo83RaODAn9BG/HlOFZS9hp9B6JQG', // password: 'password123'
    role: 'HR',
    companyName: 'TechCorp Solutions',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    username: 'hr_innovate',
    password: '$2a$10$g4gsTEB2zbaM5I.kwZ9Q2utoYo83RaODAn9BG/HlOFZS9hp9B6JQG', // password: 'password123'
    role: 'HR',
    companyName: 'Innovate Inc',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    username: 'vendor_wellness',
    password: '$2a$10$g4gsTEB2zbaM5I.kwZ9Q2utoYo83RaODAn9BG/HlOFZS9hp9B6JQG', // password: 'password123'
    role: 'Vendor',
    vendorName: 'Wellness Pro Services',
    eventTypes: ['Yoga', 'Meditation', 'Stress Management'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    username: 'vendor_fitness',
    password: '$2a$10$g4gsTEB2zbaM5I.kwZ9Q2utoYo83RaODAn9BG/HlOFZS9hp9B6JQG', // password: 'password123'
    role: 'Vendor',
    vendorName: 'FitLife Training',
    eventTypes: ['Fitness Training', 'Team Building', 'Health Screening'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    username: 'vendor_mental',
    password: '$2a$10$g4gsTEB2zbaM5I.kwZ9Q2utoYo83RaODAn9BG/HlOFZS9hp9B6JQG', // password: 'password123'
    role: 'Vendor',
    vendorName: 'MindCare Wellness',
    eventTypes: ['Mental Health Workshop', 'Nutrition Seminar', 'Stress Management'],
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

print('Database initialized with pre-created user accounts');
print('Login credentials:');
print('HR Accounts:');
print('  - Username: hr_techcorp, Password: password123 (TechCorp Solutions)');
print('  - Username: hr_innovate, Password: password123 (Innovate Inc)');
print('Vendor Accounts:');
print('  - Username: vendor_wellness, Password: password123 (Wellness Pro Services)');
print('  - Username: vendor_fitness, Password: password123 (FitLife Training)');
print('  - Username: vendor_mental, Password: password123 (MindCare Wellness)');