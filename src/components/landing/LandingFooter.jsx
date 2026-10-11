import React from "react";
import { Link } from "react-router-dom";
import { GraduationCap, MessageCircle } from "lucide-react";

export default function LandingFooter() {
  return (
    <footer className="bg-white border-t border-[#E2E8F0] pt-14 pb-8 text-[#526079]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Links */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Info (Col 1) */}
          <div className="col-span-2 sm:col-span-2 md:col-span-1 space-y-3">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#2563EB] flex items-center justify-center text-white shadow-xs">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-lg font-black tracking-tight text-[#14213D]">
                QuizMaster
              </span>
            </Link>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Practice smarter. Perform better. Real computer-based examination simulations.
            </p>
          </div>

          {/* Platform Links (Col 2) */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-[#14213D] mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#home" className="hover:text-[#2563EB] transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#explore-exams" className="hover:text-[#2563EB] transition-colors">
                  Explore Exams
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-[#2563EB] transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-[#2563EB] transition-colors">
                  How It Works
                </a>
              </li>
            </ul>
          </div>

          {/* Account Links (Col 3) */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-[#14213D] mb-3">
              Account
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/register" className="hover:text-[#2563EB] transition-colors">
                  Student Registration
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-[#2563EB] transition-colors">
                  Student Login
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-[#2563EB] transition-colors">
                  Admin Portal
                </Link>
              </li>
              <li>
                <Link to="/student/results" className="hover:text-[#2563EB] transition-colors">
                  My Results
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links (Col 4) */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-[#14213D] mb-3">
              Support
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#contact" className="hover:text-[#2563EB] transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-[#2563EB] transition-colors">
                  FAQs
                </a>
              </li>
              <li>
                <a href="mailto:support@quizmaster.com" className="hover:text-[#2563EB] transition-colors">
                  Help & Support
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Links (Col 5) */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-[#14213D] mb-3">
              Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="hover:text-[#2563EB] cursor-pointer transition-colors">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="hover:text-[#2563EB] cursor-pointer transition-colors">
                  Terms & Conditions
                </span>
              </li>
              <li>
                <span className="hover:text-[#2563EB] cursor-pointer transition-colors">
                  Cookie Policy
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Socials */}
        <div className="pt-8 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B]">
          <p>© 2026 QuizMaster. All rights reserved.</p>

          <div className="flex items-center gap-4">
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="text-[#64748B] hover:text-[#DC2626] transition-colors"
              aria-label="YouTube"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="text-[#64748B] hover:text-[#2563EB] transition-colors"
              aria-label="Twitter / X"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="text-[#64748B] hover:text-[#0A66C2] transition-colors"
              aria-label="LinkedIn"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
            <a
              href="https://discord.com"
              target="_blank"
              rel="noreferrer"
              className="text-[#64748B] hover:text-[#5865F2] transition-colors"
              aria-label="Discord"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
