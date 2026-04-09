import React from 'react';
import { motion } from 'motion/react';
import { Shield, Zap, CheckCircle2, HeartPulse, Clock, FileCheck } from 'lucide-react';

export const ProductPage = () => {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-slate-900 py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold tracking-tight sm:text-5xl"
          >
            AI-Powered Healthcare Automation
          </motion.h1>
          <p className="mt-6 mx-auto max-w-2xl text-lg text-slate-300">
            DischargeX is built for modern hospitals. We use cutting-edge AI to eliminate manual data entry and streamline patient discharges.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Why Choose DischargeX?</h2>
              <div className="space-y-8">
                {[
                  { title: 'AI-Powered Automation', desc: 'Our Gemini-powered AI understands medical context and structures summaries perfectly.', icon: Zap },
                  { title: 'Reduces Manual Work', desc: 'Doctors spend 80% less time on paperwork, allowing more time for patient care.', icon: Clock },
                  { title: 'Improves Accuracy', desc: 'Standardized templates ensure no critical information is missed during discharge.', icon: FileCheck },
                  { title: 'Enterprise Security', desc: 'HIPAA-compliant data handling ensures patient privacy and data security.', icon: Shield },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                      <p className="text-slate-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img
                src="https://picsum.photos/seed/medical/800/1000"
                alt="Medical Professional using DischargeX"
                className="rounded-3xl shadow-2xl"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-2xl shadow-xl hidden lg:block">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                    <HeartPulse className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">99.9%</p>
                    <p className="text-sm text-slate-500 font-medium">Accuracy Rate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Features */}
      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Advanced Capabilities</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Voice-to-Summary</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Our proprietary speech recognition engine is tuned for medical terminology. Just speak the diagnosis and treatment, and we'll do the rest.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Custom Branding</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Add your hospital logo, header, and footer. Every discharge summary looks professional and represents your institution perfectly.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Digital Signatures</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Securely add doctor signatures to documents. Maintain a digital audit trail of all generated summaries.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
