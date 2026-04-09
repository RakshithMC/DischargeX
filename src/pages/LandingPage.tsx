import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Mic, FileText, Share2, Clock, Shield, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LandingPage = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
                Generate Hospital Discharge Summaries in <span className="text-blue-600">Seconds</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-600">
                Use voice or text to create professional discharge reports instantly. DischargeX automates the paperwork so doctors can focus on patients.
              </p>
              <div className="mt-10 flex items-center gap-x-6">
                <Link
                  to="/dashboard"
                  className="rounded-full bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2"
                >
                  Try Now <ArrowRight className="h-5 w-5" />
                </Link>
                <Link to="/contact" className="text-sm font-semibold leading-6 text-slate-900 hover:text-blue-600 transition-colors">
                  Book Demo <span aria-hidden="true">→</span>
                </Link>
              </div>
              <div className="mt-10 flex items-center gap-4 text-sm text-slate-500">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <img
                      key={i}
                      className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
                      src={`https://picsum.photos/seed/doctor${i}/100/100`}
                      alt="Doctor"
                      referrerPolicy="no-referrer"
                    />
                  ))}
                </div>
                <p>Trusted by 500+ doctors across India</p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative rounded-2xl bg-slate-100 p-4 shadow-2xl ring-1 ring-slate-200">
                <img
                  src="https://picsum.photos/seed/dashboard/1200/800"
                  alt="DischargeX Dashboard Preview"
                  className="rounded-xl shadow-sm"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute -bottom-6 -left-6 rounded-lg bg-white p-4 shadow-xl ring-1 ring-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-green-100 p-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Summary Generated</p>
                      <p className="text-xs text-slate-500">Ready to download</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-600">Features</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Everything you need for efficient discharges
            </p>
          </div>
          
          <div className="mt-20 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Voice Input', desc: 'Speak patient details and let AI convert them to structured text.', icon: Mic },
              { title: 'Instant PDF', desc: 'Generate professional, hospital-branded PDFs in one click.', icon: FileText },
              { title: 'WhatsApp Sharing', desc: 'Send summaries directly to patients via WhatsApp.', icon: Share2 },
              { title: 'Time Saving', desc: 'Reduce discharge paperwork time by up to 80%.', icon: Clock },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-4">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">How It Works</h2>
          </div>
          
          <div className="relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 hidden lg:block" />
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
              {[
                { step: '01', title: 'Input Details', desc: 'Enter or speak patient details into our smart form.' },
                { step: '02', title: 'AI Generation', desc: 'Our AI structures the data into a professional medical summary.' },
                { step: '03', title: 'Share & Download', desc: 'Download the PDF or send it instantly via WhatsApp.' },
              ].map((item, idx) => (
                <div key={idx} className="relative flex flex-col items-center text-center">
                  <div className="z-10 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-xl mb-6 shadow-lg">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to transform your hospital workflow?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-blue-100">
            Join hundreds of healthcare providers who use DischargeX to save time and improve patient care.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              to="/dashboard"
              className="rounded-full bg-white px-8 py-3 text-lg font-semibold text-blue-600 shadow-sm hover:bg-blue-50 transition-all"
            >
              Get Started for Free
            </Link>
            <Link to="/contact" className="text-sm font-semibold leading-6 text-white hover:text-blue-100">
              Contact Sales <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
