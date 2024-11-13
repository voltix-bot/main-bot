const fs = require('fs');
const path = require('path').join(__dirname, 'users.json');

// Membaca isi dari database JSON
function readDatabase() {
  try {
    const data = fs.readFileSync(path, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Gagal membaca database:", error);
    return {};
  }
}

// Menyimpan perubahan ke dalam database JSON
function saveDatabase(data) {
  try {
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Gagal menyimpan ke database:", error);
  }
}

// Mendapatkan nilai berdasarkan key
function get(key) {
  const db = readDatabase();
  return db[key] || null;
}

// Menambahkan atau memperbarui nilai berdasarkan key
function set(key, value) {
  const db = readDatabase();
  db[key] = value;
  saveDatabase(db);
}

// Menghapus nilai berdasarkan key
function remove(key) {
  const db = readDatabase();
  if (db[key]) {
    delete db[key];
    saveDatabase(db);
  } else {
    console.log(`Key ${key} tidak ditemukan dalam database.`);
  }
}

// Mendapatkan semua data
function getAll() {
  return readDatabase();
}

module.exports = { get, set, remove, getAll };