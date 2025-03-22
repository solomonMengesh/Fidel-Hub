import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Github } from "lucide-react";

const Footer = () => {

  const categories = [
    'Development',
    'Business',
    'Finance',
    'Design',
    'Marketing',
    'Photography',
    'Music'
  ];
  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-12 px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link 
              to="/" 
              className="text-2xl font-display font-bold text-slate-900 dark:text-white flex items-center"
            >
              <span className="bg-fidel-500 text-white h-8 w-8 rounded-lg flex items-center justify-center mr-2 shadow-lg">F</span>
              Fidel<span className="text-fidel-500">Hub</span>
            </Link>
            <p className="mt-4 text-muted-foreground text-sm">
              A modern, interactive learning platform designed to enhance the education experience for students.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-fidel-500 transition-colors duration-200">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-fidel-500 transition-colors duration-200">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-fidel-500 transition-colors duration-200">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-fidel-500 transition-colors duration-200">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-fidel-500 transition-colors duration-200">
                <Github size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-base font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-fidel-500 transition-colors duration-200 text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/courses" className="text-muted-foreground hover:text-fidel-500 transition-colors duration-200 text-sm">
                  Courses
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-fidel-500 transition-colors duration-200 text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-fidel-500 transition-colors duration-200 text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
              <h4 className="font-medium text-lg mb-4">Categories</h4>
              <ul className="space-y-2">
                {categories.map((item) => (
                  <li key={item}>
                    <Link 
                      to={`/courses?category=${item.toLowerCase()}`} 
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          
          <div>
            <h3 className="text-base font-semibold mb-4">Contact Us</h3>
            <address className="not-italic text-sm text-muted-foreground">
            <p>123 Kombolcha Street</p>
            <p>Kombolcha, Ethiopia</p>
            <p class="mt-2">Email: info@fidelhub.edu</p>
            <p>Phone: +251 33 123 4567</p>

            </address>
          </div>
        </div>
        
        <div className="border-t border-slate-200 dark:border-slate-800 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Fidel Hub. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-fidel-500 transition-colors duration-200">
              Terms of Service
            </Link>
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-fidel-500 transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link to="/cookies" className="text-sm text-muted-foreground hover:text-fidel-500 transition-colors duration-200">
              Cookies Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
