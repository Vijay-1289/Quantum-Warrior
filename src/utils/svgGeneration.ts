
// Simple AI-powered SVG generation utility
export const generateRelevantSVG = (concept: string, pageTitle: string, content: string): string => {
  console.log(`Generating SVG for concept: ${concept}, title: ${pageTitle}`);
  
  // Extract key themes from the content and concept
  const themes = extractThemes(concept, pageTitle, content);
  
  // Generate SVG based on themes
  return generateSVGFromThemes(themes, concept);
};

const extractThemes = (concept: string, title: string, content: string): string[] => {
  const themes: string[] = [];
  
  // Add concept-based themes
  if (concept.toLowerCase().includes('superposition')) {
    themes.push('quantum_states', 'wave_particle', 'probability');
  }
  if (concept.toLowerCase().includes('entanglement')) {
    themes.push('connected_particles', 'quantum_bonds', 'correlation');
  }
  if (concept.toLowerCase().includes('gate')) {
    themes.push('quantum_circuits', 'transformations', 'logic_gates');
  }
  if (concept.toLowerCase().includes('measurement')) {
    themes.push('observation', 'collapse', 'detection');
  }
  if (concept.toLowerCase().includes('qubit')) {
    themes.push('quantum_bit', 'sphere', 'states');
  }
  
  // Add content-based themes
  if (content.toLowerCase().includes('warrior') || title.toLowerCase().includes('adventure')) {
    themes.push('hero', 'journey', 'quest');
  }
  if (content.toLowerCase().includes('battle') || content.toLowerCase().includes('challenge')) {
    themes.push('conflict', 'challenge', 'victory');
  }
  if (title.toLowerCase().includes('deep dive') || content.toLowerCase().includes('theory')) {
    themes.push('knowledge', 'learning', 'discovery');
  }
  
  return themes.length > 0 ? themes : ['quantum', 'science', 'technology'];
};

