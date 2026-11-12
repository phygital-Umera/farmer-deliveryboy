import { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Menu, X } from 'lucide-react';
import { useNavigate, Link } from '@tanstack/react-router';

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Destinations', to: '/destinations' },
    { name: 'Tours', to: '/tours' },
    { name: 'About', to: '/about' },
    { name: 'Blog', to: '/blog' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-pure-white/80 backdrop-blur-md border-b border-bg-light-mint">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-navy rounded-xl flex items-center justify-center">
              <Globe className="text-pure-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-navy to-primary-navy bg-clip-text text-transparent">
              MedCode Ninja
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.to}
                className="text-text-charcoal hover:text-primary-navy font-medium transition-colors"
                activeProps={{ className: 'text-primary-navy font-bold' }}
              >
                {link.name}
              </Link>
            ))}
            <button 
              onClick={() => navigate({ to: '/signin' })}
              className="bg-primary-navy text-pure-white px-6 py-2.5 rounded-full font-semibold hover:bg-primary-navy transition-all shadow-lg shadow-blue-200 active:scale-95"
            >
              Sign In
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-pure-white border-b border-bg-light-mint px-4 py-6 space-y-4"
        >
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.to}
              onClick={() => setIsMenuOpen(false)}
              className="block text-text-charcoal font-medium"
              activeProps={{ className: 'text-primary-navy font-bold' }}
            >
              {link.name}
            </Link>
          ))}
          <button 
            onClick={() => navigate({ to: '/signin' })}
            className="w-full bg-primary-navy text-pure-white px-6 py-3 rounded-xl font-semibold"
          >
            Sign In
          </button>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
