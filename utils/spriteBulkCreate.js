import { Sprite } from "../models/sprites.js";
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const sprites = [
  { name: "Arbusto con flores rojas", rarity: "common" },
  { name: "Arbusto con rosas", rarity: "common" },
  { name: "Arbusto invernal", rarity: "common" },
  { name: "Arbusto raro", rarity: "rare" },
  { name: "Arbusto único", rarity: "legendary" },
  { name: "Flor rosa", rarity: "common" },
  { name: "Flores amarillas", rarity: "common" },
  { name: "Flores chicas azules", rarity: "common" },
  { name: "Flores moradas", rarity: "common" },
  { name: "Flores chicas moradas", rarity: "common" },
  { name: "Flores tricolor", rarity: "rare" },
  { name: "Flores variadas", rarity: "common" },
  { name: "Girasol azul", rarity: "rare" },
  { name: "Girasol rosa", rarity: "rare" },
  { name: "Margaritas", rarity: "common" },
  { name: "Margaritas rosas", rarity: "common" },
  { name: "Rosa Naranja", rarity: "rare" },
  { name: "Rosa roja", rarity: "common" },
  { name: "Tulipanes morados", rarity: "rare" },
  { name: "Tulipanes rosas", rarity: "rare" },
];

function getPriceByRarity(rarity) {
  switch (rarity) {
    case 'common':
      return 300;
    case 'rare':
      return 500;
    case 'legendary':
      return 1000;
    default:
      return 500;
  }
}

function getImageBlob(name) {
  const filePath = path.join(__dirname, "../imgs", `${name}.png`);
  console.log("Attempting to read file from:", filePath);
  try {
    return fs.readFileSync(filePath);
  } catch (err) {
    console.error("Error reading image file:", err);
    return null;
  }
}

async function populateSprites() {
  for (const sprite of sprites) {
    const formattedName = sprite.name;
    try {
      await Sprite.create({
        name: sprite.name,
        price: getPriceByRarity(sprite.rarity),
        sprite_url: `UnlockedItems/${formattedName}`,
        rarity: sprite.rarity,
        sprite_image: getImageBlob(sprite.name),
      });
      console.log(`Inserted ${sprite.name} successfully.`);
    } catch (err) {
      console.error("Error inserting sprite:", err);
    }
  }
}

export { populateSprites };
