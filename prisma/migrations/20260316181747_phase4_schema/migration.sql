-- CreateTable
CREATE TABLE "ReviewVote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reviewId" TEXT NOT NULL,
    "voterId" TEXT NOT NULL,
    "vote" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ReviewVote_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ReviewVote_voterId_fkey" FOREIGN KEY ("voterId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Paper" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "authorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "abstract" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "domain" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "version" INTEGER NOT NULL DEFAULT 1,
    "parentPaperId" TEXT,
    "aiExtractedTitle" TEXT,
    "aiExtractedAbstract" TEXT,
    "aiSuggestedTags" TEXT NOT NULL,
    "estimatedReadTime" INTEGER,
    "preferredReviewers" INTEGER NOT NULL DEFAULT 2,
    "reviewTimeline" TEXT NOT NULL DEFAULT 'standard',
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "isFlagged" BOOLEAN NOT NULL DEFAULT false,
    "flagReason" TEXT,
    "flaggedBy" TEXT,
    "flagResolvedAt" DATETIME,
    "submittedAt" DATETIME,
    "publishedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Paper_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Paper_parentPaperId_fkey" FOREIGN KEY ("parentPaperId") REFERENCES "Paper" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Paper" ("abstract", "aiExtractedAbstract", "aiExtractedTitle", "aiSuggestedTags", "authorId", "createdAt", "domain", "downloadCount", "estimatedReadTime", "fileName", "fileSize", "fileUrl", "id", "isAnonymous", "isFeatured", "isPublic", "parentPaperId", "preferredReviewers", "publishedAt", "reviewTimeline", "status", "submittedAt", "tags", "title", "updatedAt", "version", "viewCount") SELECT "abstract", "aiExtractedAbstract", "aiExtractedTitle", "aiSuggestedTags", "authorId", "createdAt", "domain", "downloadCount", "estimatedReadTime", "fileName", "fileSize", "fileUrl", "id", "isAnonymous", "isFeatured", "isPublic", "parentPaperId", "preferredReviewers", "publishedAt", "reviewTimeline", "status", "submittedAt", "tags", "title", "updatedAt", "version", "viewCount" FROM "Paper";
DROP TABLE "Paper";
ALTER TABLE "new_Paper" RENAME TO "Paper";
CREATE INDEX "Paper_authorId_idx" ON "Paper"("authorId");
CREATE INDEX "Paper_status_idx" ON "Paper"("status");
CREATE INDEX "Paper_domain_idx" ON "Paper"("domain");
CREATE INDEX "Paper_createdAt_idx" ON "Paper"("createdAt");
CREATE TABLE "new_ReviewerProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "degreeDocUrl" TEXT NOT NULL,
    "degreeType" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "domains" TEXT NOT NULL,
    "proficiency" TEXT NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "maxActiveReviews" INTEGER NOT NULL DEFAULT 3,
    "verificationStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "verifiedAt" DATETIME,
    "verifiedBy" TEXT,
    "rejectionNote" TEXT,
    "bio" TEXT,
    "linkedinUrl" TEXT,
    "totalEarnings" INTEGER NOT NULL DEFAULT 0,
    "snoozedPapers" TEXT NOT NULL DEFAULT '[]',
    "passedPapers" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ReviewerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ReviewerProfile" ("bio", "createdAt", "degreeDocUrl", "degreeType", "domains", "id", "institution", "isAvailable", "linkedinUrl", "maxActiveReviews", "position", "proficiency", "rejectionNote", "totalEarnings", "updatedAt", "userId", "verificationStatus", "verifiedAt", "verifiedBy") SELECT "bio", "createdAt", "degreeDocUrl", "degreeType", "domains", "id", "institution", "isAvailable", "linkedinUrl", "maxActiveReviews", "position", "proficiency", "rejectionNote", "totalEarnings", "updatedAt", "userId", "verificationStatus", "verifiedAt", "verifiedBy" FROM "ReviewerProfile";
DROP TABLE "ReviewerProfile";
ALTER TABLE "new_ReviewerProfile" RENAME TO "ReviewerProfile";
CREATE UNIQUE INDEX "ReviewerProfile_userId_key" ON "ReviewerProfile"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "ReviewVote_voterId_idx" ON "ReviewVote"("voterId");

-- CreateIndex
CREATE UNIQUE INDEX "ReviewVote_reviewId_voterId_key" ON "ReviewVote"("reviewId", "voterId");
