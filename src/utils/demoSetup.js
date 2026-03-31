// Demo Setup - Pre-stages data for live demo
// Call this BEFORE demo day to avoid setup delays

export const setupDemoData = () => {
  const STORAGE_KEY = 'guardy_organizations';
  const MEMBERS_KEY = 'guardy_org_members';

  // Pre-create "Sales Team"
  const demoTeam = {
    id: 'org_demo_sales_team',
    name: 'sales-team',
    display_name: 'Sales Team',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // Pre-create members (all active)
  const demoMembers = [
    {
      id: 'user_alice_123',
      email: 'alice@company.com',
      roles: ['admin'],
      invited_at: new Date().toISOString(),
      status: 'active',
      accepted_at: new Date().toISOString(),
    },
    {
      id: 'user_bob_456',
      email: 'bob@company.com',
      roles: ['member'],
      invited_at: new Date().toISOString(),
      status: 'active',
      accepted_at: new Date().toISOString(),
    },
    {
      id: 'user_carol_789',
      email: 'carol@company.com',
      roles: ['member'],
      invited_at: new Date().toISOString(),
      status: 'active',
      accepted_at: new Date().toISOString(),
    },
  ];

  // Save to localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify([demoTeam]));
  const membersObj = {};
  membersObj[demoTeam.id] = demoMembers;
  localStorage.setItem(MEMBERS_KEY, JSON.stringify(membersObj));

  console.log('✅ Demo data setup complete!');
  console.log('📊 Sales Team created with 3 members:', demoMembers.map(m => m.email));
  return { team: demoTeam, members: demoMembers };
};

export const clearDemoData = () => {
  localStorage.removeItem('guardy_organizations');
  localStorage.removeItem('guardy_org_members');
  console.log('🗑️ Demo data cleared');
};

export const resetDemoData = () => {
  clearDemoData();
  setupDemoData();
  window.location.reload();
  console.log('🔄 Demo data reset - page refreshing...');
};

// Export for use in browser console during demo
window.guardy = window.guardy || {};
window.guardy.setupDemo = setupDemoData;
window.guardy.clearDemo = clearDemoData;
window.guardy.resetDemo = resetDemoData;
