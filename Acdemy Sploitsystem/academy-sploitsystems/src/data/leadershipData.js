import atifPhoto from '../assets/Atif11.png'

export const orgTeams = [
  {
    slug: 'digital-marketing',
    name: 'Digital Marketing',
    summary: 'SEO, social, performance marketing, and content production systems.',
    photo: '/uploads/team/digital-marketing.webp',
    execId: 'cmo-1',
    managerId: 'dm-lead-1',
  },
  {
    slug: 'cybersecurity',
    name: 'Cybersecurity',
    summary: 'Cybersecurity services including SOC support, pentesting, and compliance guidance.',
    photo: '/uploads/team/cybersecurity.webp',
    execId: 'ciso-1',
    managerId: 'cyber-lead-1',
  },
  {
    slug: 'it-department',
    name: 'IT Department',
    summary: 'IT support and network operations — endpoints, access, infrastructure and troubleshooting.',
    photo: '/uploads/team/it-department.webp',
    execId: 'cto-1',
    managerId: 'it-lead-1',
  },
  {
    slug: 'software-development',
    name: 'Software Development',
    summary: 'Web and software engineering delivery with testing and QA for reliable releases.',
    photo: '/uploads/team/software-development.webp',
    execId: 'cto-1',
    managerId: 'sd-lead-1',
  },
]

