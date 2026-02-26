import React from 'react';
import { Home, Target, Eye, Award, Users, Shield, TrendingUp, Heart, CheckCircle, Zap, Globe } from 'lucide-react';

const AboutUs = () => {
  const stats = [
    { number: '5000+', label: 'Properties Listed', icon: Home },
    { number: '12000+', label: 'Happy Clients', icon: Users },
    { number: '500+', label: 'Verified Owners', icon: Shield },
    { number: '4.8/5', label: 'Average Rating', icon: Award }
  ];

  const values = [
    {
      icon: Shield,
      title: 'Trust & Transparency',
      description: 'We verify every property and owner to ensure a safe and trustworthy platform for all users.'
    },
    {
      icon: Heart,
      title: 'Customer First',
      description: 'Your satisfaction is our priority. We go the extra mile to ensure the best rental experience.'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'Continuously improving our platform with the latest technology to make renting easier.'
    },
    {
      icon: Globe,
      title: 'Community',
      description: 'Building a strong community of renters and property owners in Pokhara and beyond.'
    }
  ];

  const team = [
    {
      name: 'Rajesh Sharma',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop',
      bio: '10+ years in real estate and technology'
    },
    {
      name: 'Priya Thapa',
      role: 'Head of Operations',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop',
      bio: 'Expert in property management systems'
    },
    {
      name: 'Anil Kumar',
      role: 'Lead Developer',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop',
      bio: 'Building cutting-edge rental solutions'
    },
    {
      name: 'Sita Gurung',
      role: 'Customer Success Manager',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop',
      bio: 'Dedicated to customer satisfaction'
    }
  ];

  const milestones = [
    {
      year: '2020',
      title: 'Company Founded',
      description: 'RentEase was born with a vision to simplify rental housing in Pokhara'
    },
    {
      year: '2021',
      title: '1000 Properties',
      description: 'Reached our first major milestone with 1000+ verified listings'
    },
    {
      year: '2023',
      title: 'Expansion',
      description: 'Expanded services to cover all major areas of Pokhara valley'
    },
    {
      year: '2025',
      title: 'Mobile App Launch',
      description: 'Launched mobile apps for iOS and Android platforms'
    },
    {
      year: '2026',
      title: 'Leading Platform',
      description: 'Became the #1 rental platform in Pokhara with 5000+ properties'
    }
  ];

  const features = [
    'Verified property listings',
    'Secure payment processing',
    '24/7 customer support',
    'Easy booking system',
    'Owner dashboard',
    'Advanced search filters',
    'Mobile friendly',
    'Community reviews'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Home className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-800">RentEase</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-700 hover:text-blue-600 transition">Home</a>
              <a href="#browse-rooms" className="text-gray-700 hover:text-blue-600 transition">Browse Rooms</a>
              <a href="#about" className="text-blue-600 font-medium">About</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 transition">Contact</a>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition">
                Login
              </button>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              About RentEase
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Transforming the way people find and list rental properties in Pokhara since 2020
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16 -mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-gradient-to-br from-blue-50 to-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition">
                  <Icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Target className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">Our Mission</h2>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed">
                To create a transparent, efficient, and user-friendly platform that connects property owners with renters, making the rental process seamless and stress-free for everyone in Pokhara. We strive to eliminate the hassles of traditional rental methods through technology and innovation.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                  <Eye className="w-8 h-8 text-purple-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">Our Vision</h2>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed">
                To become Nepal's most trusted and comprehensive rental platform, expanding our services across the country while maintaining our commitment to quality, transparency, and customer satisfaction. We envision a future where finding the perfect home is just a click away.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Story</h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              RentEase began with a simple idea: make rental housing accessible and transparent for everyone
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop" 
                alt="Office"
                className="rounded-lg shadow-xl"
              />
            </div>
            <div className="space-y-6">
              <p className="text-gray-600 text-lg leading-relaxed">
                Founded in 2020 by a team of real estate and technology professionals, RentEase was created to address the challenges faced by both property owners and renters in Pokhara. We noticed the lack of a centralized, trustworthy platform where people could easily find and list rental properties.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Starting with just 50 properties, we've grown to become Pokhara's leading rental platform with over 5,000 verified listings. Our success is built on trust, innovation, and a deep understanding of our users' needs.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Today, we're proud to have helped thousands of people find their perfect home and enabled hundreds of property owners to efficiently manage their rentals. But we're just getting started!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Core Values</h2>
            <p className="text-gray-600 text-lg">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Journey</h2>
            <p className="text-gray-600 text-lg">
              Key milestones in our growth story
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-blue-200 hidden lg:block"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex flex-col lg:flex-row gap-8 items-center ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                  <div className="flex-1 text-center lg:text-right">
                    {index % 2 === 0 && (
                      <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="text-2xl font-bold text-blue-600 mb-2">{milestone.year}</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{milestone.title}</h3>
                        <p className="text-gray-600">{milestone.description}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="w-12 h-12 bg-blue-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center z-10">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex-1 text-center lg:text-left">
                    {index % 2 !== 0 && (
                      <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="text-2xl font-bold text-blue-600 mb-2">{milestone.year}</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{milestone.title}</h3>
                        <p className="text-gray-600">{milestone.description}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Meet Our Team</h2>
            <p className="text-gray-600 text-lg">
              The passionate people behind RentEase
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition group">
                <div className="relative overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">What We Offer</h2>
            <p className="text-gray-600 text-lg">
              Comprehensive features for a seamless rental experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 bg-gray-50 rounded-lg p-4 hover:bg-blue-50 transition">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                <span className="text-gray-700 font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join Our Growing Community
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Whether you're looking for a room or listing a property, we're here for you
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition shadow-lg font-medium">
              Browse Properties
            </button>
            <button className="px-8 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition shadow-lg font-medium border-2 border-white">
              List Your Property
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Home className="w-8 h-8 text-blue-400" />
                <span className="text-2xl font-bold">RentEase</span>
              </div>
              <p className="text-gray-400">
                Your trusted platform for finding and listing rental properties in Pokhara.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">About Us</a></li>
                <li><a href="#" className="hover:text-white transition">How It Works</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">For Owners</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">List Property</a></li>
                <li><a href="#" className="hover:text-white transition">Owner Dashboard</a></li>
                <li><a href="#" className="hover:text-white transition">Resources</a></li>
                <li><a href="#" className="hover:text-white transition">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Pokhara, Nepal</li>
                <li>info@rentease.com</li>
                <li>+977 123-456-789</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 RentEase. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;