import React from 'react'

const Footer = () => {
  return (
    <footer className="relative z-10 border-t border-white/5 py-12 text-slate-500 text-sm">
          <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
              <p>© 2026 AttendX. Built for the modern educator. ⚡</p>
              <div className="flex gap-8">
                  <a href="#" className="hover:text-white transition">Privacy</a>
                  <a href="#" className="hover:text-white transition">Terms</a>
                  <a href="#" className="hover:text-white transition">Support</a>
              </div>
          </div>
        </footer>
  )
}

export default Footer