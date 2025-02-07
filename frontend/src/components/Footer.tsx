

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-white py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 hover:underline">
              <i className="fas fa-globe"></i>
              English (US)
            </button>
            <button className="flex items-center gap-2 hover:underline">
              <span>$</span>
              USD
            </button>
          </div>

          <div className="flex items-center gap-6">
            <a href="#" className="text-gray-700 hover:text-gray-900">
              <i className="fab fa-facebook text-xl"></i>
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900">
              <i className="fab fa-twitter text-xl"></i>
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900">
              <i className="fab fa-instagram text-xl"></i>
            </a>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <span>© 2025 Hajji, Inc.</span>
            <span>·</span>
            <a href="#" className="hover:underline">Terms</a>
            <span>·</span>
            <a href="#" className="hover:underline">Sitemap</a>
            <span>·</span>
            <a href="#" className="hover:underline">Privacy</a>
            <span>·</span>
            <div className="flex items-center gap-1">
              <a href="#" className="hover:underline">Your Privacy Choices</a>
              <div className="w-6">
                <img 
                  src="/your-choices-icon.svg" 
                  alt="Your Choices" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
