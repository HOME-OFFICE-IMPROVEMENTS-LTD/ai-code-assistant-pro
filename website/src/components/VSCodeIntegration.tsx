import React from 'react';
import { ExternalLink, Download, Zap } from 'lucide-react';

export const VSCodeIntegration: React.FC = () => {
  const extensionId = 'hoiltd-com.ai-code-assistant-pro';
  const vscodeDevUrl = `https://vscode.dev/extension/${extensionId}`;
  const marketplaceUrl = `https://marketplace.visualstudio.com/items?itemName=${extensionId}`;
  
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-4">🚀 Try AI Code Assistant Pro Now!</h2>
        <p className="text-lg opacity-90">
          Experience the power of 10 specialized AI personalities with zero setup
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-4">
        {/* VS Code.dev Integration */}
        <a
          href={vscodeDevUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white/20 hover:bg-white/30 transition-all duration-300 p-6 rounded-lg text-center group"
        >
          <Zap className="w-12 h-12 mx-auto mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-xl font-semibold mb-2">Try Online</h3>
          <p className="text-sm opacity-90">Open instantly in VS Code.dev</p>
          <ExternalLink className="w-4 h-4 inline ml-2" />
        </a>
        
        {/* Marketplace Download */}
        <a
          href={marketplaceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white/20 hover:bg-white/30 transition-all duration-300 p-6 rounded-lg text-center group"
        >
          <Download className="w-12 h-12 mx-auto mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-xl font-semibold mb-2">Install Extension</h3>
          <p className="text-sm opacity-90">Download from VS Code Marketplace</p>
          <ExternalLink className="w-4 h-4 inline ml-2" />
        </a>
        
        {/* DevContainer Setup */}
        <div className="bg-white/20 p-6 rounded-lg text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-white/30 rounded-full flex items-center justify-center">
            🏭
          </div>
          <h3 className="text-xl font-semibold mb-2">Zero Setup</h3>
          <p className="text-sm opacity-90">DevContainer ready in 5 minutes</p>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <div className="inline-flex items-center bg-white/20 rounded-full px-4 py-2">
          <span className="text-sm">
            🏢 Professional support by HOILTD.com | 22+ years experience
          </span>
        </div>
      </div>
    </div>
  );
};
