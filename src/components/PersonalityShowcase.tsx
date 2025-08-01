import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Personality {
  id: string;
  name: string;
  emoji: string;
  title: string;
  specialization: string;
  cluster: string;
  description: string;
  example: string;
}

const personalities: Personality[] = [
  {
    id: 'buzzy',
    name: 'Buzzy',
    emoji: '⚡',
    title: 'Performance Expert',
    specialization: 'Code optimization, benchmarking, memory efficiency',
    cluster: 'Performance & Architecture',
    description: 'Specializes in performance optimization and system efficiency',
    example: 'Optimizes loops, reduces memory usage, improves algorithm efficiency'
  },
  {
    id: 'builder',
    name: 'Builder',
    emoji: '🔨',
    title: 'Architecture Guru',
    specialization: 'System design, patterns, scalability, modularity',
    cluster: 'Performance & Architecture',
    description: 'Expert in software architecture and design patterns',
    example: 'Designs scalable systems, implements design patterns, plans architecture'
  },
  {
    id: 'scout',
    name: 'Scout',
    emoji: '🔍',
    title: 'Code Analyst',
    specialization: 'Code analysis, bug detection, quality assurance',
    cluster: 'Analysis & Security',
    description: 'Analyzes code quality and detects potential issues',
    example: 'Reviews code, finds bugs, suggests improvements, quality metrics'
  },
  {
    id: 'guardian',
    name: 'Guardian',
    emoji: '🛡️',
    title: 'Security Expert',
    specialization: 'Security auditing, vulnerability scanning, compliance',
    cluster: 'Analysis & Security',
    description: 'Focuses on security and compliance requirements',
    example: 'Security audits, vulnerability detection, compliance checking'
  },
  {
    id: 'spark',
    name: 'Spark',
    emoji: '✨',
    title: 'Innovation Master',
    specialization: 'Creative solutions, modern technologies, emerging tech',
    cluster: 'Innovation & Documentation',
    description: 'Brings creative and innovative solutions to challenges',
    example: 'Suggests modern approaches, explores new technologies, creative solutions'
  },
  {
    id: 'scribe',
    name: 'Scribe',
    emoji: '📝',
    title: 'Documentation Pro',
    specialization: 'Technical writing, API docs, tutorials, explanations',
    cluster: 'Innovation & Documentation',
    description: 'Expert in technical documentation and communication',
    example: 'Writes documentation, explains code, creates tutorials, API docs'
  },
  {
    id: 'metrics',
    name: 'Metrics',
    emoji: '📊',
    title: 'Analytics Expert',
    specialization: 'Performance metrics, monitoring, business intelligence',
    cluster: 'Data & Analytics',
    description: 'Specializes in analytics and performance monitoring',
    example: 'Monitors performance, creates dashboards, analyzes metrics'
  },
  {
    id: 'honey',
    name: 'Honey',
    emoji: '🍯',
    title: 'Data Expert',
    specialization: 'Data structures, database optimization, distributed systems',
    cluster: 'Data & Analytics',
    description: 'Expert in data management and storage optimization',
    example: 'Optimizes databases, designs data structures, manages storage'
  },
  {
    id: 'flash',
    name: 'Flash',
    emoji: '⚡',
    title: 'Speed Expert',
    specialization: 'CI/CD, automation, rapid prototyping, productivity',
    cluster: 'Speed & Quality',
    description: 'Focuses on development speed and automation',
    example: 'Sets up CI/CD, automates workflows, rapid development'
  },
  {
    id: 'tester',
    name: 'Tester',
    emoji: '🧪',
    title: 'QA Expert',
    specialization: 'Testing strategies, automation, quality metrics',
    cluster: 'Speed & Quality',
    description: 'Expert in testing and quality assurance',
    example: 'Creates tests, test automation, quality assurance strategies'
  }
];

export const PersonalityShowcase: React.FC = () => {
  const [selectedPersonality, setSelectedPersonality] = useState<Personality | null>(null);
  
  const clusters = [
    'Performance & Architecture',
    'Analysis & Security', 
    'Innovation & Documentation',
    'Data & Analytics',
    'Speed & Quality'
  ];
  
  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">🐝 Meet Your AI Beehive Team</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            10 specialized AI personalities working together like a professional development team. 
            Each expert brings unique skills to solve your coding challenges.
          </p>
        </div>
        
        {/* Personality Grid */}
        <div className="grid md:grid-cols-5 gap-6 mb-8">
          {personalities.map((personality) => (
            <motion.div
              key={personality.id}
              className="bg-white p-6 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              onClick={() => setSelectedPersonality(personality)}
            >
              <div className="text-4xl text-center mb-3">{personality.emoji}</div>
              <h3 className="text-lg font-semibold text-center mb-2">{personality.name}</h3>
              <p className="text-sm text-gray-600 text-center">{personality.title}</p>
            </motion.div>
          ))}
        </div>
        
        {/* Selected Personality Details */}
        <AnimatePresence>
          {selectedPersonality && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white p-8 rounded-lg shadow-lg"
            >
              <div className="flex items-center mb-4">
                <span className="text-6xl mr-4">{selectedPersonality.emoji}</span>
                <div>
                  <h3 className="text-2xl font-bold">{selectedPersonality.name}</h3>
                  <p className="text-lg text-gray-600">{selectedPersonality.title}</p>
                  <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {selectedPersonality.cluster}
                  </span>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Specialization:</h4>
                  <p className="text-gray-700 mb-4">{selectedPersonality.specialization}</p>
                  
                  <h4 className="font-semibold mb-2">Description:</h4>
                  <p className="text-gray-700">{selectedPersonality.description}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Example Tasks:</h4>
                  <p className="text-gray-700">{selectedPersonality.example}</p>
                  
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      💡 <strong>Pro Tip:</strong> Each personality can collaborate with others for complex tasks!
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <button
                  onClick={() => setSelectedPersonality(null)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Close Details
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
