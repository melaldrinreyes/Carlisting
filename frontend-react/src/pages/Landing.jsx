import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';
import Card from '../components/Card';
import CarCard from '../components/CarCard';
import { carsData } from '../data/carsData';
import { 
  FaCar, 
  FaShieldAlt, 
  FaMoneyBillWave, 
  FaTools, 
  FaHeadset, 
  FaLock,
  FaSearch,
  FaClipboardCheck,
  FaKey,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt
} from 'react-icons/fa';
import { 
  HiSparkles, 
  HiCheckCircle 
} from 'react-icons/hi';
import { 
  IoRocketSharp 
} from 'react-icons/io5';
import './Landing.css';

const Landing = () => {
  // Get featured cars (first 3)
  const featuredCars = carsData.slice(0, 3);

  return (
    <div className="landing">
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <span className="hero-badge">
            <HiSparkles className="badge-icon" />
            Premium Car Dealership
          </span>
          <h1 className="hero-title">Find Your Perfect Car Today</h1>
          <p className="hero-subtitle">
            Explore our premium collection of luxury and performance vehicles. From sedans to sports cars, we have it all.
          </p>
          <div className="hero-buttons">
            <Button variant="primary" href="#/listings">
              <FaCar className="btn-icon" />
              View All Inventory
            </Button>
            <Button variant="secondary" href="#/order">
              <IoRocketSharp className="btn-icon" />
              Get Started
            </Button>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <FaCar className="stat-icon" />
              <span className="stat-number">500+</span>
              <span className="stat-label">Cars Available</span>
            </div>
            <div className="stat">
              <HiCheckCircle className="stat-icon" />
              <span className="stat-number">15K+</span>
              <span className="stat-label">Happy Customers</span>
            </div>
            <div className="stat">
              <FaShieldAlt className="stat-icon" />
              <span className="stat-number">25+</span>
              <span className="stat-label">Years Experience</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section className="featured-cars">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Vehicles</h2>
            <p className="section-description">Handpicked premium cars just for you</p>
          </div>
          <div className="featured-grid">
            {featuredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
          <div className="view-all-container">
            <Button variant="primary" href="#/listings">View All Cars</Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <p className="section-description">Get your dream car in 3 simple steps</p>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-icon-wrapper">
                <FaSearch className="step-icon" />
              </div>
              <div className="step-number">Step 1</div>
              <h3>Browse & Search</h3>
              <p>Explore our extensive inventory of premium vehicles and filter by your preferences</p>
            </div>
            <div className="step-card">
              <div className="step-icon-wrapper">
                <FaClipboardCheck className="step-icon" />
              </div>
              <div className="step-number">Step 2</div>
              <h3>Select & Inspect</h3>
              <p>Choose your favorite car and schedule a test drive or virtual inspection</p>
            </div>
            <div className="step-card">
              <div className="step-icon-wrapper">
                <FaKey className="step-icon" />
              </div>
              <div className="step-number">Step 3</div>
              <h3>Purchase & Drive</h3>
              <p>Complete the paperwork and drive away in your new car with confidence</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose AutoDeals</h2>
          <div className="features-grid">
            <Card
              icon={<FaCar />}
              title="Premium Selection"
              description="Access to luxury and performance vehicles from top manufacturers worldwide"
            />
            <Card
              icon={<FaMoneyBillWave />}
              title="Best Value"
              description="Competitive pricing with transparent costs and flexible financing options"
            />
            <Card
              icon={<HiCheckCircle />}
              title="Certified Quality"
              description="All vehicles undergo rigorous 150-point inspection and certification"
            />
            <Card
              icon={<FaTools />}
              title="Warranty Included"
              description="Comprehensive warranty coverage and free maintenance for 12 months"
            />
            <Card
              icon={<FaLock />}
              title="Secure Payment"
              description="Bank-level security with multiple payment options and buyer protection"
            />
            <Card
              icon={<FaHeadset />}
              title="24/7 Support"
              description="Expert team available round the clock to assist with all your needs"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Find Your Dream Car?</h2>
          <p className="cta-description">
            Join thousands of satisfied customers who found their perfect vehicle with us
          </p>
          <div className="cta-buttons">
            <Button variant="secondary" href="#/order">Contact Sales Team</Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Landing;
