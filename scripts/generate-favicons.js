const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateFavicons() {
  const svgPath = path.join(__dirname, '../public/langfuse_icon.svg');
  const outputDir = path.join(__dirname, '../public');
  
  // Read the SVG file
  const svgBuffer = fs.readFileSync(svgPath);
  
  console.log('🎨 Generating high-quality favicons from SVG...');
  
  // Generate different sizes
  const sizes = [
    { size: 16, filename: 'favicon-16x16.png' },
    { size: 32, filename: 'favicon-32x32.png' },
    { size: 48, filename: 'favicon-48x48.png' },
    { size: 96, filename: 'favicon-96x96.png' },
    { size: 192, filename: 'android-chrome-192x192.png' },
    { size: 256, filename: 'icon256.png' },
    { size: 512, filename: 'android-chrome-512x512.png' },
    { size: 180, filename: 'apple-touch-icon.png' }
  ];
  
  // Generate PNG files
  for (const { size, filename } of sizes) {
    console.log(`📐 Generating ${filename} (${size}x${size})...`);
    await sharp(svgBuffer)
      .resize(size, size, { 
        fit: 'inside',
        withoutEnlargement: false
      })
      .png({ quality: 100, compressionLevel: 9 })
      .toFile(path.join(outputDir, filename));
  }
  
  // Generate ICO file (multi-resolution)
  console.log('🎯 Generating favicon.ico...');
  
  // Create different size PNGs for ICO
  const icoSizes = [16, 32, 48];
  const icoBuffers = [];
  
  for (const size of icoSizes) {
    const buffer = await sharp(svgBuffer)
      .resize(size, size, { 
        fit: 'inside',
        withoutEnlargement: false
      })
      .png({ quality: 100, compressionLevel: 9 })
      .toBuffer();
    icoBuffers.push(buffer);
  }
  
  // For ICO generation, we'll use the 32x32 as the main favicon.ico
  // Sharp doesn't support ICO generation directly, so we'll use the 32x32 PNG
  await sharp(svgBuffer)
    .resize(32, 32, { 
      fit: 'inside',
      withoutEnlargement: false
    })
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(outputDir, 'favicon-ico-temp.png'));
  
  // Copy the 32x32 version as favicon.ico (browsers will handle it)
  const favicon32Buffer = await sharp(svgBuffer)
    .resize(32, 32, { 
      fit: 'inside',
      withoutEnlargement: false
    })
    .png({ quality: 100, compressionLevel: 9 })
    .toBuffer();
  
  fs.writeFileSync(path.join(outputDir, 'favicon.ico'), favicon32Buffer);
  
  // Clean up temp file
  if (fs.existsSync(path.join(outputDir, 'favicon-ico-temp.png'))) {
    fs.unlinkSync(path.join(outputDir, 'favicon-ico-temp.png'));
  }
  
  console.log('✅ All favicons generated successfully!');
  
  // Generate a manifest.json for web app
  const manifest = {
    name: "Langfuse",
    short_name: "Langfuse",
    description: "Open-source LLM engineering platform",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png"
      }
    ],
    theme_color: "#0A60B5",
    background_color: "#ffffff",
    display: "standalone"
  };
  
  fs.writeFileSync(
    path.join(outputDir, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
  
  console.log('📱 Generated manifest.json');
  
  // Generate browserconfig.xml for Windows tiles
  const browserConfig = `<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
    <msapplication>
        <tile>
            <square150x150logo src="/android-chrome-192x192.png"/>
            <TileColor>#0A60B5</TileColor>
        </tile>
    </msapplication>
</browserconfig>`;
  
  fs.writeFileSync(path.join(outputDir, 'browserconfig.xml'), browserConfig);
  
  console.log('🪟 Generated browserconfig.xml');
  
  console.log('\n🎉 Favicon generation complete!');
  console.log('📊 File sizes:');
  
  // Show file sizes
  for (const { filename } of sizes) {
    const filePath = path.join(outputDir, filename);
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      console.log(`   ${filename}: ${(stats.size / 1024).toFixed(2)}KB`);
    }
  }
  
  const faviconIcoStats = fs.statSync(path.join(outputDir, 'favicon.ico'));
  console.log(`   favicon.ico: ${(faviconIcoStats.size / 1024).toFixed(2)}KB`);
}

// Run the script
generateFavicons().catch(console.error);