const generateSVGFromThemes = (themes: string[], concept: string): string => {
  // Create a base SVG structure
  const width = 400;
  const height = 350;
  
  // Choose primary colors based on concept
  const colors = getConceptColors(concept);
  
  // Generate SVG elements based on themes
  let svgElements = '';
  
  if (themes.includes('quantum_states') || themes.includes('superposition')) {
    svgElements += generateSuperpositionElements(colors);
  } else if (themes.includes('connected_particles') || themes.includes('entanglement')) {
    svgElements += generateEntanglementElements(colors);
  } else if (themes.includes('quantum_circuits') || themes.includes('logic_gates')) {
    svgElements += generateCircuitElements(colors);
  } else if (themes.includes('hero') || themes.includes('warrior')) {
    svgElements += generateHeroElements(colors);
  } else if (themes.includes('knowledge') || themes.includes('learning')) {
    svgElements += generateKnowledgeElements(colors);
  } else if (themes.includes('challenge') || themes.includes('battle')) {
    svgElements += generateBattleElements(colors);
  } else {
    svgElements += generateGenericQuantumElements(colors);
  }
  
  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="quantumGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${colors.primary};stop-opacity:0.8" />
          <stop offset="50%" style="stop-color:${colors.secondary};stop-opacity:0.6" />
          <stop offset="100%" style="stop-color:${colors.accent};stop-opacity:0.8" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <rect width="100%" height="100%" fill="url(#quantumGradient)" opacity="0.1"/>
      ${svgElements}
    </svg>
  `;
};

const getConceptColors = (concept: string): { primary: string; secondary: string; accent: string } => {
  const conceptLower = concept.toLowerCase();
  
  if (conceptLower.includes('superposition')) {
    return { primary: '#8B5CF6', secondary: '#06B6D4', accent: '#10B981' };
  } else if (conceptLower.includes('entanglement')) {
    return { primary: '#EF4444', secondary: '#F59E0B', accent: '#8B5CF6' };
  } else if (conceptLower.includes('gate')) {
    return { primary: '#3B82F6', secondary: '#6366F1', accent: '#8B5CF6' };
  } else if (conceptLower.includes('measurement')) {
    return { primary: '#10B981', secondary: '#059669', accent: '#06B6D4' };
  }
  
  return { primary: '#8B5CF6', secondary: '#06B6D4', accent: '#F59E0B' };
};

const generateSuperpositionElements = (colors: any): string => {
  return `
    <g filter="url(#glow)">
      <!-- Quantum particle in superposition -->
      <circle cx="200" cy="175" r="40" fill="${colors.primary}" opacity="0.6"/>
      <circle cx="160" cy="175" r="30" fill="${colors.secondary}" opacity="0.4"/>
      <circle cx="240" cy="175" r="30" fill="${colors.accent}" opacity="0.4"/>
      
      <!-- Wave patterns -->
      <path d="M 50 100 Q 100 80 150 100 T 250 100 T 350 100" stroke="${colors.primary}" stroke-width="3" fill="none" opacity="0.7"/>
      <path d="M 50 120 Q 100 140 150 120 T 250 120 T 350 120" stroke="${colors.secondary}" stroke-width="3" fill="none" opacity="0.7"/>
      <path d="M 50 250 Q 100 230 150 250 T 250 250 T 350 250" stroke="${colors.accent}" stroke-width="3" fill="none" opacity="0.7"/>
      
      <!-- Probability clouds -->
      <ellipse cx="200" cy="175" rx="80" ry="40" fill="${colors.primary}" opacity="0.2"/>
    </g>
  `;
};

const generateEntanglementElements = (colors: any): string => {
  return `
    <g filter="url(#glow)">
      <!-- Entangled particles -->
      <circle cx="120" cy="175" r="25" fill="${colors.primary}" opacity="0.8"/>
      <circle cx="280" cy="175" r="25" fill="${colors.primary}" opacity="0.8"/>
      
      <!-- Connection lines -->
      <path d="M 145 175 Q 200 120 255 175" stroke="${colors.secondary}" stroke-width="4" fill="none"/>
      <path d="M 145 175 Q 200 230 255 175" stroke="${colors.accent}" stroke-width="4" fill="none"/>
      
      <!-- Energy spirals -->
      <path d="M 120 175 m -15,0 a 15,15 0 1,1 30,0 a 12,12 0 1,1 -24,0 a 9,9 0 1,1 18,0 a 6,6 0 1,1 -12,0" 
            stroke="${colors.secondary}" stroke-width="2" fill="none" opacity="0.7"/>
      <path d="M 280 175 m -15,0 a 15,15 0 1,1 30,0 a 12,12 0 1,1 -24,0 a 9,9 0 1,1 18,0 a 6,6 0 1,1 -12,0" 
            stroke="${colors.accent}" stroke-width="2" fill="none" opacity="0.7"/>
    </g>
  `;
};

const generateCircuitElements = (colors: any): string => {
  return `
    <g filter="url(#glow)">
      <!-- Quantum circuit lines -->
      <line x1="50" y1="130" x2="350" y2="130" stroke="${colors.primary}" stroke-width="3"/>
      <line x1="50" y1="175" x2="350" y2="175" stroke="${colors.primary}" stroke-width="3"/>
      <line x1="50" y1="220" x2="350" y2="220" stroke="${colors.primary}" stroke-width="3"/>
      
      <!-- Quantum gates -->
      <rect x="120" y="115" width="30" height="30" fill="${colors.secondary}" opacity="0.8" rx="5"/>
      <rect x="200" y="160" width="30" height="30" fill="${colors.accent}" opacity="0.8" rx="5"/>
      <rect x="280" y="205" width="30" height="30" fill="${colors.secondary}" opacity="0.8" rx="5"/>
      
      <!-- Gate labels -->
      <text x="135" y="135" text-anchor="middle" fill="white" font-size="12" font-weight="bold">H</text>
      <text x="215" y="180" text-anchor="middle" fill="white" font-size="12" font-weight="bold">X</text>
      <text x="295" y="225" text-anchor="middle" fill="white" font-size="12" font-weight="bold">Z</text>
      
      <!-- Control connections -->
      <circle cx="135" cy="175" r="3" fill="${colors.primary}"/>
      <line x1="135" y1="145" x2="135" y2="172" stroke="${colors.primary}" stroke-width="2"/>
    </g>
  `;
};

const generateHeroElements = (colors: any): string => {
  return `
    <g filter="url(#glow)">
      <!-- Hero figure -->
      <circle cx="200" cy="140" r="20" fill="${colors.primary}" opacity="0.8"/>
      <rect x="185" y="160" width="30" height="40" fill="${colors.secondary}" opacity="0.8" rx="5"/>
      <rect x="180" y="200" width="10" height="25" fill="${colors.accent}" opacity="0.8"/>
      <rect x="210" y="200" width="10" height="25" fill="${colors.accent}" opacity="0.8"/>
      
      <!-- Quantum energy aura -->
      <circle cx="200" cy="175" r="60" fill="none" stroke="${colors.primary}" stroke-width="2" opacity="0.4"/>
      <circle cx="200" cy="175" r="80" fill="none" stroke="${colors.secondary}" stroke-width="2" opacity="0.3"/>
      <circle cx="200" cy="175" r="100" fill="none" stroke="${colors.accent}" stroke-width="2" opacity="0.2"/>
      
      <!-- Quantum particles around hero -->
      <circle cx="150" cy="120" r="3" fill="${colors.accent}" opacity="0.9"/>
      <circle cx="250" cy="130" r="3" fill="${colors.secondary}" opacity="0.9"/>
      <circle cx="170" cy="230" r="3" fill="${colors.primary}" opacity="0.9"/>
      <circle cx="230" cy="220" r="3" fill="${colors.accent}" opacity="0.9"/>
    </g>
  `;
};

const generateKnowledgeElements = (colors: any): string => {
  return `
    <g filter="url(#glow)">
      <!-- Book/knowledge symbol -->
      <rect x="150" y="130" width="100" height="80" fill="${colors.primary}" opacity="0.6" rx="5"/>
      <rect x="155" y="135" width="90" height="70" fill="white" opacity="0.9" rx="3"/>
      
      <!-- Knowledge streams -->
      <path d="M 200 130 Q 180 100 160 80" stroke="${colors.secondary}" stroke-width="3" fill="none" opacity="0.7"/>
      <path d="M 200 130 Q 220 100 240 80" stroke="${colors.accent}" stroke-width="3" fill="none" opacity="0.7"/>
      <path d="M 200 210 Q 180 240 160 270" stroke="${colors.secondary}" stroke-width="3" fill="none" opacity="0.7"/>
      <path d="M 200 210 Q 220 240 240 270" stroke="${colors.accent}" stroke-width="3" fill="none" opacity="0.7"/>
      
      <!-- Quantum formulas/symbols -->
      <text x="200" y="165" text-anchor="middle" fill="${colors.primary}" font-size="16" font-weight="bold">ψ</text>
      <text x="180" y="185" text-anchor="middle" fill="${colors.secondary}" font-size="12">|0⟩</text>
      <text x="220" y="185" text-anchor="middle" fill="${colors.accent}" font-size="12">|1⟩</text>
      
      <!-- Floating knowledge particles -->
      <circle cx="140" cy="110" r="4" fill="${colors.accent}" opacity="0.8"/>
      <circle cx="260" cy="120" r="4" fill="${colors.secondary}" opacity="0.8"/>
      <circle cx="130" cy="250" r="4" fill="${colors.primary}" opacity="0.8"/>
      <circle cx="270" cy="240" r="4" fill="${colors.accent}" opacity="0.8"/>
    </g>
  `;
};

const generateBattleElements = (colors: any): string => {
  return `
    <g filter="url(#glow)">
      <!-- Battle energy burst -->
      <polygon points="200,80 220,160 280,160 230,210 250,290 200,240 150,290 170,210 120,160 180,160" 
               fill="${colors.primary}" opacity="0.6"/>
      
      <!-- Quantum shields/barriers -->
      <path d="M 100 175 Q 150 125 200 175 Q 250 125 300 175" stroke="${colors.secondary}" stroke-width="4" fill="none"/>
      <path d="M 100 175 Q 150 225 200 175 Q 250 225 300 175" stroke="${colors.accent}" stroke-width="4" fill="none"/>
      
      <!-- Energy projectiles -->
      <circle cx="120" cy="140" r="6" fill="${colors.accent}" opacity="0.9"/>
      <circle cx="280" cy="140" r="6" fill="${colors.secondary}" opacity="0.9"/>
      <circle cx="150" cy="210" r="6" fill="${colors.primary}" opacity="0.9"/>
      <circle cx="250" cy="210" r="6" fill="${colors.accent}" opacity="0.9"/>
      
      <!-- Motion lines -->
      <path d="M 110 140 L 90 135" stroke="${colors.accent}" stroke-width="2" opacity="0.7"/>
      <path d="M 290 140 L 310 135" stroke="${colors.secondary}" stroke-width="2" opacity="0.7"/>
    </g>
  `;
};

const generateGenericQuantumElements = (colors: any): string => {
  return `
    <g filter="url(#glow)">
      <!-- Central quantum symbol -->
      <circle cx="200" cy="175" r="50" fill="none" stroke="${colors.primary}" stroke-width="3" opacity="0.6"/>
      <circle cx="200" cy="175" r="30" fill="${colors.secondary}" opacity="0.4"/>
      
      <!-- Quantum orbits -->
      <ellipse cx="200" cy="175" rx="80" ry="20" fill="none" stroke="${colors.accent}" stroke-width="2" opacity="0.6"/>
      <ellipse cx="200" cy="175" rx="20" ry="80" fill="none" stroke="${colors.secondary}" stroke-width="2" opacity="0.6"/>
      
      <!-- Quantum particles -->
      <circle cx="280" cy="175" r="4" fill="${colors.primary}" opacity="0.9"/>
      <circle cx="120" cy="175" r="4" fill="${colors.primary}" opacity="0.9"/>
      <circle cx="200" cy="95" r="4" fill="${colors.accent}" opacity="0.9"/>
      <circle cx="200" cy="255" r="4" fill="${colors.accent}" opacity="0.9"/>
      
      <!-- Wave patterns -->
      <path d="M 50 80 Q 100 60 150 80 T 250 80 T 350 80" stroke="${colors.secondary}" stroke-width="2" fill="none" opacity="0.5"/>
      <path d="M 50 270 Q 100 290 150 270 T 250 270 T 350 270" stroke="${colors.accent}" stroke-width="2" fill="none" opacity="0.5"/>
    </g>
  `;
};
