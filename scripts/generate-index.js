import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_DIR = path.resolve('public/content');
const OUTPUT_FILE = path.resolve('src/data/posts.json');

function generateIndex() {
  const posts = [];
  
  if (!fs.existsSync(CONTENT_DIR)) {
    console.log(`Content directory not found at ${CONTENT_DIR}. Creating it...`);
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
    // Create categories
    ['escursioni', 'mtb', 'arrampicata', 'scialpinismo'].forEach(cat => {
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
          // Resolve relative path to the public/content/category/ directory
          gpxPath = `/content/${category}/${gpxPath.replace(/^\.\//, '')}`;
        }
        
        posts.push({
          id: `${category}-${file.replace('.md', '')}`,
          slug: file.replace('.md', ''),
          category,
          title: data.title || file.replace('.md', ''),
          date: data.date || '',
          excerpt: data.excerpt || '',
          gpx: gpxPath,
          photos: data.photos || [],
          path: `/content/${category}/${file}`
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
