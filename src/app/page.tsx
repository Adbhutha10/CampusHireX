"use client"

import Link from "next/link"
import Image from "next/image"
import { cn } from "@/backend/lib/utils"
import { useState, useEffect } from "react"
import {
   Briefcase,
   Users,
   BarChart3,
   Zap,
   ShieldCheck,
   ArrowRight,
   Layout,
   Globe,
   Database,
   Bell,
   Check,
   Star,
   Quote,
   Workflow,
   CloudLightning,
   type LucideIcon
} from "lucide-react"

function Typewriter({ words }: { words: string[] }) {
   const [index, setIndex] = useState(0)
   const [subIndex, setSubIndex] = useState(0)
   const [reverse, setReverse] = useState(false)

   useEffect(() => {
      // If we finished typing a word
      if (subIndex === words[index].length + 1 && !reverse) {
         const timeout = setTimeout(() => setReverse(true), 1500)
         return () => clearTimeout(timeout)
      }

      // If we finished deleting a word
      if (subIndex === 0 && reverse) {
         const timeout = setTimeout(() => {
            setReverse(false)
            setIndex((prev) => (prev + 1) % words.length)
         }, 500)
         return () => clearTimeout(timeout)
      }

      // Typing/Deleting logic
      const timeout = setTimeout(() => {
         setSubIndex((prev) => prev + (reverse ? -1 : 1))
      }, reverse ? 75 : 150)

      return () => clearTimeout(timeout)
   }, [subIndex, index, reverse, words])

   return (
      <span className="text-indigo-600 min-h-[1.1em] inline-block whitespace-nowrap">
         {words[index].substring(0, subIndex)}
         <span className="animate-pulse border-r-4 border-indigo-600 ml-1"></span>
      </span>
   )
}

