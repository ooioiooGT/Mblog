import React from 'react';
import { Mail, Github, Linkedin, Briefcase, GraduationCap, MapPin, Phone, Code, CheckCircle2, Award, Zap, Globe } from 'lucide-react';
import { Button } from './Button';
import profilePic from '../src/IMG_7414.JPG';;

// Assuming the image is in the same directory or project root as per instructions
// Using a high-quality placeholder that matches your professional headshot for immediate visual impact
const PROFILE_IMAGE = profilePic;

export const About: React.FC = () => {
  const skills = [
    "IT Project Management & Leadership",
    "End-User Computing Device Lifecycle",
    "Backend Development (PHP, JS, Python)",
    "Continuous Improvement & Optimization",
    "Version Control (Github)",
    "Cloud Services (GCP, AWS)",
    "Agile & Scrum Methodologies",
    "RESTful API Integration"
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 sm:py-20 animate-in fade-in duration-700">
      {/* Executive Hero Section */}
      <div className="relative mb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-indigo-500/10 to-transparent rounded-[2.5rem] -rotate-1 transform scale-[1.02] blur-xl"></div>
        <div className="relative bg-white/80 backdrop-blur-2xl border border-white/40 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row items-stretch">
          
          {/* Portrait Image Container - Optimized for high-end professional headshots */}
          <div className="md:w-[42%] bg-slate-900/5 flex items-center justify-center p-6 sm:p-12 lg:p-16">
            <div className="relative group w-full">
              <div className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl border-[8px] border-white transform transition-all duration-700 group-hover:scale-[1.02] group-hover:-rotate-1">
                <img 
                  src={PROFILE_IMAGE}
                  alt="Kuan Hsueh Chen" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              
              {/* Floating Status Badge */}
              <div className="absolute -bottom-4 -right-4 bg-blue-600 text-white p-4 rounded-2xl shadow-2xl border-4 border-white transform transition-all duration-500 group-hover:translate-x-1 group-hover:-translate-y-1">
                <div className="flex items-center gap-2">
                  <Code className="w-6 h-6" />
                  <span className="text-[10px] font-black uppercase tracking-widest hidden group-hover:block transition-all">Engineer</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Content */}
          <div className="md:w-[58%] p-8 md:p-14 lg:p-20 flex flex-col justify-center">
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-600/20">
                  <Zap className="w-3 h-3 fill-current" /> Engineering Specialist
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-blue-100 to-transparent"></div>
              </div>
              
              <div className="space-y-2">
                <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-[0.85]">
                  Kuan Hsueh <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Chen</span>
                </h1>
              </div>
              
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-medium max-w-lg">
                Driving technical excellence through backend architecture, system optimization, and strategic IT leadership. 
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8 border-t border-gray-100/50">
                <div className="flex items-center gap-4 group/item">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover/item:bg-blue-600 group-hover/item:text-white transition-all duration-300">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Location</span>
                    <span className="text-sm font-bold text-gray-700">Lehi, Utah</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 group/item">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover/item:bg-blue-600 group-hover/item:text-white transition-all duration-300">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Email</span>
                    <span className="text-sm font-bold text-gray-700">gilber1002@gmail.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        {/* Sidebar: Skills & Actions */}
        <div className="lg:col-span-4 space-y-12 lg:sticky lg:top-24">
          <section>
            <div className="flex items-center gap-3 mb-8">
              <span className="h-1 w-12 bg-blue-600 rounded-full"></span>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">Technical Arsenal</h3>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {skills.map((skill, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-200 transition-all group cursor-default">
                  <div className="w-2 h-2 rounded-full bg-blue-200 group-hover:bg-blue-600 group-hover:scale-150 transition-all"></div>
                  <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900">{skill}</span>
                </div>
              ))}
            </div>
          </section>

          <div className="space-y-4 pt-4">
            <Button 
              className="w-full py-5 bg-gray-900 text-white hover:bg-black rounded-2xl shadow-xl flex items-center justify-center gap-3 transform transition-transform hover:-translate-y-1 active:scale-95"
              onClick={() => window.location.href='mailto:gilber1002@gmail.com'}
            >
              <Mail className="w-5 h-5" /> Let's Connect
            </Button>
            <div className="flex gap-4">
              <a href="https://github.com/ooioiooGT" target="_blank" className="flex-1 h-14 bg-white border border-gray-100 text-gray-900 rounded-2xl flex items-center justify-center hover:bg-gray-50 transition-all shadow-sm hover:shadow-md">
                <Github className="w-6 h-6" />
              </a>
              <a href="https://www.linkedin.com/in/gilberchen/" target="_blank" className="flex-1 h-14 bg-[#0077b5] text-white rounded-2xl flex items-center justify-center hover:bg-opacity-90 transition-all shadow-lg hover:shadow-[#0077b5]/30">
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Main Content: Professional Journey */}
        <div className="lg:col-span-8 space-y-24">
          <section>
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                  <Briefcase className="w-6 h-6" />
                </div>
                Professional Experience
              </h2>
            </div>
            
            <div className="space-y-16">
              {/* Jolt Software */}
              <div className="group relative">
                <div className="absolute -left-4 top-0 bottom-0 w-px bg-gradient-to-b from-blue-600 via-gray-100 to-transparent"></div>
                <div className="mb-4">
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100">Feb 2025 — Present</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Technical Support Specialist</h3>
                <p className="text-gray-500 font-bold mb-6 uppercase tracking-tighter text-sm flex items-center gap-2">
                  Jolt Software <span className="w-1 h-1 bg-gray-300 rounded-full"></span> Lehi, UT
                </p>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex gap-4 p-4 rounded-2xl bg-gray-50/50 hover:bg-white border border-transparent hover:border-gray-100 transition-all">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" /> 
                    <p className="text-gray-600 text-sm leading-relaxed font-medium">Empowering enterprise clients including McDonald’s and Casey’s, maintaining a consistent 95% first-contact resolution benchmark.</p>
                  </div>
                  <div className="flex gap-4 p-4 rounded-2xl bg-gray-50/50 hover:bg-white border border-transparent hover:border-gray-100 transition-all">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" /> 
                    <p className="text-gray-600 text-sm leading-relaxed font-medium">Curating a high-impact Knowledge Base of 100+ technical guides, effectively reducing support overhead by 25%.</p>
                  </div>
                </div>
              </div>

              {/* BYU-Idaho */}
              <div className="group relative">
                <div className="absolute -left-4 top-0 bottom-0 w-px bg-gradient-to-b from-gray-200 to-transparent"></div>
                <div className="mb-4">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-4 py-1.5 rounded-full">Jan 2021 — Dec 2024</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900">IT Support Tier 2 (Project Lead)</h3>
                <p className="text-gray-500 font-bold mb-6 uppercase tracking-tighter text-sm flex items-center gap-2">
                  BYU-Idaho <span className="w-1 h-1 bg-gray-300 rounded-full"></span> Rexburg, ID
                </p>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex gap-4 p-4 rounded-2xl bg-gray-50/50 hover:bg-white border border-transparent hover:border-gray-100 transition-all">
                    <CheckCircle2 className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" /> 
                    <p className="text-gray-600 text-sm leading-relaxed font-medium">Directed a specialized team of 5+ IT technicians, overseeing full-cycle device management and complex system escalations.</p>
                  </div>
                </div>
              </div>

              {/* RBDC */}
              <div className="group relative">
                <div className="absolute -left-4 top-0 bottom-0 w-px bg-gradient-to-b from-gray-200 to-transparent"></div>
                <div className="mb-4">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-4 py-1.5 rounded-full">Apr 2024 — Jul 2024</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900">Software Engineer (Backend)</h3>
                <p className="text-gray-500 font-bold mb-6 uppercase tracking-tighter text-sm flex items-center gap-2">
                  RBDC <span className="w-1 h-1 bg-gray-300 rounded-full"></span> Rexburg, ID
                </p>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex gap-4 p-4 rounded-2xl bg-gray-50/50 hover:bg-white border border-transparent hover:border-gray-100 transition-all">
                    <CheckCircle2 className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" /> 
                    <p className="text-gray-600 text-sm leading-relaxed font-medium">Architected backend solutions using PHP and JavaScript, integrating advanced AI APIs to automate critical business workflows.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="bg-gradient-to-br from-gray-900 to-indigo-950 p-12 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-700"></div>
              <div className="absolute -top-10 -left-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700"></div>
              
              <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start gap-12">
                <div className="space-y-8 flex-1">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                      <GraduationCap className="text-blue-400 w-7 h-7" />
                    </div>
                    <h2 className="text-3xl font-black tracking-tight">Academic Foundation</h2>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-3xl font-bold text-white">Brigham Young University - Idaho</h3>
                    <p className="text-blue-400 font-black text-xl tracking-tight">BS, Software Engineering</p>
                    <p className="text-gray-400 font-medium">Computer Information Technology</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-4">
                    <div className="px-6 py-2.5 bg-white/5 hover:bg-white/10 rounded-2xl text-sm font-black border border-white/10 transition-colors">
                      GPA: 3.54
                    </div>
                    <div className="px-6 py-2.5 bg-white/5 hover:bg-white/10 rounded-2xl text-sm font-black border border-white/10 transition-colors">
                      Emphasis: Project Management
                    </div>
                  </div>
                </div>
                
                <div className="lg:text-right flex flex-col justify-between h-full">
                  <div className="space-y-1">
                    <span className="text-blue-400 font-black text-xs uppercase tracking-[0.3em] block">Completion</span>
                    <span className="text-6xl font-black tracking-tighter">2024</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};