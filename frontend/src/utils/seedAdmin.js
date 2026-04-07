// Seed admin user if not exists
export const seedAdmin = () => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  
  if (!users.find(u => u.email === 'reclaimafrica.founder@gmail.com')) {
    const admin = {
      id: 'admin-' + Date.now(),
      full_name: 'Admin',
      email: 'reclaimafrica.founder@gmail.com',
      phone: '',
      password: 'Founder12344',
      role: 'admin',
      created_at: new Date().toISOString()
    };
    users.push(admin);
    localStorage.setItem('users', JSON.stringify(users));
  }
};

// Call on app load
seedAdmin();
