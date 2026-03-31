// Mock Auth0 Organizations Service (Frontend-only for Demo)
// In production, backend proxy would call real Auth0 Management API
// This mock version uses localStorage for persistent demo data

const STORAGE_KEY = 'guardy_organizations';
const MEMBERS_KEY = 'guardy_org_members';

const getMockOrganizations = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
};

const saveMockOrganizations = (orgs) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orgs));
};

const getMockMembers = () => {
  try {
    return JSON.parse(localStorage.getItem(MEMBERS_KEY) || '{}');
  } catch {
    return {};
  }
};

const saveMockMembers = (members) => {
  localStorage.setItem(MEMBERS_KEY, JSON.stringify(members));
};

export const createOrganization = async (name, displayName) => {
  await new Promise(r => setTimeout(r, 600));
  const organizations = getMockOrganizations();
  if (organizations.some(o => o.name === name)) {
    throw new Error('Organization already exists');
  }
  const newOrg = {
    id: `org_${Date.now()}`,
    name,
    display_name: displayName,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  organizations.push(newOrg);
  saveMockOrganizations(organizations);
  const members = getMockMembers();
  members[newOrg.id] = [];
  saveMockMembers(members);
  console.log('✅ Organization created:', newOrg);
  return newOrg;
};

export const getOrganizations = async () => {
  await new Promise(r => setTimeout(r, 300));
  return getMockOrganizations();
};

export const inviteUserToOrganization = async (organizationId, email, roles = []) => {
  await new Promise(r => setTimeout(r, 500));
  const organizations = getMockOrganizations();
  const org = organizations.find(o => o.id === organizationId);
  if (!org) {
    throw new Error('Organization not found');
  }
  const members = getMockMembers();
  if (!members[organizationId]) {
    members[organizationId] = [];
  }
  if (members[organizationId].some(m => m.email === email)) {
    throw new Error('User already invited to this organization');
  }
  const newMember = {
    id: `user_${Date.now()}`,
    email,
    roles: roles.length > 0 ? roles : ['member'],
    invited_at: new Date().toISOString(),
    status: 'pending_activation',
  };
  members[organizationId].push(newMember);
  saveMockMembers(members);
  console.log('✅ User invited:', newMember);
  return newMember;
};

export const getOrganizationMembers = async (organizationId) => {
  await new Promise(r => setTimeout(r, 300));
  const members = getMockMembers();
  return members[organizationId] || [];
};

export const removeOrganizationMember = async (organizationId, userId) => {
  await new Promise(r => setTimeout(r, 300));
  const members = getMockMembers();
  if (members[organizationId]) {
    members[organizationId] = members[organizationId].filter(m => m.id !== userId);
    saveMockMembers(members);
  }
  return true;
};

export const getUserOrganizations = async (userId) => {
  await new Promise(r => setTimeout(r, 300));
  return getMockOrganizations();
};

export const acceptOrganizationInvite = async (organizationId, userId) => {
  await new Promise(r => setTimeout(r, 400));
  const members = getMockMembers();
  if (members[organizationId]) {
    const member = members[organizationId].find(m => m.id === userId);
    if (member) {
      member.status = 'active';
      member.accepted_at = new Date().toISOString();
      saveMockMembers(members);
      console.log('✅ Member accepted invite:', member);
      return member;
    }
  }
  throw new Error('Member not found');
};
