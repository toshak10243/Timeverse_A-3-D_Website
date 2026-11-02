// ─────────────────────────────────────────────────────────────
// TIMEVERSE — all era content lives here.
// Edit text, facts, camera angles and model paths without
// touching any 3D code.
// ─────────────────────────────────────────────────────────────

export type EraId = 'egypt' | 'medieval' | 'industrial' | 'future';
export type Vec3 = [number, number, number];

export interface EraObject {
  id: string;
  name: string;
  short: string;
  description: string;
  facts: string[];
  /** height above the object's base the camera looks at */
  focusY: number;
  /** camera offset from the focus point when this object is selected */
  offset: Vec3;
  /**
   * Optional AI-generated model (Meshy → Blender → GLB).
   * Put the file in /public/models and set e.g. '/models/pyramid.glb'.
   * If the file is missing or fails, the built-in procedural model is shown.
   */
  modelUrl?: string;
  /** largest dimension (scene units) the GLB is scaled to */
  modelFit?: number;
}

export interface Era {
  id: EraId;
  index: number;
  name: string;
  year: string;
  tagline: string;
  narration: string;
  accent: string;
  gradient: string;
  highlights: string[];
  camera: { intro: Vec3; position: Vec3; target: Vec3; maxDistance: number };
  timeline: { year: string; event: string }[];
  learnMore: { label: string; url: string }[];
  objects: EraObject[];
  note?: string;
}

