import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_DIR = path.resolve('public/content');
const PUBLIC_DIR = path.resolve('public');
const OUTPUT_FILE = path.resolve('src/data/posts.json');

// ---- GPX parsing helpers ----
function toRadians(deg) {
  return (deg * Math.PI) / 180;
}

function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function parseGpxStats(gpxFilePath) {
  if (!fs.existsSync(gpxFilePath)) return null;

  const xml = fs.readFileSync(gpxFilePath, 'utf-8');

  // Extract all trkpt with lat, lon, ele
  const trkptRegex = /<trkpt\s+lat="([^"]+)"\s+lon="([^"]+)"[^>]*>[\s\S]*?<ele>([^<]+)<\/ele>[\s\S]*?<\/trkpt>/g;
  const points = [];
  let match;
  while ((match = trkptRegex.exec(xml)) !== null) {
    points.push({
      lat: parseFloat(match[1]),
      lon: parseFloat(match[2]),
      ele: parseFloat(match[3]),
    });
  }

  if (points.length < 2) return null;

  let totalDistance = 0;
  let elevGain = 0;
  let elevLoss = 0;
  let eleMin = points[0].ele;
  let eleMax = points[0].ele;

  for (let i = 1; i < points.length; i++) {
    totalDistance += haversineDistance(
      points[i - 1].lat,
      points[i - 1].lon,
      points[i].lat,
      points[i].lon
    );
    const dEle = points[i].ele - points[i - 1].ele;
    if (dEle > 0) elevGain += dEle;
    else elevLoss += Math.abs(dEle);
    if (points[i].ele < eleMin) eleMin = points[i].ele;
    if (points[i].ele > eleMax) eleMax = points[i].ele;
  }

  // Build a simplified elevation profile (sample ~200 points max)
  const step = Math.max(1, Math.floor(points.length / 200));
  const elevationProfile = [];
  let cumulDist = 0;
  elevationProfile.push({ dist: 0, ele: Math.round(points[0].ele) });
  for (let i = 1; i < points.length; i++) {
    cumulDist += haversineDistance(
      points[i - 1].lat,
      points[i - 1].lon,
      points[i].lat,
      points[i].lon
    );
    if (i % step === 0 || i === points.length - 1) {
      elevationProfile.push({
        dist: Math.round(cumulDist * 100) / 100,
        ele: Math.round(points[i].ele),
      });
    }
  }

  // Start coordinates for global map marker
  const startLat = points[0].lat;
  const startLon = points[0].lon;

  return {
    distance: Math.round(totalDistance * 100) / 100,
    elevGain: Math.round(elevGain),
    elevLoss: Math.round(elevLoss),
    eleMin: Math.round(eleMin),
    eleMax: Math.round(eleMax),
    startLat,
    startLon,
    elevationProfile,
  };
}

// ---- Main index generator ----
function generateIndex() {
  const posts = [];

  if (!fs.existsSync(CONTENT_DIR)) {
    console.log(`Content directory not found at ${CONTENT_DIR}. Creating it...`);
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
    ['escursioni', 'mtb', 'arrampicata', 'scialpinismo'].forEach((cat) => {
      fs.mkdirSync(path.join(CONTENT_DIR, cat), { recursive: true });
    });
  }

  const categories = fs.readdirSync(CONTENT_DIR);

  for (const category of categories) {
    const categoryPath = path.join(CONTENT_DIR, category);
    if (!fs.statSync(categoryPath).isDirectory()) continue;

    const files = fs.readdirSync(categoryPath);

    for (const file of files) {
      if (file.endsWith('.md')) {
        const filePath = path.join(categoryPath, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data } = matter(fileContent);

        let gpxPath = data.gpx || null;
        if (gpxPath && !gpxPath.startsWith('http') && !gpxPath.startsWith('/')) {
          gpxPath = `/content/${category}/${gpxPath.replace(/^\.\//, '')}`;
        }

        // Resolve the physical GPX file path to parse stats
        let gpxStats = null;
        if (gpxPath) {
          const physicalGpxPath = path.join(PUBLIC_DIR, gpxPath);
          gpxStats = parseGpxStats(physicalGpxPath);
        }

        posts.push({
          id: `${category}-${file.replace('.md', '')}`,
          slug: file.replace('.md', ''),
          category,
          title: data.title || file.replace('.md', ''),
          date: data.date || '',
          excerpt: data.excerpt || '',
          gpx: gpxPath,
          gpxStats,
          photos: data.photos || [],
          path: `/content/${category}/${file}`,
        });
      }
    }
  }

  // Sort posts by date descending
  posts.sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(b.date) - new Date(a.date);
  });

  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(posts, null, 2));
  console.log(`Generated index with ${posts.length} posts.`);
}

generateIndex();
