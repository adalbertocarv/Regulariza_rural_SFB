/*
  Warnings:

  - You are about to drop the `activities` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `dashboard_stats` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `faqs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `news` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `repository_documents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `testimonials` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "activities";

-- DropTable
DROP TABLE "dashboard_stats";

-- DropTable
DROP TABLE "faqs";

-- DropTable
DROP TABLE "news";

-- DropTable
DROP TABLE "repository_documents";

-- DropTable
DROP TABLE "testimonials";

-- DropTable
DROP TABLE "users";

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "noticias" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "excerpt" TEXT,
    "content" TEXT,
    "category" VARCHAR(100),
    "category_color" VARCHAR(50),
    "image_url" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "noticias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "atividades" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "badges" TEXT[],
    "target_value" VARCHAR(100),
    "target_label" VARCHAR(100),
    "objective" VARCHAR(255),
    "image_url" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "atividades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "depoimentos" (
    "id" SERIAL NOT NULL,
    "quote" TEXT,
    "name" VARCHAR(100),
    "role" VARCHAR(100),
    "avatar_url" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "depoimentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documentos_repositorio" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "icon_type" VARCHAR(50),
    "file_size" VARCHAR(50),
    "doc_type" VARCHAR(50),
    "file_url" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documentos_repositorio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estatisticas_dashboard" (
    "id" SERIAL NOT NULL,
    "key_name" VARCHAR(100) NOT NULL,
    "value" VARCHAR(50),
    "unit" VARCHAR(20),
    "color_class" VARCHAR(50),
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "estatisticas_dashboard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perguntas_frequentes" (
    "id" SERIAL NOT NULL,
    "question" TEXT,
    "answer" TEXT,
    "order_num" INTEGER,

    CONSTRAINT "perguntas_frequentes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "estatisticas_dashboard_key_name_key" ON "estatisticas_dashboard"("key_name");
