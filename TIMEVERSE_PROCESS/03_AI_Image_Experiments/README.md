# 03 · AI Image Experiments & Prompt Engineering

## 1. Prompt Engineering Pipeline
All environmental concepts and aesthetic references were iterated across Midjourney and ChatGPT (DALL-E 3) to establish lighting, composition, and color grading.

### A. Temporal Portal (Landing Screen)
- **Prompt v1**: *A time machine portal glowing in a dark room with sci-fi controls.*  
  *Critique*: Too cluttered and typical sci-fi cockpit; lacked scale and mystery.
- **Prompt v2 (Final)**: *An ethereal monolithic chronos portal ring suspended in a void, hyperrealistic, emitting cyan particle light beams, volumetric fog, cinematic lighting, 8k, minimalistic composition.*
- **Output Asset**: Refined into video backdrop and portal shader aesthetic.

### B. Ancient Egypt Scene Concept
- **Prompt v1**: *Pyramids in Egypt with desert sand.*  
  *Critique*: Flat daylight; lacked atmospheric drama and scale.
- **Prompt v2 (Final)**: *Aerial cinematic shot of the Great Pyramid of Giza and Sphinx during golden hour sunset, warm amber lighting, rising sand dust, high detail, photorealistic.*

### C. Medieval Europe Fortress
- **Prompt v1**: *Medieval castle on a hill.*  
  *Critique*: Clichéd fantasy castle without realistic stone textures or defensive architecture.
- **Prompt v2 (Final)**: *Gothic stone fortress with round defensive towers, drawbridge over moat, misty atmospheric morning, moody desaturated palette with warm torch fire.*

### D. Industrial Revolution Locomotive & Factories
- **Prompt**: *1840s steam locomotive chugging past towering brick brick mill chimneys, dense black smoke plumes, warm molten iron furnace glow, dramatic industrial atmosphere.*

### E. Neo-City 2200
- **Prompt**: *Cybernetic futuristic metropolis at dusk, vertical sky-gardens, magnetic levitation transit ribbons, sleek carbon towers with teal neon accents, solarpunk architecture.*

## 2. Iteration Log Table
| Era / Asset | Model | Seed / Params | Status | Notes |
|---|---|---|---|---|
| Portal Ring | DALL-E 3 | Style: Vivid, Aspect: 16:9 | Kept | Selected as base composition for video generation |
| Pyramid | Midjourney v6 | `--ar 16:9 --stylize 250` | Kept | Used for sand palette & camera angle |
| Castle Keep | DALL-E 3 | Style: Natural | Revised | Adjusted lighting to be moodier for 3D shaders |
| Steam Engine | Midjourney v6 | `--v 6.0 --q 2` | Kept | Reference for Meshy 3D mesh reconstruction |
| Skycar 2200 | Midjourney v6 | `--ar 16:9` | Kept | Aerodynamic curvature ported into GLB generator |
