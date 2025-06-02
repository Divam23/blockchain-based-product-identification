import React from "react";
import {Link} from "react-router-dom"
import { FaCheckCircle, FaSearch, FaShieldAlt, FaQrcode } from "react-icons/fa";

const Home = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center py-32 bg-gradient-to-r from-blue-500 to-purple-600">
        <h1 className="text-5xl font-extrabold mb-4">Verify Product Authenticity in Seconds</h1>
        <p className="text-lg text-gray-200 max-w-2xl">
          Scan the QR code and instantly check if a product is genuine or fake. Protect yourself from counterfeit goods.
        </p>
        <button className="mt-6 px-6 py-3 bg-white text-blue-600 font-semibold rounded-full text-lg shadow-lg hover:bg-gray-100">
          <Link to="/verify">Scan Now</Link>
        </button>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 text-center">
        <h2 className="text-4xl font-bold mb-10">Why Choose Us?</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <FeatureCard icon={<FaShieldAlt />} title="Secure Verification" description="Our blockchain-powered system ensures tamper-proof verification." />
          <FeatureCard icon={<FaQrcode />} title="Instant Scanning" description="Quickly scan QR codes with real-time authentication." />
          <FeatureCard icon={<FaSearch />} title="Track Product History" description="Get complete insights into a product’s origin and authenticity." />
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-800 py-20 text-center px-6">
        <h2 className="text-4xl font-bold mb-10">How It Works?</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <StepCard step="1" title="Scan QR Code" description="Use your mobile camera or our scanner to scan the QR code." />
          <StepCard step="2" title="Verify Details" description="Check the product details fetched from our secure database." />
          <StepCard step="3" title="Confirm Authenticity" description="Get an instant result—authentic or fake—based on blockchain validation." />
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 text-center px-6">
        <h2 className="text-4xl font-bold mb-10">What Users Say</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Testimonial name="John Doe" feedback="This is a game-changer! I can now trust the products I buy online." />
          <Testimonial name="Emily Carter" feedback="Super easy to use and very fast verification!" />
          <Testimonial name="Mike Thompson" feedback="No more counterfeit worries. Best QR scanning platform ever!" />
        </div>
      </section>

      <section className="bg-gradient-to-r from-blue-500 to-purple-600 py-20 text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to Verify Your Product?</h2>
        <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-full text-lg shadow-lg hover:bg-gray-100">
          <Link to="/signup">Get Started</Link>
        </button>
      </section>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
    <div className="text-4xl text-blue-400 mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </div>
);

// Step Card Component
const StepCard = ({ step, title, description }) => (
  <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
    <div className="text-4xl font-bold text-blue-400 mb-2">Step {step}</div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </div>
);

// Testimonial Card Component
const Testimonial = ({ name, feedback }) => (
  <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
    <p className="text-gray-300 italic">“{feedback}”</p>
    <h4 className="mt-4 font-semibold text-blue-400">{name}</h4>
  </div>
);

export default Home;
