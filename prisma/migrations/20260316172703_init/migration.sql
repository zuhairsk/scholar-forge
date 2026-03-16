-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "emailVerified" DATETIME,
    "name" TEXT NOT NULL,
    "password" TEXT,
    "avatarUrl" TEXT,
    "bio" TEXT,
    "institution" TEXT,
    "orcid" TEXT,
    "website" TEXT,
    "role" TEXT NOT NULL DEFAULT 'AUTHOR',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isSuspended" BOOLEAN NOT NULL DEFAULT false,
    "suspendReason" TEXT,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 1,
    "streakDays" INTEGER NOT NULL DEFAULT 0,
    "lastReviewDate" DATETIME,
    "totalReviews" INTEGER NOT NULL DEFAULT 0,
    "helpfulVotesTotal" INTEGER NOT NULL DEFAULT 0,
    "stripeAccountId" TEXT,
    "stripeCustomerId" TEXT,
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "twoFactorSecret" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ReviewerProfile" (
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ReviewerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Paper" (
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
    "submittedAt" DATETIME,
    "publishedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Paper_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Paper_parentPaperId_fkey" FOREIGN KEY ("parentPaperId") REFERENCES "Paper" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CoAuthor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "paperId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "userId" TEXT,
    "claimed" BOOLEAN NOT NULL DEFAULT false,
    "claimedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CoAuthor_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "Paper" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CoAuthor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "paperId" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "strengths" TEXT NOT NULL,
    "weaknesses" TEXT NOT NULL,
    "privateNote" TEXT,
    "publicComment" TEXT,
    "clarityScore" INTEGER NOT NULL,
    "methodologyScore" INTEGER NOT NULL,
    "noveltyScore" INTEGER NOT NULL,
    "reproducibilityScore" INTEGER NOT NULL,
    "impactScore" INTEGER NOT NULL,
    "overallScore" REAL NOT NULL,
    "recommendation" TEXT NOT NULL,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "isFlagged" BOOLEAN NOT NULL DEFAULT false,
    "flagReason" TEXT,
    "flaggedBy" TEXT,
    "flagResolvedAt" DATETIME,
    "helpfulVotes" INTEGER NOT NULL DEFAULT 0,
    "unhelpfulVotes" INTEGER NOT NULL DEFAULT 0,
    "xpAwarded" INTEGER NOT NULL DEFAULT 0,
    "isTopReview" BOOLEAN NOT NULL DEFAULT false,
    "draftData" TEXT,
    "claimedAt" DATETIME,
    "deadlineAt" DATETIME,
    "submittedAt" DATETIME,
    "reviewDurationMinutes" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Review_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "Paper" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Review_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Highlight" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "paperId" TEXT NOT NULL,
    "reviewId" TEXT,
    "userId" TEXT NOT NULL,
    "pageNum" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "note" TEXT,
    "color" TEXT NOT NULL DEFAULT 'gold',
    "position" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Highlight_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "Paper" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Highlight_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Highlight_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Badge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "iconEmoji" TEXT NOT NULL,
    "lottieUrl" TEXT,
    "category" TEXT NOT NULL,
    "rarity" TEXT NOT NULL,
    "xpReward" INTEGER NOT NULL DEFAULT 0,
    "condition" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "UserBadge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,
    "awardedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "awardNote" TEXT,
    CONSTRAINT "UserBadge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserBadge_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "Badge" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "XPLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "metadata" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "XPLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "link" TEXT,
    "metadata" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Tip" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "paperId" TEXT,
    "reviewId" TEXT,
    "amountCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'usd',
    "stripePaymentId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "message" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Tip_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Tip_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Tip_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "Paper" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Tip_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SystemSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'singleton',
    "reviewSLAHours" INTEGER NOT NULL DEFAULT 72,
    "expressReviewSLAHours" INTEGER NOT NULL DEFAULT 24,
    "defaultXPPerReview" INTEGER NOT NULL DEFAULT 50,
    "helpfulVoteXP" INTEGER NOT NULL DEFAULT 30,
    "dailyStreakXP" INTEGER NOT NULL DEFAULT 20,
    "topReviewXP" INTEGER NOT NULL DEFAULT 100,
    "monthlyTopReviewerXP" INTEGER NOT NULL DEFAULT 200,
    "monthlyRewardAmountCents" INTEGER NOT NULL DEFAULT 10000,
    "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" DATETIME NOT NULL,
    "updatedBy" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_xp_idx" ON "User"("xp");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "ReviewerProfile_userId_key" ON "ReviewerProfile"("userId");

-- CreateIndex
CREATE INDEX "Paper_authorId_idx" ON "Paper"("authorId");

-- CreateIndex
CREATE INDEX "Paper_status_idx" ON "Paper"("status");

-- CreateIndex
CREATE INDEX "Paper_domain_idx" ON "Paper"("domain");

-- CreateIndex
CREATE INDEX "Paper_createdAt_idx" ON "Paper"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "CoAuthor_paperId_email_key" ON "CoAuthor"("paperId", "email");

-- CreateIndex
CREATE INDEX "Review_paperId_idx" ON "Review"("paperId");

-- CreateIndex
CREATE INDEX "Review_reviewerId_idx" ON "Review"("reviewerId");

-- CreateIndex
CREATE INDEX "Review_submittedAt_idx" ON "Review"("submittedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Badge_slug_key" ON "Badge"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "UserBadge_userId_badgeId_key" ON "UserBadge"("userId", "badgeId");

-- CreateIndex
CREATE INDEX "XPLog_userId_idx" ON "XPLog"("userId");

-- CreateIndex
CREATE INDEX "XPLog_createdAt_idx" ON "XPLog"("createdAt");

-- CreateIndex
CREATE INDEX "Notification_userId_isRead_idx" ON "Notification"("userId", "isRead");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Tip_stripePaymentId_key" ON "Tip"("stripePaymentId");

-- CreateIndex
CREATE INDEX "Tip_receiverId_idx" ON "Tip"("receiverId");

-- CreateIndex
CREATE INDEX "Tip_senderId_idx" ON "Tip"("senderId");
