'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Таны хүсэлтийг хүлээн авлаа. Удахгүй холбогдох болно.');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactInfo = [
    {
      title: 'Утас',
      value: '+7 977 801 9143',
      href: 'tel:+79778019143',
      icon: (
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      color: 'bg-blue-50',
    },
    {
      title: 'Имэйл',
      value: 'info@oyunsfinance.mn',
      href: 'mailto:info@oyunsfinance.mn',
      icon: (
        <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      color: 'bg-cyan-50',
    },
    {
      title: 'Telegram',
      value: '@oyuns_aio',
      href: 'https://t.me/oyuns_aio',
      icon: (
        <svg className="w-5 h-5 text-violet-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.717-.962 3.767-1.362 5.001-.169.523-.506.697-.83.715-.704.031-1.237-.465-1.918-.912-.964-.633-1.508-1.028-2.447-1.647-.951-.627-.334-1.098.208-1.735.142-.164 2.606-2.389 2.652-2.592.006-.025.011-.117-.043-.166-.054-.049-.133-.033-.19-.019-.079.019-1.339.851-3.781 2.5-.358.246-.682.366-.973.36-.32-.006-.936-.181-1.395-.329-.563-.181-1.009-.277-1.086-.299-.167-.046-.252-.088-.252-.183 0-.074.057-.149.172-.225.641-.423 1.64-1.056 2.987-1.9.984-.615 2.149-1.314 3.487-2.097.284-.166.567-.333.85-.499.117-.069.234-.068.35.002.116.069.174.183.174.315z"/>
        </svg>
      ),
      color: 'bg-violet-50',
    },
  ];

  const socials = [
    {
      label: 'Telegram',
      href: 'https://t.me/oyuns_aio',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.717-.962 3.767-1.362 5.001-.169.523-.506.697-.83.715-.704.031-1.237-.465-1.918-.912-.964-.633-1.508-1.028-2.447-1.647-.951-.627-.334-1.098.208-1.735.142-.164 2.606-2.389 2.652-2.592.006-.025.011-.117-.043-.166-.054-.049-.133-.033-.19-.019-.079.019-1.339.851-3.781 2.5-.358.246-.682.366-.973.36-.32-.006-.936-.181-1.395-.329-.563-.181-1.009-.277-1.086-.299-.167-.046-.252-.088-.252-.183 0-.074.057-.149.172-.225.641-.423 1.64-1.056 2.987-1.9.984-.615 2.149-1.314 3.487-2.097.284-.166.567-.333.85-.499.117-.069.234-.068.35.002.116.069.174.183.174.315z"/>
        </svg>
      ),
    },
    {
      label: 'Facebook',
      href: 'https://www.facebook.com/oyuns.aio',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
    },
    {
      label: 'Instagram',
      href: 'https://www.instagram.com/oyuns_all_in_one/',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
    },
    {
      label: 'WhatsApp',
      href: 'https://wa.me/79778019143',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <p className="text-sm font-semibold text-blue-600 tracking-wide uppercase mb-2">Холбогдох</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-3">
            Бидэнтэй холбогдох
          </h1>
          <p className="text-lg text-slate-500">
            Таны асуулт, санал хүсэлтийг хүлээн авахад бэлэн байна
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Contact cards */}
            <div className="bg-white rounded-2xl border border-gray-100 p-7">
              <h2 className="text-lg font-bold text-slate-900 mb-5">Холбоо барих</h2>
              <div className="space-y-4">
                {contactInfo.map((item, i) => (
                  <a
                    key={i}
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    <div className={`flex-shrink-0 w-11 h-11 ${item.color} rounded-xl flex items-center justify-center`}>
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-400">{item.title}</p>
                      <p className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">{item.value}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Social Media Links */}
            <div className="relative mesh-gradient rounded-2xl p-7 text-white overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent pointer-events-none" />
              <div className="relative">
                <h2 className="text-lg font-bold mb-5">Сошиал сүлжээ</h2>
                <div className="grid grid-cols-2 gap-3">
                  {socials.map((item, i) => (
                    <a
                      key={i}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all rounded-xl p-3.5 border border-white/10 hover:border-white/25 text-sm font-medium"
                    >
                      {item.icon}
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-2xl border border-gray-100 p-7"
          >
            <h2 className="text-lg font-bold text-slate-900 mb-5">Мессеж илгээх</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-500 mb-1.5">
                  Нэр *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900"
                  placeholder="Таны нэр"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-500 mb-1.5">
                  Имэйл *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900"
                  placeholder="example@email.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-500 mb-1.5">
                  Утас
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900"
                  placeholder="+976 1234 5678"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-500 mb-1.5">
                  Мессеж *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none text-slate-900"
                  placeholder="Таны мессеж..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 text-sm"
              >
                Илгээх
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