export const orgPeople = {
  'ceo-1': {
    id: 'ceo-1',
    name: 'Haris Muhammad',
    title: 'CEO',
    team: 'Leadership',
    teamSlug: 'leadership',
    reportsTo: null,
    photo: '/uploads/team/haris.jpg',
    bio: 'Leads overall strategy, partnerships, and company direction across all services.',
    email: 'info@sploitsystems.com',
  },
  'coo-1': {
    id: 'coo-1',
    name: 'Sofia Laurent',
    title: 'COO / Operations Director',
    team: 'Leadership',
    teamSlug: 'leadership',
    reportsTo: 'ceo-1',
    photo: '/uploads/team/coo-1.webp',
    bio: 'Runs day-to-day operations, client delivery coordination, and service quality.',
    email: 'info@sploitsystems.com',
  },
  'cto-1': {
    id: 'cto-1',
    name: 'Marco De Luca',
    title: 'CTO',
    team: 'Leadership',
    teamSlug: 'leadership',
    reportsTo: 'ceo-1',
    photo: '/uploads/team/cto-1.webp',
    bio: 'Owns technology direction, infrastructure decisions, and engineering standards across IT and software delivery.',
    email: 'info@sploitsystems.com',
  },
  'ciso-1': {
    id: 'ciso-1',
    name: 'Elise van Dijk',
    title: 'CISO',
    team: 'Leadership',
    teamSlug: 'leadership',
    reportsTo: 'ceo-1',
    photo: '/uploads/team/ciso-1.webp',
    bio: 'Leads security strategy, cybersecurity service quality, and internal security governance.',
    email: 'info@sploitsystems.com',
  },
  'cmo-1': {
    id: 'cmo-1',
    name: 'Claire Bennett',
    title: 'CMO',
    team: 'Leadership',
    teamSlug: 'leadership',
    reportsTo: 'ceo-1',
    photo: '/uploads/team/cmo-1.webp',
    bio: 'Leads marketing strategy, brand execution, campaign systems, and growth initiatives.',
    email: 'info@sploitsystems.com',
  },
  'cfo-1': {
    id: 'cfo-1',
    name: 'Isabella Conti',
    title: 'CFO',
    team: 'Leadership',
    teamSlug: 'leadership',
    reportsTo: 'ceo-1',
    photo: '/uploads/team/cfo-1.webp',
    bio: 'Oversees financial planning, pricing strategy input, and commercial reporting (outsourced bookkeeping supported).',
    email: 'info@sploitsystems.com',
  },
  'chro-1': {
    id: 'chro-1',
    name: 'Hannah Schneider',
    title: 'CHRO',
    team: 'Leadership',
    teamSlug: 'leadership',
    reportsTo: 'ceo-1',
    photo: '/uploads/team/chro-1.webp',
    bio: 'Owns people strategy, hiring standards, training plans, and culture programs (HR operations can be outsourced).',
    email: 'info@sploitsystems.com',
  },
  'web-dev-1': {
    id: 'web-dev-1',
    name: 'Atif Choudhary',
    title: 'Web Developer',
    team: 'Leadership',
    teamSlug: 'leadership',
    reportsTo: 'ceo-1',
    photo: atifPhoto,
    bio: 'Builds and maintains website features, pages, and front-end improvements.',
    email: 'info@sploitsystems.com',
  },
  'dm-lead-1': {
    id: 'dm-lead-1',
    name: 'Jakob Lindström',
    title: 'Digital Marketing Team Lead',
    team: 'Digital Marketing',
    teamSlug: 'digital-marketing',
    reportsTo: 'cmo-1',
    photo: '/uploads/team/dm-lead-1.webp',
    bio: 'Runs digital marketing delivery across SEO, social, content, and performance channels.',
    email: 'info@sploitsystems.com',
  },
  'cyber-lead-1': {
    id: 'cyber-lead-1',
    name: 'Ryan Mitchell',
    title: 'Cybersecurity Team Lead',
    team: 'Cybersecurity',
    teamSlug: 'cybersecurity',
    reportsTo: 'ciso-1',
    photo: '/uploads/team/cyber-lead-1.webp',
    bio: 'Leads cybersecurity delivery, prioritisation, and report quality across engagements.',
    email: 'info@sploitsystems.com',
  },
  'it-lead-1': {
    id: 'it-lead-1',
    name: 'Tomasz Nowak',
    title: 'IT Department Team Lead',
    team: 'IT Department',
    teamSlug: 'it-department',
    reportsTo: 'cto-1',
    photo: '/uploads/team/it-lead-1.webp',
    bio: 'Runs IT operations including support, access management, and client infrastructure troubleshooting.',
    email: 'info@sploitsystems.com',
  },
  'sd-lead-1': {
    id: 'sd-lead-1',
    name: 'James Walker',
    title: 'Software Development Team Lead',
    team: 'Software Development',
    teamSlug: 'software-development',
    reportsTo: 'cto-1',
    photo: '/uploads/team/sd-lead-1.webp',
    bio: 'Owns software delivery, code quality, sprint planning, and technical execution for client builds.',
    email: 'info@sploitsystems.com',
  },
  'seo-1': {
    id: 'seo-1',
    name: 'Freya Walsh',
    title: 'SEO Specialist',
    team: 'Digital Marketing',
    teamSlug: 'digital-marketing',
    reportsTo: 'dm-lead-1',
    photo: '/uploads/team/seo-1.webp',
    bio: 'Builds technical and content SEO plans, audits, and search performance reporting.',
    email: 'info@sploitsystems.com',
  },
  'smm-1': {
    id: 'smm-1',
    name: 'Ava Cooper',
    title: 'Social Media Marketer',
    team: 'Digital Marketing',
    teamSlug: 'digital-marketing',
    reportsTo: 'dm-lead-1',
    photo: '/uploads/team/smm-1.webp',
    bio: 'Plans and runs social content, community engagement, and reporting across platforms.',
    email: 'info@sploitsystems.com',
  },
  'perf-1': {
    id: 'perf-1',
    name: 'Chris Donovan',
    title: 'Performance Marketer',
    team: 'Digital Marketing',
    teamSlug: 'digital-marketing',
    reportsTo: 'dm-lead-1',
    photo: '/uploads/team/perf-1.webp',
    bio: 'Runs paid campaigns, tracking, optimisation, and ROI reporting for growth.',
    email: 'info@sploitsystems.com',
  },
  'content-1': {
    id: 'content-1',
    name: 'Elena Rossi',
    title: 'Content Executive',
    team: 'Digital Marketing',
    teamSlug: 'digital-marketing',
    reportsTo: 'dm-lead-1',
    photo: '/uploads/team/content-1.webp',
    bio: 'Owns content planning and production workflow for campaigns and brand assets.',
    email: 'info@sploitsystems.com',
  },
  'gd-1': {
    id: 'gd-1',
    name: 'Amna Rehman',
    title: 'Graphic Designer',
    team: 'Digital Marketing',
    teamSlug: 'digital-marketing',
    reportsTo: 'content-1',
    photo: '/uploads/team/amna.webp',
    bio: 'Creates graphics, brand assets, and campaign creatives for web and social.',
    email: 'info@sploitsystems.com',
  },
  've-1': {
    id: 've-1',
    name: 'Samuel Wright',
    title: 'Video Editor',
    team: 'Digital Marketing',
    teamSlug: 'digital-marketing',
    reportsTo: 'content-1',
    photo: '/uploads/team/ve-1.webp',
    bio: 'Edits short-form and long-form video content for ads, social, and product launches.',
    email: 'info@sploitsystems.com',
  },
  'cyber-eng-1': {
    id: 'cyber-eng-1',
    name: 'Felix Schneider',
    title: 'Cybersecurity Engineer',
    team: 'Cybersecurity',
    teamSlug: 'cybersecurity',
    reportsTo: 'cyber-lead-1',
    photo: '/uploads/team/cyber-eng-1.webp',
    bio: 'Supports security hardening, threat modelling, and security tooling integration.',
    email: 'info@sploitsystems.com',
  },
  'soc-1': {
    id: 'soc-1',
    name: 'Oscar Berg',
    title: 'SOC Analyst',
    team: 'Cybersecurity',
    teamSlug: 'cybersecurity',
    reportsTo: 'cyber-lead-1',
    photo: '/uploads/team/soc-1.webp',
    bio: 'Monitors alerts, triages events, and supports incident response playbooks.',
    email: 'info@sploitsystems.com',
  },
  'pt-1': {
    id: 'pt-1',
    name: 'Theo Martin',
    title: 'Penetration Tester',
    team: 'Cybersecurity',
    teamSlug: 'cybersecurity',
    reportsTo: 'cyber-lead-1',
    photo: '/uploads/team/pt-1.webp',
    bio: 'Performs security testing, documents findings, and supports remediation validation.',
    email: 'info@sploitsystems.com',
  },
  'grc-1': {
    id: 'grc-1',
    name: 'Laura Rossi',
    title: 'GRC Compliance Manager',
    team: 'Cybersecurity',
    teamSlug: 'cybersecurity',
    reportsTo: 'cyber-lead-1',
    photo: '/uploads/team/grc-1.webp',
    bio: 'Helps clients align controls, policies, and evidence for compliance and risk management.',
    email: 'info@sploitsystems.com',
  },
  'net-1': {
    id: 'net-1',
    name: 'Stefan Müller',
    title: 'Network Support Specialist',
    team: 'IT Department',
    teamSlug: 'it-department',
    reportsTo: 'it-lead-1',
    photo: '/uploads/team/net-1.webp',
    bio: 'Supports switching, routing, Wi‑Fi, VPN, and firewall troubleshooting for client networks.',
    email: 'info@sploitsystems.com',
  },
  'its-1': {
    id: 'its-1',
    name: "Patrick O'Connor",
    title: 'IT Support Specialist',
    team: 'IT Department',
    teamSlug: 'it-department',
    reportsTo: 'it-lead-1',
    photo: '/uploads/team/its-1.webp',
    bio: 'Handles tickets, onboarding, access requests, and endpoint support for clients.',
    email: 'info@sploitsystems.com',
  },
  'sys-1': {
    id: 'sys-1',
    name: 'Anna Kowalska',
    title: 'Systems Administrator',
    team: 'IT Department',
    teamSlug: 'it-department',
    reportsTo: 'it-lead-1',
    photo: '/uploads/team/sys-1.webp',
    bio: 'Manages servers, patching, backups, and secure access for client environments.',
    email: 'info@sploitsystems.com',
  },
  'noc-1': {
    id: 'noc-1',
    name: 'Erik Svensson',
    title: 'Monitoring & NOC Specialist',
    team: 'IT Department',
    teamSlug: 'it-department',
    reportsTo: 'it-lead-1',
    photo: '/uploads/team/noc-1.webp',
    bio: 'Owns uptime monitoring, alert routing, and first-response procedures for infrastructure issues.',
    email: 'info@sploitsystems.com',
  },
  'fs-web-1': {
    id: 'fs-web-1',
    name: 'Ethan Brooks',
    title: 'Full Stack Web Developer',
    team: 'Software Development',
    teamSlug: 'software-development',
    reportsTo: 'sd-lead-1',
    photo: '/uploads/team/fs-web-1.webp',
    bio: 'Builds web apps, dashboards and responsive sites with clean, secure code.',
    email: 'info@sploitsystems.com',
  },
  'fs-soft-1': {
    id: 'fs-soft-1',
    name: 'Daniel Costa',
    title: 'Full Stack Software Engineer',
    team: 'Software Development',
    teamSlug: 'software-development',
    reportsTo: 'sd-lead-1',
    photo: '/uploads/team/fs-soft-1.webp',
    bio: 'Delivers software features end-to-end and supports integrations and performance improvements.',
    email: 'info@sploitsystems.com',
  },
  'fe-1': {
    id: 'fe-1',
    name: 'Mia Thompson',
    title: 'Front-End Developer',
    team: 'Software Development',
    teamSlug: 'software-development',
    reportsTo: 'sd-lead-1',
    photo: '/uploads/team/fe-1.webp',
    bio: 'Builds accessible, high-performance UI components and design systems.',
    email: 'info@sploitsystems.com',
  },
  'be-1': {
    id: 'be-1',
    name: 'Lucas Andersen',
    title: 'Back-End Developer',
    team: 'Software Development',
    teamSlug: 'software-development',
    reportsTo: 'sd-lead-1',
    photo: '/uploads/team/be-1.webp',
    bio: 'Designs APIs, data layers, and secure services with reliability in mind.',
    email: 'info@sploitsystems.com',
  },
  'qa-1': {
    id: 'qa-1',
    name: 'Isabelle Moreau',
    title: 'QA Engineer',
    team: 'Software Development',
    teamSlug: 'software-development',
    reportsTo: 'sd-lead-1',
    photo: '/uploads/team/qa-1.webp',
    bio: 'Owns test planning, regression checks, and release quality gates.',
    email: 'info@sploitsystems.com',
  },
}

