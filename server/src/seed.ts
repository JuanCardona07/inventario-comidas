import dotenv from "dotenv";
import mongoose from "mongoose";
import Ingrediente from "./models/Ingrediente";
import Orden from "./models/Orden";
import Receta from "./models/Receta";
dotenv.config();

const ingredientesIniciales = JSON.parse(`[
  { "id": "1", "nombre": "Pan de hamburguesa", "cantidad": 50, "unidad": "unidades", "minimo": 10, "categoria": "panes" },
  { "id": "2", "nombre": "Carne de res", "cantidad": 30, "unidad": "unidades", "minimo": 5, "categoria": "carnes" },
  { "id": "3", "nombre": "Tomate", "cantidad": 40, "unidad": "unidades", "minimo": 10, "categoria": "verduras" },
  { "id": "4", "nombre": "Lechuga", "cantidad": 35, "unidad": "unidades", "minimo": 8, "categoria": "verduras" },
  { "id": "5", "nombre": "Queso", "cantidad": 45, "unidad": "unidades", "minimo": 10, "categoria": "lácteos" },
  { "id": "6", "nombre": "Papas", "cantidad": 100, "unidad": "unidades", "minimo": 20, "categoria": "verduras" },
  { "id": "7", "nombre": "Salsa especial", "cantidad": 2000, "unidad": "ml", "minimo": 500, "categoria": "salsas" },
  { "id": "8", "nombre": "Salchicha", "cantidad": 25, "unidad": "unidades", "minimo": 5, "categoria": "carnes" },
  { "id": "9", "nombre": "Pan para perro", "cantidad": 30, "unidad": "unidades", "minimo": 10, "categoria": "panes" },
  { "id": "10", "nombre": "Cebolla", "cantidad": 20, "unidad": "unidades", "minimo": 5, "categoria": "verduras" },
  { "id": "11", "nombre": "Tocino", "cantidad": 15, "unidad": "unidades", "minimo": 5, "categoria": "carnes" }
]`);

const recetasIniciales = [
  {
    id: "r1",
    nombre: "Hamburguesa Clásica",
    categoria: "Hamburguesas",
    precio: 8.5,
    ingredientes: [
      { ingredienteId: "1", cantidad: 2 },
      { ingredienteId: "2", cantidad: 1 },
      { ingredienteId: "3", cantidad: 1 },
      { ingredienteId: "4", cantidad: 1 },
      { ingredienteId: "7", cantidad: 30 },
    ],
  },
  {
    id: "r2",
    nombre: "Hamburguesa con Queso",
    categoria: "Hamburguesas",
    precio: 10.0,
    ingredientes: [
      { ingredienteId: "1", cantidad: 2 },
      { ingredienteId: "2", cantidad: 1 },
      { ingredienteId: "3", cantidad: 1 },
      { ingredienteId: "4", cantidad: 1 },
      { ingredienteId: "5", cantidad: 2 },
      { ingredienteId: "7", cantidad: 30 },
    ],
  },
  {
    id: "r3",
    nombre: "Hamburguesa con Tocino",
    categoria: "Hamburguesas",
    precio: 12.0,
    ingredientes: [
      { ingredienteId: "1", cantidad: 2 },
      { ingredienteId: "2", cantidad: 1 },
      { ingredienteId: "3", cantidad: 1 },
      { ingredienteId: "4", cantidad: 1 },
      { ingredienteId: "5", cantidad: 2 },
      { ingredienteId: "11", cantidad: 2 },
      { ingredienteId: "7", cantidad: 30 },
    ],
  },
  {
    id: "r4",
    nombre: "Perro Caliente Simple",
    categoria: "Perros",
    precio: 6.0,
    ingredientes: [
      { ingredienteId: "9", cantidad: 1 },
      { ingredienteId: "8", cantidad: 1 },
      { ingredienteId: "7", cantidad: 20 },
    ],
  },
  {
    id: "r5",
    nombre: "Perro Caliente Especial",
    categoria: "Perros",
    precio: 8.0,
    ingredientes: [
      { ingredienteId: "9", cantidad: 1 },
      { ingredienteId: "8", cantidad: 1 },
      { ingredienteId: "5", cantidad: 1 },
      { ingredienteId: "10", cantidad: 1 },
      { ingredienteId: "7", cantidad: 30 },
    ],
  },
  {
    id: "r6",
    nombre: "Papas Fritas",
    categoria: "Acompañamientos",
    precio: 3.5,
    ingredientes: [{ ingredienteId: "6", cantidad: 5 }],
  },
];

async function seed() {
  try {
    const MONGODB_URI =
      process.env.MONGODB_URI || "mongodb://localhost:27017/inventario_comidas";

    console.log("🌱 INICIANDO SEED DE BASE DE DATOS");
    console.log("");
    console.log("📍 Conectando a:", MONGODB_URI);

    await mongoose.connect(MONGODB_URI);
    console.log("✅ Conectado a MongoDB");
    console.log("");

    console.log("🗑️  Limpiando colecciones existentes...");
    await Ingrediente.deleteMany({});
    await Receta.deleteMany({});
    await Orden.deleteMany({});
    console.log("");

    console.log("📦 Insertando ingredientes...");
    await Ingrediente.insertMany(ingredientesIniciales);
    console.log(`✅ ${ingredientesIniciales.length} ingredientes insertados`);
    console.log("");

    console.log("📋 Insertando recetas...");
    await Receta.insertMany(recetasIniciales);
    console.log(`✅ ${recetasIniciales.length} recetas insertadas`);
    console.log("");

    console.log("📊 RESUMEN:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`  Ingredientes: ${ingredientesIniciales.length}`);
    console.log(`  Recetas: ${recetasIniciales.length}`);
    console.log("  Órdenes: 0 (historial limpio)");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("");
    console.log("✅ Seed completado exitosamente!");
    console.log("");

    await mongoose.connection.close();
    console.log("👋 Conexión cerrada");
    process.exit(0);
  } catch (error) {
    console.error("");
    console.error("❌ ERROR EN EL SEED:");
    console.error(error);
    console.error("");
    process.exit(1);
  }
}

seed();
