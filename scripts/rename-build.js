import fs from "fs";
import path from "path";

// Ambil data app dari app.json
const pkg = JSON.parse(fs.readFileSync("app.json", "utf-8")).expo;

const appName = pkg.name.replace(/\s+/g, ""); // hilangkan spasi
const version = pkg.version;
const date = new Date().toISOString().slice(0, 10);
const outputDir = "dist";
const buildDir = "build";

// Pastikan folder dist ada
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Cek folder build (tempat hasil EAS lokal)
if (fs.existsSync(buildDir)) {
  const files = fs.readdirSync(buildDir);

  // Ambil semua file .apk atau .aab
  const buildFiles = files.filter(f => f.endsWith(".apk") || f.endsWith(".aab"));

  if (buildFiles.length > 0) {
    buildFiles.forEach(file => {
      const ext = path.extname(file);
      const newName = `${appName}-v${version}-${date}${ext}`;
      const oldPath = path.join(buildDir, file);
      const newPath = path.join(outputDir, newName);
      fs.renameSync(oldPath, newPath);
      console.log(`✅ File renamed: ${newName}`);
    });
  } else {
    console.log("⚠️ Tidak ditemukan file .apk atau .aab di folder build/");
  }
} else {
  console.log("⚠️ Folder build/ tidak ditemukan");
}
