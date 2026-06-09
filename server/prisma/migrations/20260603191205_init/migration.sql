-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "news" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "excerpt" TEXT,
    "content" TEXT,
    "category" VARCHAR(100),
    "category_color" VARCHAR(50),
    "image_url" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "news_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activities" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "badges" TEXT[],
    "target_value" VARCHAR(100),
    "target_label" VARCHAR(100),
    "objective" VARCHAR(255),
    "image_url" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "testimonials" (
    "id" SERIAL NOT NULL,
    "quote" TEXT,
    "name" VARCHAR(100),
    "role" VARCHAR(100),
    "avatar_url" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "testimonials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "repository_documents" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "icon_type" VARCHAR(50),
    "file_size" VARCHAR(50),
    "doc_type" VARCHAR(50),
    "file_url" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "repository_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashboard_stats" (
    "id" SERIAL NOT NULL,
    "key_name" VARCHAR(100) NOT NULL,
    "value" VARCHAR(50),
    "unit" VARCHAR(20),
    "color_class" VARCHAR(50),
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dashboard_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faqs" (
    "id" SERIAL NOT NULL,
    "question" TEXT,
    "answer" TEXT,
    "order_num" INTEGER,

    CONSTRAINT "faqs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "dashboard_stats_key_name_key" ON "dashboard_stats"("key_name");