const reportsMap = Object.values(orgPeople).reduce((acc, person) => {
  if (!person?.reportsTo) return acc
  if (!acc[person.reportsTo]) acc[person.reportsTo] = []
  acc[person.reportsTo].push(person.id)
  return acc
}, {})

export function getTeamBySlug(slug) {
  return orgTeams.find((team) => team.slug === slug)
}

export function getPersonById(id) {
  return orgPeople[id] || null
}

export function getTeamPeople(teamSlug) {
  return Object.values(orgPeople).filter((person) => person && person.teamSlug === teamSlug)
}

function buildOrgNode(rootId, allowedSet) {
  const person = getPersonById(rootId)
  if (!person) return null

  const childIds = reportsMap[rootId] || []
  const children = childIds
    .filter((childId) => !allowedSet || allowedSet.has(childId))
    .map((childId) => buildOrgNode(childId, allowedSet))
    .filter(Boolean)

  return { person, children }
}

export function buildTopLeadershipTree() {
  const ceo = getPersonById('ceo-1')
  if (!ceo) return null

  const makePersonNode = (id, children = []) => {
    const person = getPersonById(id)
    if (!person) return null
    return { person, children }
  }

  const makeTeamNode = (slug) => {
    const team = getTeamBySlug(slug)
    if (!team) return null
    return {
      team: {
        slug: team.slug,
        name: team.name,
        role: 'Team',
        photo: team.photo || '/uploads/team/team.webp',
      },
      children: [],
    }
  }

  const ctoTeams = ['it-department', 'software-development'].map(makeTeamNode).filter(Boolean)
  const cisoTeams = ['cybersecurity'].map(makeTeamNode).filter(Boolean)
  const cmoTeams = ['digital-marketing'].map(makeTeamNode).filter(Boolean)

  const children = [
    makePersonNode('coo-1'),
    makePersonNode('cto-1', ctoTeams),
    makePersonNode('ciso-1', cisoTeams),
    makePersonNode('web-dev-1'),
    makePersonNode('cfo-1'),
    makePersonNode('chro-1'),
    makePersonNode('cmo-1', cmoTeams),
  ].filter(Boolean)

  return { person: ceo, children }
}

export function buildTeamTree(team) {
  const exec = getPersonById(team.execId)
  const teamIds = new Set(getTeamPeople(team.slug).map((person) => person.id))
  const managerBranch = buildOrgNode(team.managerId, teamIds)
  return { person: exec, children: managerBranch ? [managerBranch] : [] }
}

export function getLeadershipPeople() {
  const topLeaderIds = ['coo-1', 'cto-1', 'ciso-1', 'web-dev-1', 'cfo-1', 'chro-1', 'cmo-1']
  return ['ceo-1', ...topLeaderIds].map((id) => getPersonById(id)).filter(Boolean)
}

export function getLeadershipGroups() {
  const execsWithTeams = ['cto-1', 'ciso-1', 'cmo-1']

  return execsWithTeams
    .map((leaderId) => {
      const leader = getPersonById(leaderId)
      const teams = orgTeams.filter((team) => team.execId === leaderId)
      return { leader, teams }
    })
    .filter((group) => group.leader && (group.teams || []).length)
}