import {
  FaBullhorn,
  FaCertificate,
  FaCode,
  FaNetworkWired,
  FaShieldAlt,
} from 'react-icons/fa'

export const courses = [
  {
    slug: 'web-development',
    name: 'Web Development',
    icon: FaCode,
    fee: 'PKR 45,000',
    duration: '4 Months',
    frequency: '3 Classes / Week',
    level: 'Beginner to Intermediate',
    description:
      'Master frontend and backend development with practical projects that prepare you for freelance and job roles.',
    learn: [
      'Responsive UI with React and Tailwind CSS',
      'REST APIs with Node.js and Express',
      'Git, deployment, and portfolio projects',
    ],
    tools: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'MongoDB'],
    audience: 'Students, freelancers, and career switchers',
    outcome: 'Frontend Developer, Full Stack Developer, Freelance Web Developer',
  },
  {
    slug: 'cybersecurity',
    name: 'Cybersecurity',
    icon: FaShieldAlt,
    fee: 'PKR 60,000',
    duration: '3 Months',
    frequency: '3 Classes / Week',
    level: 'Beginner to Advanced',
    description:
      'Build practical cyber defense skills with labs, threat simulation, and real-world security workflows.',
    learn: [
      'Security fundamentals and network defense',
      'Vulnerability assessment and hardening',
      'SOC workflow and incident response basics',
    ],
    tools: ['Wireshark', 'Kali Linux', 'Nmap', 'Burp Suite'],
    audience: 'Learners interested in cyber careers and security operations',
    outcome: 'SOC Analyst, Security Analyst, Junior Penetration Tester',
  },
  {
    slug: 'digital-marketing',
    name: 'Digital Marketing',
    icon: FaBullhorn,
    fee: 'PKR 30,000',
    duration: '2.5 Months',
    frequency: '3 Classes / Week',
    level: 'Beginner',
    description:
      'Learn high-converting digital marketing systems for business growth, freelance services, and brand scaling.',
    learn: [
      'Performance marketing fundamentals',
      'Content strategy and funnels',
      'Ad campaign setup and optimization',
    ],
    tools: ['Meta Ads', 'Google Ads', 'Analytics', 'Canva'],
    audience: 'Freelancers, startups, and students exploring marketing careers',
    outcome: 'Digital Marketer, Performance Marketer, Growth Freelancer',
  },
  {
    slug: 'ccna',
    name: 'CCNA',
    icon: FaNetworkWired,
    fee: 'PKR 35,000',
    duration: '3 Months',
    frequency: '3 Classes / Week',
    level: 'Intermediate',
    description:
      'Get practical networking knowledge aligned with modern infrastructure and CCNA preparation goals.',
    learn: [
      'Routing and switching',
      'IP addressing and network troubleshooting',
      'Lab configuration and exam readiness',
    ],
    tools: ['Cisco Packet Tracer', 'Subnetting', 'Switching', 'Routing'],
    audience: 'Networking and IT support aspirants',
    outcome: 'Network Support Engineer, NOC Technician',
  },
  {
    slug: 'ceh',
    name: 'CEH',
    icon: FaCertificate,
    fee: 'PKR 70,000',
    duration: '4 Months',
    frequency: '3 Classes / Week',
    level: 'Advanced',
    description:
      'Prepare for advanced ethical hacking workflows and CEH-aligned practical attack-defense simulations.',
    learn: [
      'Ethical hacking lifecycle',
      'Web and network exploitation basics',
      'Reporting, remediation, and security posture',
    ],
    tools: ['Kali Linux', 'Metasploit', 'OWASP Top 10', 'Burp Suite'],
    audience: 'Intermediate learners targeting ethical hacking roles',
    outcome: 'Ethical Hacking Analyst, Security Operations Specialist',
  },
]

export const faqs = [
  {
    question: 'Are classes live or recorded?',
    answer:
      'Core classes are delivered live online with mentor support. Session recordings are provided for revision.',
  },
  {
    question: 'What is the duration of each course?',
    answer:
      'Programs range from 2 to 4 months depending on the course depth and specialization track.',
  },
  {
    question: 'Do you provide certificates?',
    answer:
      'Yes, completion certificates are awarded after assessments and practical project submissions.',
  },
  {
    question: 'Are classes available in Urdu/Hindi?',
    answer:
      'Yes, teaching is designed to stay clear and accessible with easy English plus Urdu/Hindi support.',
  },
  {
    question: 'Can beginners join?',
    answer:
      'Absolutely. We have beginner-friendly pathways with mentorship and structured project milestones.',
  },
  // 'Is this online?' and 'How do I enroll?' removed per request
]

export const testimonials = [
  {
    name: 'Areeba Khan',
    role: 'CS Student · Lahore',
    quote:
      'The practical projects made me job-ready fast. I landed my first internship after the Web Development track.',
  },
  {
    name: 'Noman Ali',
    role: 'Freelancer · Karachi',
    quote:
      'Cybersecurity sessions were clear and professional. Labs were hands-on and mapped to real scenarios.',
  },
  {
    name: 'Arjun Mehta',
    role: 'Career Switcher · Delhi',
    quote:
      'I moved into digital marketing confidently because of the structured roadmap and weekly mentorship.',
  },
  {
    name: 'Sara Malik',
    role: 'Freelancer · Islamabad',
    quote: 'After the Web track I got consistent freelance clients — the portfolio projects helped a lot.',
  },
  {
    name: 'Bilal Shah',
    role: 'Junior Dev · Rawalpindi',
    quote: 'Mentors review code thoroughly and give practical tips that employers value.',
  },
  {
    name: 'Priya Singh',
    role: 'Marketing Executive · Mumbai',
    quote: 'The digital marketing modules are actionable — I doubled lead conversions for my campaign.',
  },
  {
    name: 'Usman Riaz',
    role: 'Network Engineer · Lahore',
    quote: 'CCNA labs and exam tips made the certification achievable within months.',
  },
  {
    name: 'Hina Qureshi',
    role: 'Career Switcher · Karachi',
    quote: 'Supportive community and practical assignments made switching careers realistic for me.',
  },
  {
    name: 'Rahul Kapoor',
    role: 'Freelancer · Delhi',
    quote: 'Hands-on workshops helped me sell cyber security audits as a service to clients.',
  },
  {
    name: 'Zainab Ahmed',
    role: 'Student · Peshawar',
    quote: 'Clear lessons and weekly milestones kept me motivated — finished the course on time.',
  },
  {
    name: 'Sana Fatima',
    role: 'Junior Marketer · Karachi',
    quote: 'The digital marketing course gave me the confidence to apply for jobs and freelance gigs.',
  },
  {
    name: 'Rohit Verma',
    role: 'Ethical Hacker · Mumbai',
    quote: 'CEH-aligned labs and mentorship helped me prepare for the certification and real-world hacking.',
  },
  {   name: 'Ayesha Siddiqui',
    role: 'CS Student · Lahore',
    quote:
      'The practical projects made me job-ready fast. I landed my first internship after the Web Development track.',
  },
]
