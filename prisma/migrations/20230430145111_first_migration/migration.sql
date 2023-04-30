-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Students" (
    "id" SERIAL NOT NULL,
    "usersId" INTEGER NOT NULL,
    "classesId" INTEGER,

    CONSTRAINT "Students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Parents" (
    "id" SERIAL NOT NULL,
    "usersId" INTEGER NOT NULL,

    CONSTRAINT "Parents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassTeachers" (
    "id" SERIAL NOT NULL,
    "usersId" INTEGER NOT NULL,

    CONSTRAINT "ClassTeachers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Classes" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "classTeachersId" INTEGER NOT NULL,

    CONSTRAINT "Classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ParentsToStudents" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Students_usersId_key" ON "Students"("usersId");

-- CreateIndex
CREATE UNIQUE INDEX "Parents_usersId_key" ON "Parents"("usersId");

-- CreateIndex
CREATE UNIQUE INDEX "ClassTeachers_usersId_key" ON "ClassTeachers"("usersId");

-- CreateIndex
CREATE UNIQUE INDEX "Classes_classTeachersId_key" ON "Classes"("classTeachersId");

-- CreateIndex
CREATE UNIQUE INDEX "_ParentsToStudents_AB_unique" ON "_ParentsToStudents"("A", "B");

-- CreateIndex
CREATE INDEX "_ParentsToStudents_B_index" ON "_ParentsToStudents"("B");

-- AddForeignKey
ALTER TABLE "Students" ADD CONSTRAINT "Students_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Students" ADD CONSTRAINT "Students_classesId_fkey" FOREIGN KEY ("classesId") REFERENCES "Classes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Parents" ADD CONSTRAINT "Parents_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassTeachers" ADD CONSTRAINT "ClassTeachers_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Classes" ADD CONSTRAINT "Classes_classTeachersId_fkey" FOREIGN KEY ("classTeachersId") REFERENCES "ClassTeachers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ParentsToStudents" ADD CONSTRAINT "_ParentsToStudents_A_fkey" FOREIGN KEY ("A") REFERENCES "Parents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ParentsToStudents" ADD CONSTRAINT "_ParentsToStudents_B_fkey" FOREIGN KEY ("B") REFERENCES "Students"("id") ON DELETE CASCADE ON UPDATE CASCADE;
