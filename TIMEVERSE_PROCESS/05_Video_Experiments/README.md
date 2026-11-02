# 05 · Video Generation Experiments

## 1. Video Pipeline: Kling AI & Runway Gen-2
To give each era cinematic visual depth, AI video generators were utilized to create looped environmental footage for the landing backdrop and era video modals.

### Video Asset Inventory
1. `public/videos/portal.mp4` (5.3 MB):
   - **Tool**: Kling AI (Text-to-Video)
   - **Prompt**: *Hypnotic spinning temporal wormhole, blue and cyan energy pulses, volumetric space nebula, high fps, cinematic loop.*
   - **Usage**: Background for Landing Screen at 35% opacity beneath the Three.js particle canvas.

2. `public/videos/egypt.mp4` (2.7 MB):
   - **Tool**: Kling AI (Image-to-Video from Midjourney base)
   - **Prompt**: *Slow drone orbit around the Great Pyramid of Giza, drifting desert sand, golden hour sunlight flare.*

3. `public/videos/medieval.mp4` (3.5 MB):
   - **Tool**: Kling AI
   - **Prompt**: *Cinematic sweep over a fortified stone castle at dawn, watchtower flags waving in the wind, mist rolling over forest hills.*

4. `public/videos/industrial.mp4` (3.9 MB):
   - **Tool**: Kling AI
   - **Prompt**: *Steam engine train moving through Victorian industrial factory district, billowing black coal smoke and fiery sparks, dark moody cinematic lighting.*

5. `public/videos/future.mp4` (5.7 MB):
   - **Tool**: Kling AI
   - **Prompt**: *Futuristic flying vehicles traversing elevated aerial highways between towering holographic skyscrapers in a cyberpunk metropolis.*

## 2. Technical Considerations & Optimization
- **Web Compression**: Encoded with H.264 / AAC at 1080p, optimized for instant browser streaming with `playsInline`, `muted`, and `loop`.
- **Graceful Error Handling**: Implemented video error state detection (`onError={() => setVideo(false)}`) to smoothly fall back to gradient backdrops on low-bandwidth devices.
