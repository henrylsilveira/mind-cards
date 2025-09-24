/*
  Warnings:

  - You are about to alter the column `created_at` on the `card` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.
  - You are about to alter the column `updated_at` on the `card` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.
  - You are about to alter the column `end_time` on the `round` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.
  - You are about to alter the column `start_time` on the `round` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.
  - You are about to alter the column `updated_at` on the `status` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.

*/
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
    "level" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "card_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "card_themesId_fkey" FOREIGN KEY ("themesId") REFERENCES "theme" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_card" ("created_at", "description", "id", "level", "sub_title", "themesId", "title", "updated_at", "userId") SELECT "created_at", "description", "id", "level", "sub_title", "themesId", "title", "updated_at", "userId" FROM "card";
DROP TABLE "card";
ALTER TABLE "new_card" RENAME TO "card";
CREATE UNIQUE INDEX "card_id_key" ON "card"("id");
CREATE TABLE "new_round" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "start_time" DATETIME NOT NULL,
    "end_time" DATETIME NOT NULL,
    "number_cards" INTEGER NOT NULL,
    "temp" INTEGER NOT NULL,
    "correct_answers" INTEGER NOT NULL,
    "wrong_answers" INTEGER NOT NULL,
    CONSTRAINT "round_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_round" ("correct_answers", "end_time", "id", "number_cards", "start_time", "temp", "userId", "wrong_answers") SELECT "correct_answers", "end_time", "id", "number_cards", "start_time", "temp", "userId", "wrong_answers" FROM "round";
DROP TABLE "round";
ALTER TABLE "new_round" RENAME TO "round";
CREATE UNIQUE INDEX "round_id_key" ON "round"("id");
CREATE TABLE "new_status" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "total_games" INTEGER NOT NULL,
    "total_corrects" INTEGER NOT NULL,
    "total_wrongs" INTEGER NOT NULL,
    "best_streak" INTEGER NOT NULL,
    "total_score" INTEGER NOT NULL,
    "updated_at" DATETIME NOT NULL,
    "total_cards" INTEGER NOT NULL,
    CONSTRAINT "status_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_status" ("best_streak", "id", "total_cards", "total_corrects", "total_games", "total_score", "total_wrongs", "updated_at", "userId") SELECT "best_streak", "id", "total_cards", "total_corrects", "total_games", "total_score", "total_wrongs", "updated_at", "userId" FROM "status";
DROP TABLE "status";
ALTER TABLE "new_status" RENAME TO "status";
CREATE UNIQUE INDEX "status_id_key" ON "status"("id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
