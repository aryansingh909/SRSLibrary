import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CourseDetailPage from '@/components/course-detail';

const COURSES: Record<string, CourseData> = {
  bca: {
    code: 'BCA',
    name: 'Bachelor of Computer Applications',
    tagline: 'Launch Your Tech Career Today',
    description: 'BCA is a 3-year undergraduate program that equips you with in-demand skills in programming, software development, database management, networking, and IT fundamentals. The ideal launching pad for a career in technology.',
    duration: '3 Years (6 Semesters)',
    eligibility: '10+2 in any stream with minimum 45% marks',
    fee: '₹15,000 per year',
    university: 'Mangalayatan University',
    mode: '100% Online',
    approval: 'UGC Approved | DEB Recognized',
    color: 'from-blue-600 to-blue-800',
    image: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?w=1200&h=600&fit=crop',
    subjects: [
      'Programming in C & C++',
      'Data Structures & Algorithms',
      'Database Management System',
      'Web Technologies (HTML, CSS, JS)',
      'Computer Networks',
      'Software Engineering',
      'Python Programming',
      'Operating Systems',
      'Computer Organization',
      'Project Work',
    ],
    careers: [
      { title: 'Software Developer', salary: '₹4–12 LPA' },
      { title: 'Web Developer', salary: '₹3–10 LPA' },
      { title: 'Database Administrator', salary: '₹4–15 LPA' },
      { title: 'IT Analyst', salary: '₹4–12 LPA' },
      { title: 'System Administrator', salary: '₹3–8 LPA' },
      { title: 'App Developer', salary: '₹5–15 LPA' },
    ],
    faqs: [
      { q: 'Is BCA online degree valid for government jobs?', a: 'Yes. Degrees from UGC-recognized universities through the DEB are valid for government jobs and further education.' },
      { q: 'Can I pursue MCA after BCA online?', a: 'Absolutely. You can apply for MCA or any other PG program with a BCA from Mangalayatan University.' },
      { q: 'Is there any entrance exam?', a: 'No entrance exam required. Admission is merit-based on your 12th marks.' },
    ],
  },
  bba: {
    code: 'BBA',
    name: 'Bachelor of Business Administration',
    tagline: 'Build the Business Leader Within You',
    description: 'BBA is a 3-year undergraduate program providing a comprehensive business education. Covering management principles, marketing, finance, human resources, and entrepreneurship — it prepares you for a dynamic corporate career.',
    duration: '3 Years (6 Semesters)',
    eligibility: '10+2 in any stream with minimum 45% marks',
    fee: '₹14,000 per year',
    university: 'Mangalayatan University',
    mode: '100% Online',
    approval: 'UGC Approved | DEB Recognized',
    color: 'from-emerald-600 to-emerald-800',
    image: 'https://images.pexels.com/photos/3184328/pexels-photo-3184328.jpeg?w=1200&h=600&fit=crop',
    subjects: [
      'Principles of Management',
      'Business Economics',
      'Financial Accounting',
      'Marketing Management',
      'Human Resource Management',
      'Business Law',
      'Organizational Behavior',
      'Business Communication',
      'Entrepreneurship',
      'Strategic Management',
    ],
    careers: [
      { title: 'Business Manager', salary: '₹4–12 LPA' },
      { title: 'Marketing Executive', salary: '₹3–10 LPA' },
      { title: 'HR Manager', salary: '₹4–12 LPA' },
      { title: 'Sales Manager', salary: '₹4–15 LPA' },
      { title: 'Entrepreneur', salary: 'Unlimited' },
      { title: 'Operations Manager', salary: '₹5–14 LPA' },
    ],
    faqs: [
      { q: 'Is BBA online degree accepted by companies?', a: 'Yes. DEB-recognized online degrees are treated as equivalent to regular degrees by AICTE and UGC guidelines.' },
      { q: 'Can I do MBA after online BBA?', a: 'Absolutely. BBA from Mangalayatan University is a valid qualification for MBA admission.' },
      { q: 'Is there any internship requirement?', a: 'There is a project/internship component in the final year which can be done at any organization.' },
    ],
  },
  ba: {
    code: 'BA',
    name: 'Bachelor of Arts',
    tagline: 'Unlock Limitless Career Paths',
    description: 'BA is a versatile 3-year undergraduate program in humanities and social sciences. Covering subjects like History, Political Science, Economics, Psychology, and Languages — it is the foundation for civil services, education, journalism, and many more careers.',
    duration: '3 Years (6 Semesters)',
    eligibility: '10+2 in any stream with minimum 45% marks',
    fee: '₹12,000 per year',
    university: 'Mangalayatan University',
    mode: '100% Online',
    approval: 'UGC Approved | DEB Recognized',
    color: 'from-amber-600 to-orange-700',
    image: 'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?w=1200&h=600&fit=crop',
    subjects: [
      'History of India',
      'Political Science',
      'Economics',
      'Sociology',
      'English Literature',
      'Psychology',
      'Geography',
      'Environmental Studies',
      'Hindi/Regional Language',
      'Social Research Methods',
    ],
    careers: [
      { title: 'Civil Services (IAS/IPS/IFS)', salary: 'Govt Pay Scale' },
      { title: 'Journalist / Editor', salary: '₹3–10 LPA' },
      { title: 'School Teacher', salary: '₹3–8 LPA' },
      { title: 'Content Writer', salary: '₹3–10 LPA' },
      { title: 'NGO / Social Worker', salary: '₹2–6 LPA' },
      { title: 'Research Analyst', salary: '₹4–10 LPA' },
    ],
    faqs: [
      { q: 'Is BA online valid for UPSC/SSC?', a: 'Yes. UGC-approved online degrees are accepted for all government competitive exams including UPSC, SSC, and State PSCs.' },
      { q: 'Can I do LLB after BA online?', a: 'Yes. BA online from a UGC-recognized university qualifies you for LLB admission at most law colleges.' },
      { q: 'Which subjects are available in BA?', a: 'Mangalayatan University offers multiple subject combinations including History, Political Science, Economics, Sociology, and English.' },
    ],
  },
  mba: {
    code: 'MBA',
    name: 'Master of Business Administration',
    tagline: 'Lead. Strategize. Transform.',
    description: 'MBA is a 2-year postgraduate program that transforms you into a business leader. Covering advanced management, strategy, finance, marketing, and leadership — it is the degree that opens C-suite doors and accelerates your career trajectory.',
    duration: '2 Years (4 Semesters)',
    eligibility: 'Graduation in any stream with minimum 50% marks',
    fee: '₹20,000 per year',
    university: 'Mangalayatan University',
    mode: '100% Online',
    approval: 'UGC Approved | DEB Recognized',
    color: 'from-rose-600 to-red-800',
    image: 'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?w=1200&h=600&fit=crop',
    subjects: [
      'Strategic Management',
      'Financial Management',
      'Marketing Management',
      'Operations Management',
      'Human Resource Management',
      'Business Analytics',
      'Corporate Governance',
      'International Business',
      'Entrepreneurship & Innovation',
      'Dissertation/Project',
    ],
    careers: [
      { title: 'General Manager / CEO', salary: '₹15–50 LPA' },
      { title: 'Management Consultant', salary: '₹10–30 LPA' },
      { title: 'Finance Manager / CFO', salary: '₹12–40 LPA' },
      { title: 'Marketing Head / CMO', salary: '₹10–30 LPA' },
      { title: 'HR Director / CHRO', salary: '₹10–25 LPA' },
      { title: 'Business Development Head', salary: '₹8–25 LPA' },
    ],
    faqs: [
      { q: 'Is online MBA as valuable as a regular MBA?', a: 'Online MBA from a UGC-recognized university is treated as equivalent. Many top companies now actively recruit online MBA graduates.' },
      { q: 'What specializations are available?', a: 'Finance, Marketing, HR, Operations, International Business, and Business Analytics are available as specialization tracks.' },
      { q: 'Can I do PhD after online MBA?', a: 'Yes. MBA from Mangalayatan University qualifies you for Ph.D. and M.Phil. programs at recognized universities.' },
    ],
  },
  ma: {
    code: 'MA',
    name: 'Master of Arts',
    tagline: 'Deepen Your Knowledge, Expand Your Horizon',
    description: 'MA is a 2-year postgraduate program in humanities and social sciences. Ideal for those pursuing teaching, research, civil services, and specialized careers in content, journalism, counselling, and policy-making.',
    duration: '2 Years (4 Semesters)',
    eligibility: 'BA or equivalent graduation with minimum 50% marks',
    fee: '₹13,000 per year',
    university: 'Mangalayatan University',
    mode: '100% Online',
    approval: 'UGC Approved | DEB Recognized',
    color: 'from-purple-600 to-violet-800',
    image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?w=1200&h=600&fit=crop',
    subjects: [
      'Advanced Political Theory',
      'Contemporary History',
      'Research Methodology',
      'Economics Theory',
      'Sociology of Development',
      'Public Policy Analysis',
      'Comparative Literature',
      'Gender Studies',
      'Philosophy & Ethics',
      'Dissertation',
    ],
    careers: [
      { title: 'University Lecturer / Professor', salary: '₹4–12 LPA' },
      { title: 'Civil Services Officer', salary: 'Govt Pay Scale' },
      { title: 'Research Analyst / Scholar', salary: '₹4–10 LPA' },
      { title: 'Journalist / Editor', salary: '₹4–12 LPA' },
      { title: 'Policy Advisor / NGO', salary: '₹4–10 LPA' },
      { title: 'Content Specialist', salary: '₹4–12 LPA' },
    ],
    faqs: [
      { q: 'Can I do NET/SET after MA online?', a: 'Yes. UGC-approved MA qualifies you to appear in UGC-NET, SLET, and other teaching eligibility tests.' },
      { q: 'Is MA online valid for PhD admission?', a: 'Yes. MA from Mangalayatan University is a valid qualification for Ph.D. programs at recognized universities.' },
      { q: 'Which subjects are available in MA?', a: 'History, Political Science, Economics, Sociology, English, and Hindi are popular subjects in MA at Mangalayatan University.' },
    ],
  },
  mcom: {
    code: 'M.Com',
    name: 'Master of Commerce',
    tagline: 'Master Finance. Command Careers.',
    description: 'M.Com is a 2-year postgraduate program providing advanced knowledge in commerce, accounting, finance, and taxation. Perfect for professionals seeking advanced positions in accounting, finance management, CA/CMA preparation, and academia.',
    duration: '2 Years (4 Semesters)',
    eligibility: 'B.Com or equivalent graduation with minimum 50% marks',
    fee: '₹14,000 per year',
    university: 'Mangalayatan University',
    mode: '100% Online',
    approval: 'UGC Approved | DEB Recognized',
    color: 'from-cyan-600 to-teal-800',
    image: 'https://images.pexels.com/photos/50987/money-card-business-credit-card-50987.jpeg?w=1200&h=600&fit=crop',
    subjects: [
      'Advanced Financial Accounting',
      'Corporate Tax Laws',
      'Business Statistics',
      'Strategic Financial Management',
      'Auditing & Assurance',
      'International Finance',
      'Banking & Insurance',
      'E-Commerce',
      'Research Methodology',
      'Dissertation',
    ],
    careers: [
      { title: 'CA / CMA Preparation', salary: '₹6–25 LPA' },
      { title: 'Tax Consultant / CA', salary: '₹5–20 LPA' },
      { title: 'Finance Manager / CFO', salary: '₹8–30 LPA' },
      { title: 'Auditor / Internal Auditor', salary: '₹5–15 LPA' },
      { title: 'Commerce Lecturer', salary: '₹4–10 LPA' },
      { title: 'Investment Analyst', salary: '₹6–20 LPA' },
    ],
    faqs: [
      { q: 'Is M.Com online valid for NET/SET?', a: 'Yes. M.Com from a UGC-recognized university qualifies you for UGC-NET Commerce and Economic Sciences.' },
      { q: 'Can I do CA after M.Com online?', a: 'Yes. M.Com provides exemptions in some papers of ICAI CA exam and strengthens your foundation for CA.' },
      { q: 'Is there any practical training requirement?', a: 'There is a dissertation/project work in the second year that can be completed based on industry research.' },
    ],
  },
};

export interface CourseData {
  code: string;
  name: string;
  tagline: string;
  description: string;
  duration: string;
  eligibility: string;
  fee: string;
  university: string;
  mode: string;
  approval: string;
  color: string;
  image: string;
  subjects: string[];
  careers: { title: string; salary: string }[];
  faqs: { q: string; a: string }[];
}

export function generateStaticParams() {
  return Object.keys(COURSES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const course = COURSES[params.slug];
  if (!course) return {};
  return {
    title: `${course.code} Online Degree — ${course.name} | SRS Library`,
    description: `${course.description.slice(0, 160)} Apply now through Mangalayatan University. UGC Approved.`,
  };
}

export default function CoursePage({ params }: { params: { slug: string } }) {
  const course = COURSES[params.slug];
  if (!course) notFound();
  return <CourseDetailPage course={course} />;
}
