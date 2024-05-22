-- CreateTable
CREATE TABLE "projetos" (
    "id" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "nome_projeto" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "projetos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "projetos" ADD CONSTRAINT "projetos_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
