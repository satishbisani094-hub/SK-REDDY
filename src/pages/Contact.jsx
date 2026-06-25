import React, { useState } from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaPaperPlane, FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import { createEnquiry } from '../services/api';
import Toast from '../components/Toast';

const Contact = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ message: msg, type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !phone || !email || !message) {
      showToast('All fields are required', 'error');
      return;
    }

    setLoading(true);
    try {
      await createEnquiry({ name, phone, email, message });
      showToast('Thank you! Your enquiry has been received.', 'success');
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
    } catch (error) {
      showToast('Failed to submit enquiry. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-20 max-w-7xl mx-auto px-6 space-y-12">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="text-center space-y-4">
        <span className="text-xs uppercase tracking-widest font-bold text-forest-500">Get In Touch</span>
        <h1 className="text-4xl md:text-6xl font-black text-white">Contact SK Reddy Adventures</h1>
        <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Have questions about a trek itinerary or want to plan a custom corporate outing? Send us a message and we'll reply within 24 hours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pt-6">
        
        {/* Contact Info (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass p-8 rounded-3xl border border-white/5 space-y-8 shadow-2xl relative overflow-hidden">
            {/* Ambient blur */}
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-forest-800/10 rounded-full blur-2xl"></div>

            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-white">Contact Information</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Reach out to us directly via phone or email, or drop by our Bangalore office.
              </p>
            </div>

            {/* List */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/5 text-forest-500 rounded-xl text-lg shrink-0">
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">Base Office</h4>
                  <p className="text-xs text-gray-400 leading-relaxed mt-1">
                    123, Adventure Lane, Off MG Road, Bangalore, Karnataka - 560001, India
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/5 text-mountain-700 rounded-xl text-lg shrink-0">
                  <FaPhoneAlt />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">Call Us</h4>
                  <p className="text-xs text-gray-400 mt-1 font-semibold">+91 98765 43210</p>
                  <p className="text-[10px] text-gray-500">Mon - Sat, 9:00 AM - 6:00 PM</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/5 text-forest-500 rounded-xl text-lg shrink-0">
                  <FaEnvelope />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">Email Enquiries</h4>
                  <p className="text-xs text-gray-400 mt-1 font-semibold">info@skreddyadventures.com</p>
                </div>
              </div>
            </div>

            {/* Social icons */}
            <div className="pt-6 border-t border-white/5">
              <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Follow our expeditions</h4>
              <div className="flex gap-3">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-white/5 hover:bg-forest-800 text-gray-400 hover:text-white transition-all">
                  <FaFacebookF className="text-xs" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-white/5 hover:bg-forest-800 text-gray-400 hover:text-white transition-all">
                  <FaTwitter className="text-xs" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-white/5 hover:bg-forest-800 text-gray-400 hover:text-white transition-all">
                  <FaInstagram className="text-xs" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-white/5 hover:bg-forest-800 text-gray-400 hover:text-white transition-all">
                  <FaYoutube className="text-xs" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Enquiry Form (7 cols) */}
        <div className="lg:col-span-7">
          <div className="glass p-8 md:p-10 rounded-3xl border border-white/5 shadow-2xl space-y-6">
            <h3 className="text-xl font-extrabold text-white">Send a Message</h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Your Name</label>
                  <input
                    type="text"
                    placeholder="Enter full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-forest-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Mobile Number</label>
                  <input
                    type="tel"
                    placeholder="Enter mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-forest-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-forest-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Message</label>
                <textarea
                  rows="5"
                  placeholder="Tell us about the destinations you want to visit, number of travelers, dates, or write your enquiry here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-forest-500"
                  required
                ></textarea>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-4 bg-forest-800 hover:bg-forest-700 text-white rounded-xl font-bold transition-all shadow-lg border border-forest-600/30 flex items-center justify-center gap-2 cursor-pointer text-sm tracking-wide disabled:opacity-50"
                >
                  {loading ? (
                    'Sending Message...'
                  ) : (
                    <>
                      <FaPaperPlane className="text-xs" /> Send Message
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;
