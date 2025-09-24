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
CREATE TABLE "new_status" (
    "userId" TEXT NOT NULL PRIMARY KEY,
    "total_themes" INTEGER NOT NULL DEFAULT 0,
    "total_games" INTEGER NOT NULL DEFAULT 0,
    "total_corrects" INTEGER NOT NULL DEFAULT 0,
    "total_wrongs" INTEGER NOT NULL DEFAULT 0,
    "best_streak" INTEGER NOT NULL DEFAULT 0,
    "total_score" INTEGER NOT NULL DEFAULT 0,
    "updated_at" DATETIME NOT NULL,
    "total_cards" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "status_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_status" ("best_streak", "total_cards", "total_corrects", "total_games", "total_score", "total_themes", "total_wrongs", "updated_at", "userId") SELECT "best_streak", "total_cards", "total_corrects", "total_games", "total_score", "total_themes", "total_wrongs", "updated_at", "userId" FROM "status";
DROP TABLE "status";
ALTER TABLE "new_status" RENAME TO "status";
CREATE UNIQUE INDEX "status_userId_key" ON "status"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