export const ERAS: Era[] = [
  {
    id: 'egypt',
    index: 0,
    name: 'Ancient Egypt',
    year: '2500 BCE',
    tagline: 'Where stone was shaped into eternity.',
    narration:
      'Welcome, traveler. You stand on the Giza plateau, four and a half thousand years before your time. The pyramids here are already a wonder.',
    accent: '#f2b45a',
    gradient: 'linear-gradient(160deg,#3a2410 0%,#a8692b 45%,#f2c27b 100%)',
    highlights: ['Pyramids of Giza', 'The Great Sphinx', 'Obelisks & hieroglyphs'],
    camera: { intro: [70, 40, 90], position: [32, 14, 42], target: [0, 4, 0], maxDistance: 90 },
    timeline: [
      { year: 'c. 3100 BCE', event: 'Upper and Lower Egypt are unified under the first pharaohs.' },
      { year: 'c. 2670 BCE', event: 'The Step Pyramid of Djoser is built at Saqqara, designed by Imhotep.' },
      { year: 'c. 2560 BCE', event: 'The Great Pyramid of Khufu is completed at Giza.' },
      { year: 'c. 2500 BCE', event: 'The Great Sphinx is carved, most likely for the pharaoh Khafre.' },
      { year: 'c. 1330 BCE', event: 'Tutankhamun reigns during the New Kingdom.' },
    ],
    learnMore: [
      { label: 'Great Pyramid of Giza — Wikipedia', url: 'https://en.wikipedia.org/wiki/Great_Pyramid_of_Giza' },
      { label: 'Great Sphinx of Giza — Wikipedia', url: 'https://en.wikipedia.org/wiki/Great_Sphinx_of_Giza' },
      { label: 'Ancient Egypt — Britannica', url: 'https://www.britannica.com/place/ancient-Egypt' },
    ],
    objects: [
      {
        id: 'pyramid',
        name: 'The Great Pyramid',
        short: 'Tomb of the pharaoh Khufu',
        description:
          'Built for the pharaoh Khufu around 2560 BCE, the Great Pyramid is the oldest of the Seven Wonders of the Ancient World and the only one still standing.',
        facts: [
          'Originally about 146 m tall, it was the tallest human-made structure on Earth for roughly 3,800 years.',
          'It is made of an estimated 2.3 million stone blocks.',
          'It was once covered in polished white Tura limestone casing stones that reflected the sun.',
        ],
        focusY: 5,
        offset: [18, 8, 22],
        // modelUrl: '/models/pyramid.glb',
        modelFit: 20,
      },
      {
        id: 'sphinx',
        name: 'The Great Sphinx',
        short: 'A lion with a human head',
        description:
          'Carved directly from the limestone bedrock of the Giza plateau, the Sphinx guards the pyramids. Most Egyptologists believe its face represents the pharaoh Khafre.',
        facts: [
          'It is about 73 m long and 20 m high — one of the largest monolithic statues in the world.',
          'For long periods it was buried up to its shoulders in desert sand.',
          'A granite stela between its paws, the "Dream Stela", was placed there by Thutmose IV around 1400 BCE.',
        ],
        focusY: 2.5,
        offset: [9, 4, 9],
        // modelUrl: '/models/sphinx.glb',
        modelFit: 9,
      },
      {
        id: 'obelisk',
        name: 'Obelisk',
        short: 'A needle of stone for the sun god',
        description:
          'Obelisks were tall, four-sided monuments carved from a single piece of stone, usually granite, and topped with a small pyramid called a pyramidion.',
        facts: [
          'They were linked to the sun god Ra and often placed in pairs at temple entrances.',
          'The pyramidion at the top was sometimes covered in gold or electrum to catch the sunlight.',
          'The "Unfinished Obelisk" at Aswan would have been about 42 m tall had it not cracked.',
        ],
        focusY: 5,
        offset: [6, 2, 9],
        // modelUrl: '/models/obelisk.glb',
        modelFit: 10,
      },
    ],
  },
  {
    id: 'medieval',
    index: 1,
    name: 'Medieval World',
    year: '1200 CE',
    tagline: 'Stone walls, iron mail and the age of castles.',
    narration:
      'The portal has carried you to Europe in the year 1200. Castles rise above the river, and every village lives in the shadow of its lord.',
    accent: '#d9a441',
    gradient: 'linear-gradient(160deg,#141a12 0%,#3d4a2a 45%,#c48a3a 100%)',
    highlights: ['Stone castle & keep', 'Knights in chain mail', 'Village life'],
    camera: { intro: [-70, 40, 80], position: [-26, 14, 40], target: [0, 5, 0], maxDistance: 95 },
    timeline: [
      { year: '1066', event: 'The Norman conquest of England begins a great wave of castle building.' },
      { year: '1163', event: 'Construction of Notre-Dame de Paris begins.' },
      { year: '1200', event: 'Stone castles with tall keeps and curtain walls are common across Europe.' },
      { year: '1215', event: 'King John of England agrees to Magna Carta.' },
      { year: '1347', event: 'The Black Death reaches Europe.' },
    ],
    learnMore: [
      { label: 'Castle — Wikipedia', url: 'https://en.wikipedia.org/wiki/Castle' },
      { label: 'Knight — Wikipedia', url: 'https://en.wikipedia.org/wiki/Knight' },
      { label: 'Middle Ages — Britannica', url: 'https://www.britannica.com/event/Middle-Ages' },
    ],
    objects: [
      {
        id: 'castle',
        name: 'Stone Castle',
        short: 'A fortress and a home',
        description:
          'A castle was both a military fortress and the home of a lord. Thick curtain walls, corner towers and a central keep made it hard to attack.',
        facts: [
          'The keep was the strongest building — the last place of refuge if the walls fell.',
          'The gaps in the battlements are called crenels; the raised parts are merlons.',
          'Many castles were surrounded by a moat and entered over a drawbridge.',
        ],
        focusY: 6,
        offset: [-20, 10, 26],
        // modelUrl: '/models/castle.glb',
        modelFit: 26,
      },
      {
        id: 'knight',
        name: 'Knight',
        short: 'A mounted warrior bound by an oath',
        description:
          'Around 1200, a knight wore a long coat of chain mail (a hauberk) under a cloth surcoat, carried a shield and sword, and often wore a flat-topped great helm.',
        facts: [
          'Chain mail was made of thousands of small iron rings linked together by hand.',
          'Full plate armour only became common later, in the 14th–15th centuries.',
          'Coats of arms on shields helped identify knights whose faces were hidden by helmets.',
        ],
        focusY: 1.6,
        offset: [3.5, 1.2, 5],
        // modelUrl: '/models/knight.glb',
        modelFit: 2.4,
      },
      {
        id: 'cart',
        name: 'Medieval Cart',
        short: 'The workhorse of village trade',
        description:
          'Wooden carts pulled by horses or oxen carried grain, wool, timber and goods between farms, villages and markets.',
        facts: [
          'Wheels were made by a craftsman called a wheelwright.',
          'Weekly markets and annual fairs were the centre of trade for most villages.',
          'The padded horse collar, widespread by this time, let horses pull much heavier loads.',
        ],
        focusY: 1,
        offset: [-4, 2.5, 5],
        // modelUrl: '/models/cart.glb',
        modelFit: 4,
      },
    ],
  },
  {
    id: 'industrial',
    index: 2,
    name: 'Industrial Revolution',
    year: '1800s',
    tagline: 'Steam, iron and the machines that changed the world.',
    narration:
      'Listen — the hiss of steam, the clatter of iron. This is the nineteenth century, when machines began to do the work of thousands of hands.',
    accent: '#e0793a',
    gradient: 'linear-gradient(160deg,#121010 0%,#3b2a22 45%,#c0602e 100%)',
    highlights: ['Steam locomotive', 'Textile factory', 'Beam steam engine'],
    camera: { intro: [60, 35, -70], position: [30, 13, 34], target: [0, 3, 0], maxDistance: 80 },
    timeline: [
      { year: '1769', event: 'James Watt patents his separate condenser, making steam engines far more efficient.' },
      { year: '1771', event: "Richard Arkwright opens Cromford Mill, one of the first factories." },
      { year: '1804', event: "Richard Trevithick's locomotive runs on rails in Wales." },
      { year: '1829', event: "Stephenson's Rocket wins the Rainhill Trials." },
      { year: '1830', event: 'The Liverpool and Manchester Railway opens — the first inter-city passenger railway.' },
    ],
    learnMore: [
      { label: 'Industrial Revolution — Wikipedia', url: 'https://en.wikipedia.org/wiki/Industrial_Revolution' },
      { label: "Stephenson's Rocket — Wikipedia", url: 'https://en.wikipedia.org/wiki/Stephenson%27s_Rocket' },
      { label: 'Watt steam engine — Wikipedia', url: 'https://en.wikipedia.org/wiki/Watt_steam_engine' },
    ],
    objects: [
      {
        id: 'locomotive',
        name: 'Steam Locomotive',
        short: 'Fire, water and iron in motion',
        description:
          'A steam locomotive burns coal to boil water. The steam pushes pistons, which turn the wheels through connecting rods.',
        facts: [
          "Stephenson's Rocket reached about 30 mph (48 km/h) at the 1829 Rainhill Trials.",
          'The tender behind the engine carried its coal and water.',
          'Railways made journeys that once took days possible in hours.',
        ],
        focusY: 2,
        offset: [6, 4, 8],
        // modelUrl: '/models/locomotive.glb',
        modelFit: 7,
      },
      {
        id: 'factory',
        name: 'Textile Mill',
        short: 'Where the factory system began',
        description:
          'Mills brought workers and machines together under one roof, powered first by water wheels and later by steam engines.',
        facts: [
          'Cotton spinning was one of the first industries to be mechanised.',
          'Workers, including children, often worked 12–14 hour days.',
          'Saw-tooth roofs let in daylight for the workers below.',
        ],
        focusY: 4,
        offset: [-14, 8, 20],
        // modelUrl: '/models/factory.glb',
        modelFit: 18,
      },
      {
        id: 'engine',
        name: 'Beam Steam Engine',
        short: 'The heart of the factory',
        description:
          'A rocking iron beam transferred the push of the steam piston to a huge flywheel, whose spinning drove the machines through shafts and belts.',
        facts: [
          "James Watt's separate condenser (1769) made steam engines far more efficient.",
          "The unit of power, the watt, is named after him.",
          'The heavy flywheel smoothed out the jerky motion of the piston.',
        ],
        focusY: 2.5,
        offset: [-7, 3, 7],
        // modelUrl: '/models/engine.glb',
        modelFit: 6,
      },
    ],
  },
  {
    id: 'future',
    index: 3,
    name: 'Future Civilization',
    year: '2200 CE',
    tagline: 'An imagined tomorrow of light, machines and sky-cities.',
    narration:
      'This is not history — it is a possibility. The year 2200, imagined. Cities climb into the sky, and machines think alongside us.',
    accent: '#5ee7ff',
    gradient: 'linear-gradient(160deg,#05060f 0%,#1a1446 45%,#2bc4e8 100%)',
    highlights: ['Aether Tower', 'Flying vehicles', 'AI companions'],
    camera: { intro: [0, 60, 100], position: [26, 12, 38], target: [0, 8, 0], maxDistance: 100 },
    note: 'The year 2200 is an imagined future for this creative experience, not a prediction.',
    timeline: [
      { year: '1969', event: 'Humans first walk on the Moon.' },
      { year: '2007', event: 'Smartphones bring the internet into people’s pockets.' },
      { year: '2020s', event: 'Generative AI tools become widely available.' },
      { year: '2100 (imagined)', event: 'Vertical cities and clean energy reshape skylines.' },
      { year: '2200 (imagined)', event: 'Humans and AI share the work of running cities.' },
    ],
    learnMore: [
      { label: 'Futures studies — Wikipedia', url: 'https://en.wikipedia.org/wiki/Futures_studies' },
      { label: 'Arcology — Wikipedia', url: 'https://en.wikipedia.org/wiki/Arcology' },
      { label: 'Robotics — Britannica', url: 'https://www.britannica.com/technology/robotics' },
    ],
    objects: [
      {
        id: 'tower',
        name: 'Aether Tower',
        short: 'A city in a single building',
        description:
          'An imagined vertical city with homes, farms and parks stacked kilometres into the sky — inspired by the real architectural idea of the "arcology".',
        facts: [
          'The term arcology (architecture + ecology) was coined by architect Paolo Soleri.',
          'Vertical farms already exist today, growing crops in stacked indoor layers.',
          'In this vision, the glowing rings collect solar energy.',
        ],
        focusY: 14,
        offset: [18, 2, 26],
        // modelUrl: '/models/tower.glb',
        modelFit: 34,
      },
      {
        id: 'skycar',
        name: 'Sky Car',
        short: 'Traffic in three dimensions',
        description:
          'An imagined electric flying vehicle. Today’s eVTOL (electric vertical take-off and landing) aircraft are an early step in this direction.',
        facts: [
          'eVTOL prototypes are being tested by several companies today.',
          'In this future, traffic moves in invisible air lanes at different heights.',
          'The glowing rings represent quiet electric propulsion.',
        ],
        focusY: 0.5,
        offset: [7, 3, 9],
        // modelUrl: '/models/skycar.glb',
        modelFit: 4,
      },
      {
        id: 'robot',
        name: 'AI Companion',
        short: 'A helper, not a ruler',
        description:
          'An imagined robot assistant that helps people in daily life. It represents a future where AI and humans work together.',
        facts: [
          'The word "robot" comes from Karel Čapek’s 1920 play R.U.R.',
          'Today’s robots already build cars, explore Mars and assist in surgery.',
          'How AI should be used responsibly is one of the big questions of our time.',
        ],
        focusY: 2,
        offset: [4, 1, 5],
        // modelUrl: '/models/robot.glb',
        modelFit: 3.2,
      },
    ],
  },
];

export const getEra = (id: string) => ERAS.find((e) => e.id === id);
