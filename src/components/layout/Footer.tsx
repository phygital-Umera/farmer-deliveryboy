import { Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-pure-white pt-24 pb-12 border-t border-bg-light-mint">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-navy rounded-lg flex items-center justify-center">
                <Globe className="text-pure-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-text-charcoal">MedCode Ninja</span>
            </div>
            <p className="text-text-charcoal leading-relaxed">
              Making travel simple, accessible and unforgettable for everyone, everywhere.
            </p>
            <div className="flex gap-4">
              {/* Social placeholders */}
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-bg-light-mint hover:bg-primary-navy hover:text-pure-white transition-all cursor-pointer flex items-center justify-center text-text-charcoal"
                >
                  <Globe className="w-5 h-5" />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-text-charcoal mb-6 uppercase tracking-wider text-sm">Destinations</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-text-charcoal hover:text-primary-navy transition-colors">Europe</a></li>
              <li><a href="#" className="text-text-charcoal hover:text-primary-navy transition-colors">Asia</a></li>
              <li><a href="#" className="text-text-charcoal hover:text-primary-navy transition-colors">North America</a></li>
              <li><a href="#" className="text-text-charcoal hover:text-primary-navy transition-colors">South America</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-text-charcoal mb-6 uppercase tracking-wider text-sm">Company</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-text-charcoal hover:text-primary-navy transition-colors">About Us</a></li>
              <li><a href="#" className="text-text-charcoal hover:text-primary-navy transition-colors">Contact</a></li>
              <li><a href="#" className="text-text-charcoal hover:text-primary-navy transition-colors">Careers</a></li>
              <li><a href="#" className="text-text-charcoal hover:text-primary-navy transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-text-charcoal mb-6 uppercase tracking-wider text-sm">Support</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-text-charcoal hover:text-primary-navy transition-colors">Help Center</a></li>
              <li><a href="#" className="text-text-charcoal hover:text-primary-navy transition-colors">FAQ</a></li>
              <li><a href="#" className="text-text-charcoal hover:text-primary-navy transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-text-charcoal hover:text-primary-navy transition-colors">Community</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-bg-light-mint text-center">
          <p className="text-text-charcoal text-sm">
            &copy; {new Date().getFullYear()} Travelex Inc. All rights reserved. Designed for explorers.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