export default function LandingPage() {
   return (
      <div className="flex flex-col min-h-screen bg-white selection:bg-indigo-100">
         {/* Professional Navbar */}
         <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-100">
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
               <Link className="flex items-center group py-2" href="/">
                  <Image
                     src="/Campus Hire X - complete logo.png"
                     alt="CampusHireX Logo"
                     width={280}
                     height={60}
                     className="object-contain w-auto h-12 md:h-14"
                     priority
                  />
               </Link>

               <nav className="flex items-center gap-5 md:gap-10">
                  <a className="text-[11px] md:text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-all cursor-pointer hover:translate-y-[-1px] tracking-wide" href="#solutions">Solutions</a>
                  <a className="text-[11px] md:text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-all cursor-pointer hover:translate-y-[-1px] tracking-wide" href="#platform">Platform</a>
                  <a className="text-[11px] md:text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-all cursor-pointer hover:translate-y-[-1px] tracking-wide" href="#features">Features</a>
                  <a className="text-[11px] md:text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-all cursor-pointer hover:translate-y-[-1px] tracking-wide" href="#why-us">Why Us</a>
               </nav>

               <div className="flex items-center gap-6">
                  <Link className="text-sm font-bold text-slate-700 hover:text-indigo-600" href="/login?role=STUDENT">Student Login</Link>
                  <div className="w-px h-4 bg-slate-200" />
                  <Link className="text-sm font-bold text-slate-700 hover:text-indigo-600" href="/login?role=ADMIN">Admin Login</Link>
                  <Link className="bg-indigo-600 text-white px-8 py-3 rounded-full text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200" href="/register">
                     Register
                  </Link>
               </div>
            </div>
         </header>

         <main className="flex-1">
            {/* Dynamic Hero Section */}
            <section className="relative w-full pt-12 pb-24 lg:pt-16 lg:pb-32 bg-[#f8fafc] overflow-hidden">
               <div className="container px-6 mx-auto grid lg:grid-cols-[3fr_2fr] gap-12 items-center">
                  <div className="space-y-8 max-w-2xl">

                     <div className="space-y-4">
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1] font-heading min-h-[3.3em]">
                           Campus placements <br />
                           built for <br />
                           <Typewriter words={["Brilliant Teams", "Ambitious Students", "Seamless Success"]} />
                        </h1>
                        <p className="text-xl text-slate-600 font-medium leading-relaxed">
                           Move from messy spreadsheets to a single source of truth. The ultimate system to manage student profiling, training, and employer hiring tracking.
                        </p>
                     </div>

                     <div className="flex flex-col gap-8">
                        <div className="flex flex-col sm:flex-row gap-4">
                           <Link className="bg-indigo-600 text-white px-10 py-5 rounded-xl text-lg font-bold hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-100 flex items-center justify-center gap-2 group w-fit" href="/register">
                              Get Started
                              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                           </Link>
                        </div>

                        {/* Trust Badges */}
                        <div className="flex flex-wrap items-center gap-6 text-slate-400">
                           {[
                              { text: "Zero setup fee", icon: Check },
                              { text: "Role-based access", icon: ShieldCheck },
                              { text: "Instant matching", icon: Zap }
                           ].map((badge, bi) => (
                              <div key={bi} className="flex items-center gap-2">
                                 <badge.icon size={16} className="text-emerald-500" />
                                 <span className="text-xs font-bold uppercase tracking-widest">{badge.text}</span>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>

                  <div className="relative animate-in fade-in slide-in-from-right-12 duration-1000 max-w-lg mx-auto lg:mx-0 w-full">
                     <div className="absolute -inset-20 bg-indigo-100/40 rounded-full blur-[120px] -z-10" />
                     <div className="bg-white p-6 rounded-2xl shadow-2xl border border-slate-100 relative overflow-hidden">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-6 pb-5 border-b border-slate-50">
                           <div className="flex items-center gap-3">
                              <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg"><Users size={16} /></div>
                              <div>
                                 <p className="font-black text-slate-900 text-sm leading-none">Placement Pipeline</p>
                                 <p className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest mt-1 italic">Live Dashboard</p>
                              </div>
                           </div>
                           <div className="flex gap-1.5">
                              <div className="w-2 h-2 rounded-full bg-red-300" />
                              <div className="w-2 h-2 rounded-full bg-amber-300" />
                              <div className="w-2 h-2 rounded-full bg-emerald-400" />
                           </div>
                        </div>
                        {/* Columns */}
                        <div className="grid grid-cols-3 gap-3">
                           {[
                              { title: "Applied", count: "124", dot: "bg-slate-400", badge: "bg-slate-100 text-slate-600" },
                              { title: "Interviews", count: "42", dot: "bg-amber-400", badge: "bg-amber-100 text-amber-700" },
                              { title: "Hired 🎉", count: "18", dot: "bg-emerald-500", badge: "bg-emerald-100 text-emerald-700" }
                           ].map((col, ci) => (
                              <div key={ci} className="space-y-2">
                                 <div className="flex items-center justify-between mb-2 px-0.5">
                                    <span className="text-[8px] font-black uppercase text-slate-400 tracking-wider">{col.title}</span>
                                    <span className={cn("text-[8px] font-black px-1.5 py-0.5 rounded-full", col.badge)}>{col.count}</span>
                                 </div>
                                 <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1.5 hover:shadow-md transition-all">
                                    <div className="flex items-center gap-1.5"><div className={cn("w-1.5 h-1.5 rounded-full", col.dot)} /><div className="h-1.5 w-10 bg-slate-200 rounded-full" /></div>
                                    <div className="h-1 w-full bg-slate-100 rounded-full" />
                                    <div className="h-1 w-2/3 bg-slate-100 rounded-full" />
                                 </div>
                                 {ci === 2 ? (
                                    <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-100">
                                       <p className="text-[8px] font-black text-indigo-200 uppercase">Offer Sent</p>
                                       <p className="text-white font-black text-[11px] mt-0.5">Google ✦</p>
                                       <div className="mt-1.5 flex gap-1"><div className="h-1 w-6 bg-white/30 rounded-full" /><div className="h-1 w-4 bg-white/20 rounded-full" /></div>
                                    </div>
                                 ) : (
                                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1.5 hover:shadow-md transition-all">
                                       <div className="flex items-center gap-1.5"><div className={cn("w-1.5 h-1.5 rounded-full", col.dot)} /><div className="h-1.5 w-8 bg-slate-200 rounded-full" /></div>
                                       <div className="h-1 w-4/5 bg-slate-100 rounded-full" />
                                       <div className="h-1 w-1/2 bg-slate-100 rounded-full" />
                                    </div>
                                 )}
                              </div>
                           ))}
                        </div>
                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-3 mt-5 pt-5 border-t border-slate-50">
                           <div className="bg-slate-50 p-3 rounded-2xl text-center"><p className="text-lg font-black text-indigo-600">88%</p><p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Success Rate</p></div>
                           <div className="bg-slate-900 p-3 rounded-2xl text-center text-white"><p className="text-lg font-black">500+</p><p className="text-[8px] font-bold text-slate-500 uppercase tracking-wider">Hired This Month</p></div>
                        </div>
                     </div>
                  </div>
               </div>
            </section>

            {/* Catering to Everyone's Needs */}
            <section id="solutions" className="py-24 bg-white">
               <div className="container px-6 mx-auto text-center space-y-16">
                  <div className="max-w-3xl mx-auto space-y-4">
                     <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight font-heading">
                        Move from messy spreadsheets to <br />
                        <span className="text-indigo-600 italic">a single source of truth</span>
                     </h2>
                     <p className="text-slate-600 font-medium text-lg">
                        Stop chasing emails and updating fragmented Excel sheets. CampusHireX centralizes every stakeholder in one powerful, automated ecosystem.
                     </p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-8 text-left">
                     {[
                        {
                           title: "Centralized Database",
                           icon: Database,
                           desc: "Ditch the folders. Store all student records, resumes, and company data in a secure, searchable cloud database.",
                           stat: "100% Data Integrity"
                        },
                        {
                           title: "Automated Eligibility",
                           icon: ShieldCheck,
                           desc: "No more manual filtering. Our smart engine instantly matches students with jobs based on real-time CGPA and skills.",
                           stat: "Instant Screening"
                        },
                        {
                           title: "Live Tracking",
                           icon: BarChart3,
                           desc: "Real-time visibility into the hiring funnel. Track every application from 'Applied' to 'Selected' without a single phone call.",
                           stat: "Zero Paperwork"
                        }
                     ].map((item, i) => (
                        <div key={i} className="bg-slate-50 p-10 rounded-[32px] space-y-6 hover:bg-white hover:shadow-2xl hover:scale-[1.02] transition-all border border-transparent hover:border-slate-100 group">
                           <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                              <item.icon size={32} />
                           </div>
                           <div>
                              <h3 className="text-2xl font-extrabold text-slate-900 font-heading">{item.title}</h3>
                              <p className="text-indigo-600 text-xs font-black uppercase tracking-widest mt-1">{item.stat}</p>
                           </div>
                           <p className="text-slate-600 font-medium leading-relaxed">{item.desc}</p>
                        </div>
                     ))}
                  </div>
               </div>
            </section>

            {/* 3-Step Workflow Section */}
            <section id="platform" className="py-24 bg-[#f1f5f9] overflow-hidden">
               <div className="container px-6 mx-auto space-y-20">
                  <div className="text-center space-y-4 max-w-2xl mx-auto">
                     <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight font-heading">
                        How CampusHireX works <br />
                        <span className="text-indigo-600 italic text-3xl">Setup in under 2 minutes</span>
                     </h2>
                  </div>

                  <div className="grid lg:grid-cols-3 gap-12 relative">
                     {/* Connector Line for Desktop */}
                     <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 z-0" />

                     {[
                        {
                           step: "01",
                           title: "Build Profiles",
                           desc: "Students sign up and create digital portfolios showcasing their skills and achievements.",
                           color: "bg-indigo-600"
                        },
                        {
                           step: "02",
                           title: "Smart Matching",
                           desc: "Companies post jobs and our engine instantly identifies the top eligible candidates.",
                           color: "bg-slate-900"
                        },
                        {
                           step: "03",
                           title: "Hire Fast",
                           desc: "Conduct interviews and send offers through the platform with real-time status updates.",
                           color: "bg-indigo-600"
                        }
                     ].map((s, i) => (
                        <div key={i} className="relative z-10 bg-white p-10 rounded-[40px] shadow-lg border border-slate-100 text-center space-y-6">
                           <div className={cn("w-14 h-14 mx-auto rounded-full flex items-center justify-center text-white font-black text-xl shadow-lg", s.color)}>
                              {s.step}
                           </div>
                           <h4 className="text-2xl font-black text-slate-900 font-heading">{s.title}</h4>
                           <p className="text-slate-600 font-medium leading-relaxed">{s.desc}</p>
                        </div>
                     ))}
                  </div>
               </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-24 bg-white border-t border-slate-50">
               <div className="container px-6 mx-auto text-center mb-20 max-w-3xl">
                  <h2 className="text-4xl font-extrabold text-slate-900 mb-6 italic font-heading">Powerful Platform Attributes</h2>
                  <p className="text-lg text-slate-600 font-medium">Access data analytics and create ad-hoc reports in no time. Our systematic approach plugs gaps in your current placement journey.</p>
               </div>

               <div className="container px-6 mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                  {[
                     { title: "Perfect Skill Mapping", icon: Zap, desc: "Recruiters can target best profiles using Job Matching Templates." },
                     { title: "Systematic Recruitment", icon: Briefcase, desc: "Nurture relationships with candidates via a one-view database." },
                     { title: "Prompt Alerts", icon: Bell, desc: "Stay up-to-date with automated alerts sent via SMS and email." },
                     { title: "Rich Data Analytics", icon: Database, desc: "Create ad-hoc reports and gain insights to optimize processes." },
                     { title: "Effective Outreach", icon: Globe, desc: "Better outreach with greater employer conversions via integrated CRM." },
                     { title: "Flexible Migrations", icon: Zap, desc: "Cleanse and load data from legacy systems during cutover easily." },
                     { title: "Secure Repository", icon: ShieldCheck, desc: "Store placement agreements and sensitive data securely." },
                     { title: "Interactive Boards", icon: Layout, desc: "Dashboards to monitor and evaluate each step of the journey." }
                   ].map((f, i) => (
                     <div key={i} className="space-y-4 group">
                        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all border border-transparent group-hover:border-indigo-100">
                           <f.icon size={24} />
                        </div>
                        <h4 className="text-xl font-bold text-slate-900">{f.title}</h4>
                        <p className="text-slate-500 text-sm font-medium leading-relaxed">{f.desc}</p>
                     </div>
                  ))}
               </div>
            </section>

            {/* Testimonials Grid */}
            <section className="py-24 bg-white">
               <div className="container px-6 mx-auto space-y-16">
                  <div className="text-center space-y-4">
                     <h2 className="text-4xl font-extrabold text-slate-900 font-heading italic">Trusted by Educational Leaders</h2>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                     {[
                        { name: "Dr. Aradhya Sharma", role: "Placement Director", quote: "CampusHireX replaced our spreadsheets and manual tracking. Our efficiency boosted by 300% in just one season." },
                        { name: "Rohan Verma", role: "Software Engineer @ Google", quote: "The profiles here are so professional. I attribute my smooth transition to Google to the smart matching platform." },
                        { name: "Priya Das", role: "HR Manager @ Microsoft", quote: "Finding talent is easy, but finding the RIGHT talent is hard. CampusHireX makes it seamless with its skill-mapping engine." }
                     ].map((t, i) => (
                        <div key={i} className="p-8 bg-slate-50 rounded-3xl border border-slate-100 space-y-6 relative overflow-hidden group hover:bg-white hover:shadow-xl transition-all">
                           <Quote className="absolute top-4 right-4 text-indigo-100 group-hover:text-indigo-200 transition-colors" size={60} />
                           <div className="flex gap-1 text-amber-400">
                              {[...Array(5)].map((_, si) => <Star key={si} size={14} fill="currentColor" />)}
                           </div>
                           <p className="text-slate-600 font-medium italic relative z-10 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                           <div className="pt-4 border-t border-slate-200/50">
                              <p className="font-bold text-slate-900">{t.name}</p>
                              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{t.role}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </section>

            {/* CTA Section */}
            <section id="why-us" className="py-24 bg-slate-900 relative overflow-hidden">
               <div className="absolute inset-0 bg-indigo-600 mix-blend-multiply opacity-20 pointer-events-none" />
               <div className="container px-6 mx-auto text-center relative z-10 space-y-10">
                  <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-tight font-heading">
                     Ready to manage your <br />
                     <span className="text-indigo-400 italic underline decoration-wavy underline-offset-8 font-heading text-5xl md:text-7xl">teams better?</span>
                  </h2>
                  <p className="text-indigo-100/60 text-lg max-w-2xl mx-auto font-medium">
                     Join 500+ institutions using CampusHireX to bridge the gap between education and career. Zero credit card required.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
                     <Link className="bg-white text-slate-900 px-10 py-5 rounded-xl text-lg font-black hover:bg-slate-100 transition-all shadow-2xl" href="/register">
                        Get Started
                     </Link>
                  </div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Setup in under 2 minutes • role-based access • cloud sync</p>
               </div>
            </section>
         </main>

         <footer className="bg-white py-6 border-t border-slate-100">
            <div className="container px-6 mx-auto">
               <div className="flex flex-col items-center text-center space-y-2 mb-4">
                  <div className="flex items-center justify-center gap-2">
                     <Image
                        src="/Campus Hire X - complete logo.png"
                        alt="CampusHireX Logo"
                        width={200}
                        height={40}
                        className="object-contain h-8 w-auto"
                     />
                  </div>
                  <p className="text-slate-500 font-medium leading-relaxed max-w-sm text-sm">
                     Empowering institutions with the most advanced placement management platform. Built for students, loved by placement teams.
                  </p>
               </div>

               <div className="pt-4 border-t border-slate-50 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                  <p>© {new Date().getFullYear()} CampusHireX. Built by Adbhutha. All rights reserved.</p>
               </div>
            </div>
         </footer>
      </div>
   )
}
