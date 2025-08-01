import React from 'react';
import { motion } from 'framer-motion';
import { PersonalityShowcase } from './components/PersonalityShowcase';
import { VSCodeIntegration } from './components/VSCodeIntegration';
import { customerProfiles, enterpriseClients } from './data/customerSuccess';

function App() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">🤖</div>
              <div>
                <h1 className="text-xl font-bold">AI Code Assistant Pro</h1>
                <p className="text-sm text-gray-600">by HOILTD.com</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="#features" className="text-gray-600 hover:text-blue-600">Features</a>
              <a href="#personalities" className="text-gray-600 hover:text-blue-600">Personalities</a>
              <a href="#customers" className="text-gray-600 hover:text-blue-600">Customers</a>
              <a href="#enterprise" className="text-gray-600 hover:text-blue-600">Enterprise</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              🐝 <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Beehive Intelligence
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
              The world's first VS Code extension with <strong>10 specialized AI personalities</strong> 
              and proven local LLM configurations tested on <strong>300+ real customer setups!</strong>
            </p>
            
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-8">
              <div className="flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full">
                <span className="text-2xl mr-2">🏆</span>
                <span className="font-semibold">95% Success Rate</span>
              </div>
              <div className="flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
                <span className="text-2xl mr-2">⚡</span>
                <span className="font-semibold">2-3 Second Responses</span>
              </div>
              <div className="flex items-center bg-purple-100 text-purple-800 px-4 py-2 rounded-full">
                <span className="text-2xl mr-2">🔐</span>
                <span className="font-semibold">Privacy-First</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* VS Code Integration */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <VSCodeIntegration />
        </div>
      </section>

      {/* Personality Showcase */}
      <section id="personalities">
        <PersonalityShowcase />
      </section>

      {/* Customer Success */}
      <section id="customers" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">📊 Real Customer Success Data</h2>
            <p className="text-xl text-gray-600">
              Performance benchmarks from 300+ tested customer setups
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {customerProfiles.map((profile, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">
                    {profile.type === 'PowerUser' ? '🏆' : 
                     profile.type === 'StandardUser' ? '🎯' : '💡'}
                  </div>
                  <h3 className="text-xl font-bold">{profile.name}</h3>
                  <p className="text-gray-600">{profile.hardware.ram/1024}GB RAM, {profile.hardware.cpu} cores</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Model:</span>
                    <span className="font-semibold">{profile.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Success Rate:</span>
                    <span className="font-semibold text-green-600">{profile.performance.successRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Response Time:</span>
                    <span className="font-semibold">{profile.performance.responseTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Customer Rating:</span>
                    <span className="font-semibold">{profile.performance.rating}/5.0 ⭐</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tested Count:</span>
                    <span className="font-semibold">{profile.performance.testedCount}+ setups</span>
                  </div>
                </div>
                
                {profile.testimonial && (
                  <div className="mt-4 p-4 bg-white rounded border-l-4 border-blue-500">
                    <p className="text-sm italic mb-2">"{profile.testimonial.quote}"</p>
                    <p className="text-xs text-gray-600">
                      — {profile.testimonial.role}, {profile.testimonial.company}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Section */}
      <section id="enterprise" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">🏢 Enterprise Success Stories</h2>
            <p className="text-xl text-gray-600">
              Trusted by organizations that demand the highest standards
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {enterpriseClients.map((client, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-bold mb-2">{client.name}</h3>
                <p className="text-blue-600 font-semibold mb-3">{client.industry}</p>
                <p className="text-gray-700 mb-3">{client.benefit}</p>
                <div className="flex justify-between text-sm">
                  <span className="bg-gray-100 px-2 py-1 rounded">{client.setup}</span>
                  <span className="font-semibold">{client.size}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">🏢 Professional Support</h3>
              <p className="text-gray-700 mb-6">
                Home & Office Improvements Ltd provides enterprise-grade support with 22+ years 
                of professional software development experience.
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>UK Phone:</strong> +44 208 150 7575<br/>
                  <strong>US Phone:</strong> +1 602 880 8835<br/>
                  <strong>Email:</strong> info@hoiltd.com
                </div>
                <div>
                  <strong>Companies House:</strong> #04951269<br/>
                  <strong>Address:</strong> London, UK<br/>
                  <strong>Website:</strong> hoiltd.com
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">🤖 AI Code Assistant Pro</h3>
              <p className="text-gray-400">
                Professional AI coding assistant with 10 specialized personalities 
                and proven local LLM configurations.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#personalities" className="hover:text-white">Personalities</a></li>
                <li><a href="#customers" className="hover:text-white">Customer Success</a></li>
                <li><a href="#enterprise" className="hover:text-white">Enterprise</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="https://marketplace.visualstudio.com/items?itemName=hoiltd-com.ai-code-assistant-pro" className="hover:text-white">VS Code Marketplace</a></li>
                <li><a href="https://github.com/HOME-OFFICE-IMPROVEMENTS-LTD/ai-code-assistant-pro" className="hover:text-white">GitHub</a></li>
                <li><a href="https://hoiltd.com" className="hover:text-white">HOILTD.com</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>📧 info@hoiltd.com</li>
                <li>🇬🇧 +44 208 150 7575</li>
                <li>🇺🇸 +1 602 880 8835</li>
                <li>🏢 London, UK</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2025 Home & Office Improvements Ltd. Professional Software Development Since 2003.</p>
            <p className="mt-2">🎯 "The customer is the judge" - Real performance data, not marketing promises.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
