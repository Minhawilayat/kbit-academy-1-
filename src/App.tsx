import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  Server, 
  Cpu, 
  Globe, 
  Mail, 
  Phone, 
  Facebook, 
  Youtube, 
  Instagram, 
  ChevronRight, 
  CheckCircle2, 
  Users, 
  Award,
  Menu,
  X,
  ArrowRight,
  Send,
  Loader2,
  Bot,
  Calendar,
  Clock,
  ShieldCheck,
  ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate, useLocation } from 'react-router-dom';

// Initialize Gemini
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const COURSE_DATA = [
  {
    id: 'mcse',
    title: 'MCSE Certification',
    description: 'Master Microsoft Server infrastructure and cloud solutions with our comprehensive MCSE track.',
    icon: <Server className="text-accent" size={32} />,
    tag: 'Infrastructure',
    fullDescription: 'The Microsoft Certified Solutions Expert (MCSE) certification validates that you have the skills needed to run a highly efficient and modern data center, with expertise in identity management, systems management, virtualization, storage, and networking.',
    duration: '6 Months',
    level: 'Advanced',
    modules: [
      'Installing and Configuring Windows Server 2022',
      'Administering Windows Server 2022',
      'Configuring Advanced Windows Server Services',
      'Designing and Implementing a Server Infrastructure',
      'Implementing an Advanced Server Infrastructure'
    ]
  },
  {
    id: 'vmware',
    title: 'VMware vSphere 8',
    description: 'Learn the industry-standard virtualization platform. Install, configure, and manage vSphere 8.',
    icon: <Cpu className="text-accent" size={32} />,
    tag: 'Virtualization',
    fullDescription: 'This course explores installation, configuration, and management of VMware vSphere 8, which consists of VMware ESXi 8.0 and VMware vCenter Server 8.0. This course prepares you to administer a vSphere infrastructure for an organization of any size.',
    duration: '3 Months',
    level: 'Intermediate',
    modules: [
      'Introduction to vSphere and the Software-Defined Data Center',
      'Creating Virtual Machines',
      'vCenter Server Architecture',
      'Configuring and Managing Virtual Networks',
      'Configuring and Managing Virtual Storage'
    ]
  },
  {
    id: 'ccna',
    title: 'Cisco CCNA',
    description: 'Build a strong foundation in networking, security, and automation with Cisco certified training.',
    icon: <Globe className="text-accent" size={32} />,
    tag: 'Networking',
    fullDescription: 'The Cisco Certified Network Associate (CCNA) certification program provides a foundation for a career in networking. It covers a broad range of fundamentals based on the latest technologies, software development skills, and job roles.',
    duration: '4 Months',
    level: 'Beginner to Intermediate',
    modules: [
      'Network Fundamentals',
      'Network Access',
      'IP Connectivity',
      'IP Services',
      'Security Fundamentals',
      'Automation and Programmability'
    ]
  },
  {
    id: 'cyber-security',
    title: 'Cyber Security',
    description: 'Protect digital assets and learn ethical hacking, network defense, and security protocols.',
    icon: <CheckCircle2 className="text-accent" size={32} />,
    tag: 'Security',
    fullDescription: 'Our Cyber Security program is designed to provide you with the skills and knowledge necessary to protect computer systems, networks, and data from digital attacks. You will learn about ethical hacking, risk management, and incident response.',
    duration: '5 Months',
    level: 'Intermediate to Advanced',
    modules: [
      'Introduction to Cybersecurity',
      'Network Security and Defense',
      'Ethical Hacking and Penetration Testing',
      'Digital Forensics and Incident Response',
      'Cloud Security and Compliance'
    ]
  }
];

// Utility for smooth scrolling with offset
const scrollToId = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    const headerOffset = 80;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
  }
};

