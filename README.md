# Penrose Staircase Animation

A 2D SVG implementation of the famous Penrose staircase (impossible staircase) with scroll-based step highlighting.

## Features

- SVG-based implementation of the impossible staircase illusion
- Interactive step highlighting synchronized with scroll position
- Two perspective views (toggle between them)
- Responsive design works on desktop and mobile devices
- Keyboard navigation and touch swipe support

## How It Works

The Penrose staircase is an optical illusion that appears to be a continuous staircase that loops back on itself in an impossible way. This implementation uses SVG to create the illusion from a specific perspective.

The key features of this implementation:

1. **SVG Structure**: The staircase is built using SVG paths to create the illusion of depth
2. **Progressive Highlighting**: As you scroll, steps light up sequentially to guide the user through the impossible loop
3. **Perspective Toggle**: Switch between views to better understand how the illusion works

## Files

- `index.html` - HTML structure with SVG staircase implementation
- `styles.css` - Styling and animations
- `script.js` - JavaScript for scroll interaction and step highlighting

## Implementation Notes

Creating an effective Penrose staircase is challenging because the illusion relies on forced perspective and visual ambiguity. Key implementation techniques used:

- Strategic placement of visual elements to create impossible connections
- Careful coloring and shading for a sense of depth
- SVG structure that maintains the illusion from specific viewpoints

## Inspired By

The implementation is inspired by the mathematical concept invented by Lionel and Roger Penrose, and famously depicted in the works of M.C. Escher.
