const Footer = () => {
  return (
    <footer className="bg-blue-50 text-black p-6 text-center mt-10">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          {/* Location & Contact */}
          <div>
            <h2 className="font-semibold text-lg">Zidio Development</h2>
            <ul className="text-gray-600 space-y-2 mt-2">
              <li><a href="#">+91 123 9088 123</a></li>
              <li><a href="#">support@zidiotaskmanager.com</a></li>
              <li><a href="#">123 Task Manager, Bengaluru, India</a></li>
            </ul>
          </div>

          {/* Company Info */}
          <div>
            <h3 className="font-semibold text-lg">Company</h3>
            <ul className="text-gray-600 space-y-2 mt-2">
              <li><a href="#">Our Team</a></li>
              <li><a href="#">Refund Policy</a></li>
              <li><a href="#">Terms & Conditions</a></li>
              <li><a href="#">Privacy Policies</a></li>
              <li><a href="#">FAQs</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-lg">Services</h3>
            <ul className="text-gray-600 space-y-2 mt-2">
              <li><a href="#">IT Solutions</a></li>
              <li><a href="#">Digital Marketing</a></li>
              <li><a href="#">Data Analytics</a></li>
              <li><a href="#">Cyber Security</a></li>
              <li><a href="#">Cloud Services</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between mt-6 border-t border-gray-300 pt-4">
          {/* Copyright - Left */}
          <p className="text-gray-600">© 2025 Zidio Development, All Rights Reserved.</p>

          {/* Go On Top Button - Right */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition mt-4 md:mt-0"
          >
            <b>Go On Top</b>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
