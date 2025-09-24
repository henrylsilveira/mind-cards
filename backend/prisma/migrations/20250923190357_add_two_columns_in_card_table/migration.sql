-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_card" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "themesId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "sub_title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "correct_tries" INTEGER NOT NULL DEFAULT 0,
    "wrong_tries" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "card_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "card_themesId_fkey" FOREIGN KEY ("themesId") REFERENCES "theme" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_card" ("created_at", "description", "id", "level", "sub_title", "themesId", "title", "updated_at", "userId") SELECT "created_at", "description", "id", "level", "sub_title", "themesId", "title", "updated_at", "userId" FROM "card";
DROP TABLE "card";
ALTER TABLE "new_card" RENAME TO "card";
CREATE UNIQUE INDEX "card_id_key" ON "card"("id");
CREATE INDEX "card_userId_idx" ON "card"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
