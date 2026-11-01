// Edit this file to personalize the portfolio. Links set to null render as "Coming soon".

export const profile = {
  name: 'Gilang',
  role: 'Informatics Engineering Student',
  email: 'your.email@example.com',
  github: 'https://github.com/your-username',
  linkedin: 'https://www.linkedin.com/in/your-username',
  location: 'Indonesia',
}

export const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
] as const

export type SkillIcon =
  | 'html'
  | 'css'
  | 'javascript'
  | 'react'
  | 'php'
  | 'node'
  | 'mysql'
  | 'postgresql'
  | 'supabase'
  | 'git'
  | 'github'
  | 'vscode'

export const skillGroups: {
  title: string
  description: string
  skills: { name: string; icon: SkillIcon }[]
}[] = [
  {
    title: 'Frontend Development',
    description: 'Building responsive, accessible and animated interfaces.',
    skills: [
      { name: 'HTML', icon: 'html' },
      { name: 'CSS', icon: 'css' },
      { name: 'JavaScript', icon: 'javascript' },
      { name: 'React', icon: 'react' },
    ],
  },
  {
    title: 'Backend Development',
    description: 'Server logic, APIs and authentication flows.',
    skills: [
      { name: 'PHP', icon: 'php' },
      { name: 'Node.js', icon: 'node' },
    ],
  },
  {
    title: 'Database',
    description: 'Relational modeling, SQL queries and managed databases.',
    skills: [
      { name: 'MySQL', icon: 'mysql' },
      { name: 'PostgreSQL', icon: 'postgresql' },
      { name: 'Supabase', icon: 'supabase' },
    ],
  },
  {
    title: 'Tools',
    description: 'Version control and a productive dev workflow.',
    skills: [
      { name: 'Git', icon: 'git' },
      { name: 'GitHub', icon: 'github' },
      { name: 'VS Code', icon: 'vscode' },
    ],
  },
]

export type Project = {
  id: string
  index: string
  title: string
  description: string
  image: string
  tech: string[]
  liveUrl: string | null
  sourceUrl: string | null
}

export const projects: Project[] = [
  {
    id: 'showrum',
    index: '01',
    title: 'Showrum v8 Automobile',
    description:
      'A car showroom website featuring a vehicle catalog, search and filtering, user authentication, and an admin dashboard for managing listings.',
    image: '/images/project-showroom.png',
    tech: ['PHP', 'MySQL', 'JavaScript', 'CSS'],
    liveUrl: null,
    sourceUrl: null,
  },
  {
    id: 'dbms',
    index: '02',
    title: 'Database Management System',
    description:
      'A database management project focused on normalized table relations, constraints, and practical SQL queries for reporting.',
    image: '/images/project-database.png',
    tech: ['PostgreSQL', 'SQL', 'ERD'],
    liveUrl: null,
    sourceUrl: null,
  },
  {
    id: 'interactive',
    index: '03',
    title: 'Interactive Web Application',
    description:
      'A web application with a modern, interactive interface, smooth motion design, and reusable component architecture.',
    image: '/images/project-interactive.png',
    tech: ['React', 'Node.js', 'Supabase'],
    liveUrl: null,
    sourceUrl: null,
  },
]

export const timeline: {
  type: 'education' | 'experience'
  period: string
  title: string
  place: string
  description: string
}[] = [
  {
    type: 'education',
    period: '20XX — Present',
    title: 'Bachelor of Informatics Engineering',
    place: 'Your University Name',
    description:
      'Studying software engineering, data structures, database systems and human-computer interaction.',
  },
  {
    type: 'experience',
    period: '20XX',
    title: 'Showrum v8 Automobile',
    place: 'Personal / Academic Project',
    description:
      'Designed and built a full showroom website with catalog, search, authentication and an admin dashboard.',
  },
  {
    type: 'experience',
    period: '20XX',
    title: 'Database Systems Project',
    place: 'Course Project',
    description:
      'Modeled a relational schema, implemented table relations and wrote SQL queries for real-world scenarios.',
  },
  {
    type: 'education',
    period: '20XX — 20XX',
    title: 'Senior High School',
    place: 'Your School Name',
    description: 'Focused on mathematics and science; first exposure to programming.',
  },
]