const Nav = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Courses', href: '/#courses' },
    { name: 'About Us', href: '/#about' },
    { name: 'Contact', href: '/#contact' },
  ];

  const handleLinkClick = (href: string) => {
    setIsMobileMenuOpen(false);
    if (href.startsWith('/#')) {
      const id = href.substring(2);
      if (isHome) {
        scrollToId(id);
      }
    } else if (href === '/' && isHome) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || !isHome ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-12 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">KB</div>
          <span className="text-2xl font-bold tracking-tight text-primary">KBIT Academy</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.href} 
              onClick={() => handleLinkClick(link.href)}
              className="text-sm font-medium text-slate-600 hover:text-accent transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/enroll" className="btn-primary py-2 text-sm">Get Started</Link>
          </motion.div>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-primary" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white border-b border-slate-100 p-6 flex flex-col gap-4 md:hidden"
          >
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.href} 
                className="text-lg font-medium text-slate-600"
                onClick={() => handleLinkClick(link.href)}
              >
                {link.name}
              </Link>
            ))}
            <Link to="/enroll" onClick={() => setIsMobileMenuOpen(false)} className="btn-primary w-full text-center">Get Started</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-slate-50 rounded-bl-[100px]" />
      
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider mb-6">
            <Award size={14} />
            Global Certification Standards
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold leading-[1.1] mb-6 text-primary">
            Empowering the <span className="text-accent">Next Generation</span> of IT Professionals.
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed">
            KBIT Academy blends hands-on learning with global certification standards to prepare you for the evolving digital landscape.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link 
              to="/#courses" 
              onClick={() => scrollToId('courses')}
              className="btn-primary flex items-center gap-2"
            >
              Explore Courses <ArrowRight size={18} />
            </Link>
            <Link 
              to="/#about" 
              onClick={() => scrollToId('about')}
              className="btn-secondary"
            >
              Learn More
            </Link>
          </div>
          
          <button 
            onClick={() => scrollToId('about')}
            className="mt-12 flex items-center gap-8 group cursor-pointer text-left"
          >
            <div className="flex -space-x-3">
              {[
                "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop"
              ].map((url, i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden transition-transform group-hover:scale-110" style={{ transitionDelay: `${i * 50}ms` }}>
                  <img src={url} alt="student" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              ))}
            </div>
            <div>
              <p className="text-sm font-bold text-primary">500+ Students</p>
              <p className="text-xs text-slate-500">Already certified & working</p>
            </div>
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
          className="relative"
        >
          <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
            <img 
              src="https://picsum.photos/seed/it-training/800/600" 
              alt="IT Training" 
              className="w-full h-auto"
              referrerPolicy="no-referrer"
            />
          </div>
          {/* Decorative elements */}
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-accent/20 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -right-12 transform -translate-y-1/2 glass-card p-4 rounded-2xl shadow-xl hidden md:block">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-primary">Hands-on Labs</p>
                <p className="text-[10px] text-slate-500">Real-world scenarios</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Stats = () => {
  const stats = [
    { label: 'Courses Offered', value: '25+', id: 'courses' },
    { label: 'Certified Students', value: '1,200+', id: 'about' },
    { label: 'Expert Trainers', value: '15+', id: 'about' },
    { label: 'Success Rate', value: '98%', id: 'about' },
  ];

  return (
    <section className="py-12 bg-primary text-white">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
        {stats.map((stat, index) => (
          <motion.button 
            key={stat.label}
            onClick={() => scrollToId(stat.id)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            className="text-center hover:scale-105 transition-transform cursor-pointer"
          >
            <p className="text-4xl font-bold mb-1">{stat.value}</p>
            <p className="text-slate-400 text-sm uppercase tracking-wider">{stat.label}</p>
          </motion.button>
        ))}
      </div>
    </section>
  );
};

const Courses = () => {
  return (
    <section id="courses" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-primary mb-4">Our Featured Courses</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            We offer specialized training programs designed to meet global industry standards and help you achieve your career goals.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {COURSE_DATA.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 transition-all hover:shadow-xl"
            >
              <div className="mb-6">{course.icon}</div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-accent mb-2 block">{course.tag}</span>
              <h3 className="text-xl font-bold text-primary mb-3">{course.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                {course.description}
              </p>
              <Link to={`/course/${course.id}`} className="text-sm font-bold text-primary flex items-center gap-1 group">
                View Details <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const About = () => {
  return (
    <section id="about" className="py-24">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8 }}
          className="order-2 lg:order-1"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <img src="https://picsum.photos/seed/lab1/400/500" alt="Lab" className="rounded-2xl w-full h-64 object-cover" referrerPolicy="no-referrer" />
              <div className="bg-accent p-6 rounded-2xl text-white">
                <Users size={32} className="mb-4" />
                <p className="text-2xl font-bold">15+</p>
                <p className="text-xs opacity-80 uppercase tracking-widest">Expert Mentors</p>
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="bg-primary p-6 rounded-2xl text-white">
                <Award size={32} className="mb-4" />
                <p className="text-2xl font-bold">100%</p>
                <p className="text-xs opacity-80 uppercase tracking-widest">Global Standards</p>
              </div>
              <img src="https://picsum.photos/seed/lab2/400/500" alt="Lab" className="rounded-2xl w-full h-64 object-cover" referrerPolicy="no-referrer" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8 }}
          className="order-1 lg:order-2"
        >
          <h2 className="text-4xl font-bold text-primary mb-6">Why Choose KBIT?</h2>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            KBIT Academy is dedicated to bridging the gap between academic knowledge and industry requirements. Our initiative focuses on local talent development with international standards.
          </p>
          
          <ul className="space-y-4 mb-10">
            {[
              'Hands-on practical training in modern labs',
              'Curriculum aligned with global certifications',
              'Flexible schedules for working professionals',
              'Job placement assistance & career counseling'
            ].map((item, index) => (
              <motion.li 
                key={item} 
                initial={{ opacity: 0, x: 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                className="flex items-start gap-3"
              >
                <div className="mt-1 w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                  <CheckCircle2 size={14} />
                </div>
                <span className="text-slate-700 font-medium">{item}</span>
              </motion.li>
            ))}
          </ul>
          
          <Link 
            to="/#contact" 
            onClick={() => scrollToId('contact')}
            className="btn-primary inline-block"
          >
            Learn More About Us
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: 'Course Inquiry',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      await addDoc(collection(db, 'inquiries'), {
        ...formData,
        createdAt: new Date().toISOString()
      });
      setStatus('success');
      setFormData({ fullName: '', email: '', subject: 'Course Inquiry', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 1.0 }}
          className="bg-white rounded-[40px] shadow-xl overflow-hidden grid lg:grid-cols-5"
        >
          <div className="lg:col-span-2 bg-primary p-12 text-white">
            <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
            <p className="text-slate-400 mb-12">Have questions about our courses or certifications? Our team is here to help you.</p>
            
            <div className="space-y-8">
              {[
                { icon: <Mail size={20} />, label: 'Email Us', value: 'query@kbit.com.pk' },
                { icon: <Phone size={20} />, label: 'Call Us', value: '+92 346 9307175' },
                { icon: <Globe size={20} />, label: 'Location', value: 'Buner, Khyber Pakhtunkhwa, Pakistan' }
              ].map((item, index) => (
                <motion.div 
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-accent">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-widest">{item.label}</p>
                    <p className="font-bold">{item.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-16 flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors"><Facebook size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors"><Youtube size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors"><Instagram size={18} /></a>
            </div>
          </div>

          <div className="lg:col-span-3 p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary">Full Name</label>
                  <input 
                    required
                    type="text" 
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-accent transition-colors" 
                    placeholder="John Doe" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary">Email Address</label>
                  <input 
                    required
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-accent transition-colors" 
                    placeholder="john@example.com" 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-primary">Subject</label>
                <select 
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-accent transition-colors"
                >
                  <option>Course Inquiry</option>
                  <option>Certification Details</option>
                  <option>Admission Process</option>
                  <option>Other</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-primary">Message</label>
                <textarea 
                  required
                  rows={4} 
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-accent transition-colors" 
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              
              <button 
                disabled={status === 'loading'}
                className="btn-primary w-full py-4 flex items-center justify-center gap-2"
              >
                {status === 'loading' ? <Loader2 className="animate-spin" /> : 'Send Message'}
              </button>

              {status === 'success' && (
                <p className="text-green-600 text-sm font-medium text-center">Message sent successfully! We will contact you soon.</p>
              )}
              {status === 'error' && (
                <p className="text-red-600 text-sm font-medium text-center">Something went wrong. Please try again later.</p>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-primary text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-12 h-10 bg-accent rounded-lg flex items-center justify-center text-white font-bold text-xl">KB</div>
              <span className="text-2xl font-bold tracking-tight">KBIT Academy</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Empowering the next generation of IT professionals with hands-on learning and global certification standards.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-slate-400">
              <li><Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/#courses" onClick={() => scrollToId('courses')} className="hover:text-white transition-colors">Courses</Link></li>
              <li><Link to="/#about" onClick={() => scrollToId('about')} className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/#contact" onClick={() => scrollToId('contact')} className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Top Courses</h4>
            <ul className="space-y-4 text-slate-400">
              <li><Link to="/course/mcse" className="hover:text-white transition-colors">MCSE Training</Link></li>
              <li><Link to="/course/vmware" className="hover:text-white transition-colors">VMware vSphere 8</Link></li>
              <li><Link to="/course/ccna" className="hover:text-white transition-colors">Cisco CCNA</Link></li>
              <li><Link to="/course/cyber-security" className="hover:text-white transition-colors">Cyber Security</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Newsletter</h4>
            <p className="text-slate-400 mb-4">Stay updated with our latest courses and news.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Email" className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 w-full focus:outline-none focus:border-accent" />
              <button 
                onClick={() => alert('Thank you for subscribing to our newsletter!')}
                className="bg-accent p-2 rounded-lg hover:bg-accent/80 transition-colors"
              >
                <ChevronRight />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            Copyright © 2025 | KBIT Academy | All Rights Reserved.
          </p>
          <div className="flex gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const course = COURSE_DATA.find(c => c.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!course) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h2 className="text-2xl font-bold mb-4">Course not found</h2>
      <button onClick={() => navigate('/')} className="btn-primary">Back to Home</button>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.0 }}
      className="pt-32 pb-24"
    >
      <div className="max-w-7xl mx-auto px-6">
        <Link 
          to="/#courses"
          className="flex items-center gap-2 text-slate-500 hover:text-accent mb-8 transition-colors"
        >
          <ChevronLeft size={20} /> Back to Courses
        </Link>

        <div className="grid lg:grid-cols-3 gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.0, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider mb-6">
              {course.tag}
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-primary mb-6">{course.title}</h1>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed">{course.fullDescription}</p>

            <h3 className="text-2xl font-bold text-primary mb-6">Course Modules</h3>
            <div className="space-y-4">
              {course.modules.map((module, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + i * 0.15 }}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100"
                >
                  <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold text-sm">
                    {i + 1}
                  </div>
                  <span className="font-medium text-slate-700">{module}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.0, delay: 0.4 }}
            className="lg:col-span-1"
          >
            <div className="glass-card p-8 rounded-[32px] sticky top-32">
              <h3 className="text-xl font-bold text-primary mb-6">Course Overview</h3>
              <div className="space-y-6 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-accent">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-widest">Duration</p>
                    <p className="font-bold text-primary">{course.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-accent">
                    <Award size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-widest">Level</p>
                    <p className="font-bold text-primary">{course.level}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-accent">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-widest">Certification</p>
                    <p className="font-bold text-primary">Global Standard</p>
                  </div>
                </div>
              </div>
              <Link to="/enroll" className="btn-primary w-full block text-center mb-4">Enroll Now</Link>
              <p className="text-center text-xs text-slate-500">Limited seats available for the next batch.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const EnrollmentPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    course: 'MCSE Certification',
    phone: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await addDoc(collection(db, 'enrollments'), {
        studentName: formData.name,
        studentEmail: formData.email,
        courseTitle: formData.course,
        phone: formData.phone,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      setStatus('success');
    } catch (error) {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen pt-32 pb-24 flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center glass-card p-12 rounded-[40px]">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-3xl font-bold text-primary mb-4">Enrollment Received!</h2>
          <p className="text-slate-600 mb-8">Thank you for choosing KBIT Academy. Our admissions team will contact you within 24 hours to finalize your enrollment.</p>
          <Link to="/" className="btn-primary inline-block">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 1.2 }}
      className="min-h-screen pt-32 pb-24 px-6"
    >
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-4">Start Your IT Career</h1>
          <p className="text-slate-600">Fill out the form below to begin your journey with KBIT Academy.</p>
        </div>

        <div className="glass-card p-8 lg:p-12 rounded-[40px]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-primary">Full Name</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-accent transition-colors" 
                  placeholder="John Doe" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-primary">Email Address</label>
                <input 
                  required
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-accent transition-colors" 
                  placeholder="john@example.com" 
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-primary">Phone Number</label>
                <input 
                  required
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-accent transition-colors" 
                  placeholder="+92 3XX XXXXXXX" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-primary">Select Course</label>
                <select 
                  value={formData.course}
                  onChange={(e) => setFormData({...formData, course: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-accent transition-colors"
                >
                  {COURSE_DATA.map(c => (
                    <option key={c.id} value={c.title}>{c.title}</option>
                  ))}
                </select>
              </div>
            </div>

            <button 
              disabled={status === 'loading'}
              className="btn-primary w-full py-4 flex items-center justify-center gap-2"
            >
              {status === 'loading' ? <Loader2 className="animate-spin" /> : 'Submit Enrollment'}
            </button>
            
            {status === 'error' && (
              <p className="text-red-600 text-sm font-medium text-center">Something went wrong. Please try again later.</p>
            )}
          </form>
        </div>
      </div>
    </motion.div>
  );
};

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([
    { role: 'bot', text: 'Hello! I am your **KBIT AI Assistant**. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<any>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const initChat = () => {
    if (!chatRef.current) {
      const courseInfo = COURSE_DATA.map(c => 
        `${c.title} (${c.tag}): ${c.fullDescription}. Duration: ${c.duration}. Level: ${c.level}. Modules: ${c.modules.join(', ')}.`
      ).join('\n\n');

      chatRef.current = genAI.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: `You are the official IT Career Advisor for KBIT Academy (Khyber Institute of IT) in Buner. 
          Your goal is to provide SHORT, CLEAR, and professional information based ONLY on KBIT's offerings.
          
          KBIT Academy Details:
          - Location: Buner, Khyber Pakhtunkhwa, Pakistan.
          - Contact: query@kbit.com.pk | +92 346 9307175
          
          Available Courses:
          ${courseInfo}
          
          Formatting Guidelines:
          1. Use **Markdown** for all responses.
          2. Use **bold text** for course names and important details.
          3. Use *bullet points* for lists (like modules or contact info).
          4. Keep answers SHORT and CLEAR. Avoid long paragraphs.
          
          Response Guidelines:
          1. If a user greets you, welcome them to **KBIT Academy** and list the 4 main courses briefly.
          2. When asked about a course, provide:
             - A 1-sentence summary.
             - **Duration**: [X] Months.
             - **Modules**: [List 3-4 key modules].
          3. Encourage enrollment via the website's form.
          4. If you don't know something, ask them to contact KBIT directly at the provided phone or email.`,
        },
      });
    }
    return chatRef.current;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const chat = initChat();
      const result = await chat.sendMessage({ message: userMessage });
      
      const botResponse = result.text || "I'm sorry, I couldn't process that request.";
      setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'bot', text: "I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.8 }}
            className="absolute bottom-20 right-0 w-[calc(100vw-3rem)] sm:w-[400px] h-[500px] max-h-[calc(100vh-160px)] bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-primary p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-primary">
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className="text-white font-bold">KBIT Assistant</h3>
                  <p className="text-white/60 text-xs">Always online</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50"
            >
              {messages.map((msg, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-accent text-primary font-medium rounded-tr-none' 
                      : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-tl-none'
                  }`}>
                    <div className="markdown-content">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-slate-100">
                    <Loader2 className="animate-spin text-accent" size={16} />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-100">
              <div className="relative">
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about courses..."
                  className="w-full pl-4 pr-12 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-accent transition-colors text-sm"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-primary text-white rounded-full shadow-xl flex items-center justify-center hover:scale-105 transition-transform relative"
      >
        {isOpen ? <X size={28} /> : <Bot size={28} />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent rounded-full border-4 border-white"></span>
        )}
      </button>
    </div>
  );
};

const HomePage = () => {
  return (
    <>
      <Hero />
      <Stats />
      <Courses />
      <About />
      <Contact />
    </>
  );
};

export default function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Nav />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/course/:id" element={<CourseDetail />} />
            <Route path="/enroll" element={<EnrollmentPage />} />
          </Routes>
        </main>
        <Footer />
        <AIAssistant />
      </div>
    </Router>
  );
}

