import React from 'react';
import { FaCompass, FaCalendarCheck, FaHeart, FaEye, FaAward, FaRoute, FaUsers, FaMapMarkedAlt } from 'react-icons/fa';

const About = () => {
  const stats = [
    { value: '100+', label: 'Tours Completed', icon: <FaRoute className="text-forest-500 text-xl" /> },
    { value: '500+', label: 'Travelers Guided', icon: <FaUsers className="text-mountain-700 text-xl" /> },
    { value: '20+', label: 'Destinations Explored', icon: <FaMapMarkedAlt className="text-forest-500 text-xl" /> },
    { value: '10+', label: 'Years Leading Exp.', icon: <FaAward className="text-mountain-700 text-xl" /> }
  ];

  const milestones = [
    { year: '2015', title: 'The Summit Begins', desc: 'SK Reddy completes the Advanced Mountaineering Course from NIM Uttarkashi with an A grade and starts guiding local treks.' },
    { year: '2018', title: 'Himalayan Expeditions', desc: 'Led the first major multi-week group expedition to Kedarkantha and Rupin Pass under challenging weather conditions.' },
    { year: '2021', title: 'SK Reddy Adventures Founded', desc: 'Officially launched a full-scale adventure agency focusing on eco-friendly treks and safety-first camping tours.' },
    { year: '2025', title: 'International Footprints', desc: 'Expanded destinations to international routes including Nepal base camps and Bhutan mountain circuits.' }
  ];

  return (
    <div className="py-20 space-y-20">
      
      {/* Banner / Header */}
      <section className="max-w-7xl mx-auto px-6 text-center space-y-4">
        <span className="text-xs uppercase tracking-widest font-bold text-forest-500">Our Story</span>
        <h1 className="text-4xl md:text-6xl font-black text-white">About SK Reddy</h1>
        <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Discover the vision, experience, and journey of the man behind the mountains.
        </p>
      </section>

      {/* Profile & Journey Section */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Profile Image (5 cols) */}
        <div className="lg:col-span-5 relative">
          <div className="rounded-3xl overflow-hidden shadow-2xl aspect-[3/4] max-w-md mx-auto border border-white/5 relative">
            <img
              src="https://images.unsplash.com/photo-1533240332313-0db49b439ad3?auto=format&fit=crop&w=800&q=80"
              alt="SK Reddy Guide Portrait"
              className="w-full h-full object-cover brightness-[0.9]"
            />
            {/* Dark gradient fade */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/60 to-transparent"></div>
          </div>
          {/* Decorative Background Blur Circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-forest-800/10 rounded-full blur-3xl -z-10"></div>
        </div>

        {/* Journey Details (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-4xl font-extrabold text-white">Leading with Experience & Passion</h2>
            <span className="block text-sm text-forest-500 font-semibold uppercase tracking-wider">Chief Adventure Officer & Guide</span>
          </div>

          <div className="space-y-4 text-sm text-gray-400 leading-relaxed">
            <p>
              SK Reddy is an avid mountaineer, certified search-and-rescue specialist, and professional nature photographer. Growing up near the Western Ghats, his love for wilderness started early. Over the past decade, this passion has transformed into a commitment to showing others the majestic beauty of the world's most remote locations.
            </p>
            <p>
              Under his guidance, SK Reddy Adventures has grown from a local trekking club into a premium adventure travel company. We specialize in designing customized trek itineraries, camping workshops, and extreme high-altitude climbs that emphasize safety, cultural immersion, and respect for nature.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 pt-6">
            {stats.map((stat, i) => (
              <div key={i} className="glass p-4 rounded-2xl flex items-center gap-4">
                <div className="p-3 bg-white/5 rounded-xl text-lg shrink-0">
                  {stat.icon}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white leading-none">{stat.value}</h4>
                  <span className="text-xs text-gray-400 block mt-1 font-medium">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="bg-[#090d15] border-y border-white/5 py-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
          
          <div className="glass p-8 md:p-10 rounded-3xl space-y-6 border border-white/5 hover:border-forest-500/20 transition-all duration-300">
            <div className="p-4 bg-forest-800/30 text-forest-500 rounded-2xl w-fit text-2xl">
              <FaHeart />
            </div>
            <h3 className="text-2xl font-black text-white">Our Mission</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              To inspire people to explore the outdoors by creating safe, educational, and life-changing adventure travel experiences that protect ecological systems and support local mountain communities.
            </p>
          </div>

          <div className="glass p-8 md:p-10 rounded-3xl space-y-6 border border-white/5 hover:border-mountain-700/20 transition-all duration-300">
            <div className="p-4 bg-mountain-800/30 text-mountain-700 rounded-2xl w-fit text-2xl">
              <FaEye />
            </div>
            <h3 className="text-2xl font-black text-white">Our Vision</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              To become the leading globally recognized sustainable adventure travel organizer, known for setting the highest standards in safety protocols, expert trip execution, and eco-friendly mountain conservation.
            </p>
          </div>

        </div>
      </section>

      {/* Timeline / Milestones */}
      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-widest font-bold text-forest-500">Timeline</span>
          <h2 className="text-3xl md:text-5xl font-black text-white">Our Adventure Milestones</h2>
        </div>

        <div className="relative border-l border-white/10 ml-4 md:ml-32 pl-8 md:pl-12 py-4 space-y-12 max-w-3xl">
          {milestones.map((ms, idx) => (
            <div key={idx} className="relative group">
              {/* Timeline marker */}
              <div className="absolute -left-[41px] md:-left-[57px] top-1.5 p-1 rounded-full bg-dark-bg border-4 border-forest-500/30 group-hover:border-forest-500 transition-colors z-10">
                <div className="w-3 h-3 rounded-full bg-forest-500"></div>
              </div>
              
              <div className="space-y-2">
                <span className="inline-block text-xs font-bold text-forest-500 bg-forest-800/30 px-3 py-1 rounded-full">
                  {ms.year}
                </span>
                <h4 className="text-lg font-bold text-white group-hover:text-forest-500 transition-colors">
                  {ms.title}
                </h4>
                <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
                  {ms.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default About;
