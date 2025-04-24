// Penrose Stairs component
class PenroseStairs {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error(`Container with ID '${containerId}' not found.`);
      return;
    }
    
    this.createSvg();
  }
  
  createSvg() {
    // Clear container
    this.container.innerHTML = '';
    
    // Create SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 500 400');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('id', 'penrose-stairs-svg');
    
    // Draw the Penrose Stairs
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', 'translate(125, 100)');
    
    // Add all elements to the SVG
    this.appendMainStructure(g);
    this.appendStairs(g);
    this.appendConnectingLines(g);
    
    svg.appendChild(g);
    this.container.appendChild(svg);
  }
  
  appendMainStructure(g) {
    // Main rectangular block - front face
    const frontFace = this.createPolygon(
      '0,150 250,150 250,60 0,60',
      '#b3b3b3'
    );
    g.appendChild(frontFace);
    
    // Main rectangular block - top face
    const topFace = this.createPolygon(
      '0,60 250,60 220,30 30,30',
      '#d9d9d9'
    );
    g.appendChild(topFace);
    
    // Main rectangular block - right face
    const rightFace = this.createPolygon(
      '250,60 250,150 220,120 220,30',
      '#999999'
    );
    g.appendChild(rightFace);
    
    // Central triangular area
    const triangleArea = this.createPolygon(
      '95,60 155,60 125,35 95,60',
      '#808080'
    );
    g.appendChild(triangleArea);
  }
  
  appendStairs(g) {
    // Group for bottom stairs (front row)
    const bottomStairs = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    
    // Left section - 4 steps
    bottomStairs.appendChild(this.createPolygon('30,60 50,60 50,50 30,50', '#ffffff'));
    bottomStairs.appendChild(this.createPolygon('50,60 70,60 70,50 50,50', '#ffffff'));
    bottomStairs.appendChild(this.createPolygon('70,60 85,60 85,50 70,50', '#ffffff'));
    bottomStairs.appendChild(this.createPolygon('85,60 95,60 95,50 85,50', '#ffffff'));
    
    // Right section - 4 steps
    bottomStairs.appendChild(this.createPolygon('155,60 170,60 170,50 155,50', '#ffffff'));
    bottomStairs.appendChild(this.createPolygon('170,60 185,60 185,50 170,50', '#ffffff'));
    bottomStairs.appendChild(this.createPolygon('185,60 205,60 205,50 185,50', '#ffffff'));
    bottomStairs.appendChild(this.createPolygon('205,60 220,60 220,50 205,50', '#ffffff'));
    
    g.appendChild(bottomStairs);
    
    // Group for right side stairs (ascending)
    const rightStairs = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    
    rightStairs.appendChild(this.createPolygon('220,50 220,40 205,40 205,50', '#ffffff'));
    rightStairs.appendChild(this.createPolygon('205,50 205,40 185,40 185,50', '#ffffff'));
    rightStairs.appendChild(this.createPolygon('185,50 185,40 170,40 170,50', '#ffffff'));
    rightStairs.appendChild(this.createPolygon('170,50 170,40 155,40 155,50', '#ffffff'));
    
    g.appendChild(rightStairs);
    
    // Group for top row stairs
    const topStairs = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    
    // Right section
    topStairs.appendChild(this.createPolygon('155,40 155,30 170,30 170,40', '#ffffff'));
    topStairs.appendChild(this.createPolygon('170,40 170,30 185,30 185,40', '#ffffff'));
    topStairs.appendChild(this.createPolygon('185,40 185,30 205,30 205,40', '#ffffff'));
    topStairs.appendChild(this.createPolygon('205,40 205,30 220,30 220,40', '#ffffff'));
    
    // Left section
    topStairs.appendChild(this.createPolygon('30,40 30,30 50,30 50,40', '#ffffff'));
    topStairs.appendChild(this.createPolygon('50,40 50,30 70,30 70,40', '#ffffff'));
    topStairs.appendChild(this.createPolygon('70,40 70,30 85,30 85,40', '#ffffff'));
    topStairs.appendChild(this.createPolygon('85,40 85,30 95,30 95,40', '#ffffff'));
    
    g.appendChild(topStairs);
    
    // Group for left side stairs (descending)
    const leftStairs = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    
    leftStairs.appendChild(this.createPolygon('30,50 30,40 50,40 50,50', '#ffffff'));
    leftStairs.appendChild(this.createPolygon('50,50 50,40 70,40 70,50', '#ffffff'));
    leftStairs.appendChild(this.createPolygon('70,50 70,40 85,40 85,50', '#ffffff'));
    leftStairs.appendChild(this.createPolygon('85,50 85,40 95,40 95,50', '#ffffff'));
    
    g.appendChild(leftStairs);
  }
  
  appendConnectingLines(g) {
    // Vertical connection lines for stairs
    const verticalLines = [
      '30,50 30,40', '50,50 50,40', '70,50 70,40', '85,50 85,40', '95,50 95,40',
      '155,50 155,40', '170,50 170,40', '185,50 185,40', '205,50 205,40', '220,50 220,40'
    ];
    
    verticalLines.forEach(points => {
      g.appendChild(this.createLine(points));
    });
    
    // Central triangle connecting lines
    g.appendChild(this.createLine('95,60 125,35'));
    g.appendChild(this.createLine('125,35 155,60'));
    g.appendChild(this.createLine('95,40 155,40'));
  }
  
  createPolygon(points, fill) {
    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    polygon.setAttribute('points', points);
    polygon.setAttribute('fill', fill);
    polygon.setAttribute('stroke', '#000000');
    polygon.setAttribute('stroke-width', '1');
    return polygon;
  }
  
  createLine(points) {
    const [start, end] = points.split(' ');
    const [x1, y1] = start.split(',');
    const [x2, y2] = end.split(',');
    
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', '#000000');
    line.setAttribute('stroke-width', '1');
    return line;
  }
}

// Export the component
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PenroseStairs;
}
