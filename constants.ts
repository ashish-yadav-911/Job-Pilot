import { Job, JobType } from './types';

export const MOCK_JOBS: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Engineer',
    company: 'TechFlow Solutions',
    location: 'Remote',
    type: JobType.FULL_TIME,
    salaryRange: '$120k - $160k',
    description: 'We are looking for a React expert to lead our frontend team. You will be responsible for architecture and mentorship.',
    requirements: ['React', 'TypeScript', 'Tailwind CSS', '5+ years experience'],
    tags: ['React', 'TypeScript', 'Frontend', 'Web Design'],
    postedAt: '2 days ago',
    experienceRequired: 5,
    noticePeriod: 30,
    customQuestions: []
  },
  {
    id: '2',
    title: 'Python Backend Developer',
    company: 'DataStream Inc',
    location: 'New York, NY',
    type: JobType.FULL_TIME,
    salaryRange: '$110k - $150k',
    description: 'Build robust APIs using Python and Django. Experience with large scale data processing is a plus.',
    requirements: ['Python', 'Django', 'PostgreSQL', 'Redis'],
    tags: ['Python', 'Django', 'Backend', 'SQL'],
    postedAt: '1 day ago',
    experienceRequired: 3,
    noticePeriod: 'Immediate',
    customQuestions: [
      { id: 'q1', question: 'Do you have experience with Celery?', required: true }
    ]
  },
  {
    id: '3',
    title: 'AI/ML Intern',
    company: 'FutureMind AI',
    location: 'San Francisco, CA',
    type: JobType.INTERNSHIP,
    salaryRange: '$40/hr',
    description: 'Join our research team to work on LLM fine-tuning and evaluation pipelines.',
    requirements: ['Python', 'PyTorch', 'Basic ML knowledge'],
    tags: ['Python', 'Machine Learning', 'LLM', 'AI', 'OpenAI'],
    postedAt: '4 hours ago',
    experienceRequired: 0,
    noticePeriod: 'Immediate',
    customQuestions: []
  },
  {
    id: '4',
    title: 'Product Marketing Manager',
    company: 'GrowthRocket',
    location: 'Austin, TX',
    type: JobType.FULL_TIME,
    salaryRange: '$90k - $120k',
    description: 'Drive the go-to-market strategy for our new SaaS product line.',
    requirements: ['Marketing Strategy', 'Content Writing', 'SEO', 'Analytics'],
    tags: ['Marketing', 'SEO', 'Content', 'SaaS'],
    postedAt: '3 days ago',
    experienceRequired: 4,
    noticePeriod: 60,
    customQuestions: [
      { id: 'q2', question: 'Link to your writing portfolio', required: true }
    ]
  },
  {
    id: '5',
    title: 'DevOps Engineer',
    company: 'CloudScale',
    location: 'Remote',
    type: JobType.CONTRACT,
    salaryRange: '$80 - $120 / hr',
    description: 'Maintain and improve our Kubernetes infrastructure and CI/CD pipelines.',
    requirements: ['AWS', 'Kubernetes', 'Terraform', 'Jenkins'],
    tags: ['AWS', 'DevOps', 'Kubernetes', 'Cloud'],
    postedAt: '1 week ago',
    experienceRequired: 5,
    noticePeriod: 15,
    customQuestions: []
  }
];

export const DEFAULT_RESUME = `
Jane Doe
Software Engineer
Summary: Passionate developer with 4 years of experience building scalable web applications. Loves React and Python.
Skills: JavaScript, TypeScript, React, Python, Node.js, SQL.
Experience:
- Frontend Dev at StartUp Inc (2021-Present): Built dashboard using React.
- Junior Dev at Legacy Corp (2019-2021): Maintained internal tools.
`;
