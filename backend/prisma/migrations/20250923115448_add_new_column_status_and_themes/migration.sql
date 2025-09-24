-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_status" (
    "userId" TEXT NOT NULL PRIMARY KEY,
    "total_themes" INTEGER NOT NULL DEFAULT 0,
    "total_games" INTEGER NOT NULL DEFAULT 0,
    "total_corrects" INTEGER NOT NULL DEFAULT 0,
    "total_wrongs" INTEGER NOT NULL DEFAULT 0,
    "best_streak" INTEGER NOT NULL DEFAULT 0,
    "total_score" INTEGER NOT NULL DEFAULT 0,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total_cards" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "status_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_status" ("best_streak", "total_cards", "total_corrects", "total_games", "total_score", "total_wrongs", "updated_at", "userId") SELECT "best_streak", "total_cards", "total_corrects", "total_games", "total_score", "total_wrongs", "updated_at", "userId" FROM "status";
DROP TABLE "status";
ALTER TABLE "new_status" RENAME TO "status";
CREATE UNIQUE INDEX "status_userId_key" ON "status"("userId");
CREATE TABLE "new_theme" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "theme_name" TEXT NOT NULL,
    "card_quantity" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "theme_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_theme" ("id", "theme_name", "userId") SELECT "id", "theme_name", "userId" FROM "theme";
DROP TABLE "theme";
ALTER TABLE "new_theme" RENAME TO "theme";
CREATE UNIQUE INDEX "theme_id_key" ON "theme"("id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
