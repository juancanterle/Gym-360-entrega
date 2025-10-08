import mysql from "mysql2/promise"

// Configuración de la base de datos
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}

// Pool de conexiones para mejor rendimiento
const pool = mysql.createPool(dbConfig)

// Función para ejecutar consultas
async function executeQuery(queryString, params = []) {
  try {
    const [results] = await pool.execute(queryString, params)
    return results
  } catch (error) {
    console.error("Error ejecutando consulta:", error)
    throw error
  }
}

// Función para obtener una conexión del pool
async function getConnection() {
  try {
    return await pool.getConnection()
  } catch (error) {
    console.error("Error obteniendo conexión:", error)
    throw error
  }
}

export { pool, executeQuery }
export const query = executeQuery
