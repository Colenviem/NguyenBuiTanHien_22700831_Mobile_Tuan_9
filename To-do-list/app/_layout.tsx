import React from "react";
import { SQLiteProvider, SQLiteDatabase } from "expo-sqlite";
import { Stack } from "expo-router";

async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 1;
  let { user_version: currentDbVersion } =
    (await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version')) ?? { user_version: 0 };

  if (currentDbVersion >= DATABASE_VERSION) return;

  if (currentDbVersion === 0) {
    await db.execAsync(`
      PRAGMA journal_mode = 'wal';
      CREATE TABLE todos (
        id INTEGER PRIMARY KEY NOT NULL,
        content TEXT NOT NULL,
        status INTEGER NOT NULL DEFAULT 0
      );
    `);
    await db.runAsync('INSERT INTO todos (id, content, status) VALUES (?, ?, ?)', 1, 'hello', 1);
    await db.runAsync('INSERT INTO todos (id, content, status) VALUES (?, ?, ?)', 2, 'world', 0);
    currentDbVersion = 1;
  }
  
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName="ToDoList.db" onInit={migrateDbIfNeeded}>
      <Stack screenOptions={{ headerShown: false }} />
    </SQLiteProvider>
  );
}