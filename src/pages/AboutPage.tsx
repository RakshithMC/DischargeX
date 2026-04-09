import React from 'react';
import { motion } from 'motion/react';
import { Target, Users, Award, Heart } from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="bg-white">
      {/* Mission */}
      <section className="py-20 bg-blue-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h1 className="text-4xl font-extrabold text-slate-900 mb-6">Our Mission</h1>
            <p className="mx-auto max-w-3xl text-xl text-slate-600 leading-relaxed">
              At DischargeX, we are on a mission to simplify hospital workflows and reduce the administrative burden on healthcare professionals. We believe that every minute saved on paperwork is a minute earned for patient care.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Innovation', desc: 'Using AI to solve real-world healthcare challenges.', icon: Target },
              { title: 'Efficiency', desc: 'Streamlining processes to save time and resources.', icon: Zap },
              { title: 'Trust', desc: 'Ensuring data security and professional standards.', icon: Award },
              { title: 'Care', desc: 'Built with a deep respect for the medical profession.', icon: Heart },
            ].map((value, idx) => (
              <div key={idx} className="text-center p-6">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-6">
                  <value.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{value.title}</h3>
                <p className="text-slate-600 text-sm">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team/Story */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">The Story Behind DischargeX</h2>
              <p className="text-slate-300 mb-6 leading-relaxed">
                Founded by a team of doctors and engineers, DischargeX was born out of frustration with the manual, error-prone process of writing discharge summaries. We saw doctors spending hours every day typing out reports that could be automated.
              </p>
              <p className="text-slate-300 leading-relaxed">
                Today, DischargeX is used by hundreds of hospitals to automate their discharge process, ensuring accuracy, professionalism, and most importantly, saving valuable time for those who save lives.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img src="https://picsum.photos/seed/team1/400/400" alt="Team" className="rounded-2xl" referrerPolicy="no-referrer" />
              <img src="https://picsum.photos/seed/team2/400/400" alt="Team" className="rounded-2xl mt-8" referrerPolicy="no-referrer" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const Zap = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);
