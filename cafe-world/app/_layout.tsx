import { Stack } from "expo-router";
import { SQLiteProvider, SQLiteDatabase } from "expo-sqlite";

async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 1;
  let { user_version: currentDbVersion } =
    (await db.getFirstAsync<{ user_version: number }>("PRAGMA user_version")) ?? {
      user_version: 0,
    };

  if (currentDbVersion >= DATABASE_VERSION) return;

  if (currentDbVersion === 0) {
    await db.execAsync(`
      PRAGMA journal_mode = 'wal';
      
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        total DOUBLE,
        created_at TEXT
      );

      CREATE TABLE IF NOT EXISTS order_details (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER,
        name TEXT NOT NULL,
        price REAL,
        imgUrl TEXT,
        quantity INTEGER NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id)
      );
    `);

    currentDbVersion = 1;
  }

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName="drinks_app.db" onInit={migrateDbIfNeeded}>
      <Stack screenOptions={{ headerShown: false }} />
    </SQLiteProvider>
  );
}