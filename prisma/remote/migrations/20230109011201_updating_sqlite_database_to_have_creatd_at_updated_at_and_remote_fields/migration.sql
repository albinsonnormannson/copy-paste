-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ClipboardItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "remote" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_ClipboardItem" ("content", "id", "remote", "visible") SELECT "content", "id", "remote", "visible" FROM "ClipboardItem";
DROP TABLE "ClipboardItem";
ALTER TABLE "new_ClipboardItem" RENAME TO "ClipboardItem";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
