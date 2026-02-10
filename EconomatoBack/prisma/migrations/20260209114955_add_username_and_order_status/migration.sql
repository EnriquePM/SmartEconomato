-- CreateEnum
CREATE TYPE "estado_pedido" AS ENUM ('PENDIENTE', 'VALIDADO');

-- CreateEnum
CREATE TYPE "tipo_movimiento_enum" AS ENUM ('ENTRADA', 'SALIDA', 'AJUSTE', 'MERMA');

-- CreateTable
CREATE TABLE "alumnado" (
    "id_rol" INTEGER NOT NULL,
    "curso" VARCHAR(50),

    CONSTRAINT "alumnado_pkey" PRIMARY KEY ("id_rol")
);

-- CreateTable
CREATE TABLE "categoria" (
    "id_categoria" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,

    CONSTRAINT "categoria_pkey" PRIMARY KEY ("id_categoria")
);

-- CreateTable
CREATE TABLE "escandallo" (
    "id_escandallo" SERIAL NOT NULL,
    "descripcion" VARCHAR(255),
    "fecha_creacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "escandallo_pkey" PRIMARY KEY ("id_escandallo")
);

-- CreateTable
CREATE TABLE "escandallo_detalle" (
    "id_escandallo" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_ingrediente" INTEGER NOT NULL,

    CONSTRAINT "escandallo_detalle_pkey" PRIMARY KEY ("id_escandallo","id_usuario","id_ingrediente")
);

-- CreateTable
CREATE TABLE "ingrediente" (
    "id_ingrediente" SERIAL NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "imagen" VARCHAR(255),
    "stock" DECIMAL(10,2) DEFAULT 0.00,
    "stock_minimo" DECIMAL(10,2) DEFAULT 0.00,
    "tipo" VARCHAR(50),
    "id_categoria" INTEGER,
    "id_proveedor" INTEGER,

    CONSTRAINT "ingrediente_pkey" PRIMARY KEY ("id_ingrediente")
);

-- CreateTable
CREATE TABLE "jefe_economato" (
    "id_rol" INTEGER NOT NULL,
    "permisos" VARCHAR(255),

    CONSTRAINT "jefe_economato_pkey" PRIMARY KEY ("id_rol")
);

-- CreateTable
CREATE TABLE "movimiento" (
    "id_movimiento" SERIAL NOT NULL,
    "id_ingrediente" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "tipo_movimiento" "tipo_movimiento_enum" NOT NULL,
    "cantidad" DECIMAL(10,2) NOT NULL,
    "fecha" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "observaciones" VARCHAR(255),

    CONSTRAINT "movimiento_pkey" PRIMARY KEY ("id_movimiento")
);

-- CreateTable
CREATE TABLE "pedido" (
    "id_pedido" SERIAL NOT NULL,
    "fecha_pedido" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "id_usuario" INTEGER NOT NULL,
    "estado" "estado_pedido" NOT NULL DEFAULT 'PENDIENTE',

    CONSTRAINT "pedido_pkey" PRIMARY KEY ("id_pedido")
);

-- CreateTable
CREATE TABLE "pedido_ingrediente" (
    "id_pedido" INTEGER NOT NULL,
    "id_ingrediente" INTEGER NOT NULL,
    "cantidad_solicitada" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "pedido_ingrediente_pkey" PRIMARY KEY ("id_pedido","id_ingrediente")
);

-- CreateTable
CREATE TABLE "profesorado" (
    "id_rol" INTEGER NOT NULL,
    "asignaturas" VARCHAR(255),

    CONSTRAINT "profesorado_pkey" PRIMARY KEY ("id_rol")
);

-- CreateTable
CREATE TABLE "proveedor" (
    "id_proveedor" SERIAL NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,

    CONSTRAINT "proveedor_pkey" PRIMARY KEY ("id_proveedor")
);

-- CreateTable
CREATE TABLE "receta" (
    "id_receta" SERIAL NOT NULL,
    "fecha_creacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "cantidad_platos" INTEGER,

    CONSTRAINT "receta_pkey" PRIMARY KEY ("id_receta")
);

-- CreateTable
CREATE TABLE "receta_ingrediente" (
    "id_receta" INTEGER NOT NULL,
    "id_ingrediente" INTEGER NOT NULL,
    "cantidad" DECIMAL(10,2) NOT NULL,
    "rendimiento" DECIMAL(5,2),

    CONSTRAINT "receta_ingrediente_pkey" PRIMARY KEY ("id_receta","id_ingrediente")
);

-- CreateTable
CREATE TABLE "rol" (
    "id_rol" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "tipo" VARCHAR(50) NOT NULL,

    CONSTRAINT "rol_pkey" PRIMARY KEY ("id_rol")
);

-- CreateTable
CREATE TABLE "usuario" (
    "id_usuario" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "apellido1" VARCHAR(100) NOT NULL,
    "apellido2" VARCHAR(100),
    "username" TEXT NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "contrasenya" VARCHAR(255) NOT NULL,
    "fecha_creacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "id_rol" INTEGER NOT NULL,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_username_key" ON "usuario"("username");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- AddForeignKey
ALTER TABLE "alumnado" ADD CONSTRAINT "fk_alumno_rol" FOREIGN KEY ("id_rol") REFERENCES "rol"("id_rol") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "escandallo_detalle" ADD CONSTRAINT "fk_ed_escandallo" FOREIGN KEY ("id_escandallo") REFERENCES "escandallo"("id_escandallo") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "escandallo_detalle" ADD CONSTRAINT "fk_ed_ingrediente" FOREIGN KEY ("id_ingrediente") REFERENCES "ingrediente"("id_ingrediente") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "escandallo_detalle" ADD CONSTRAINT "fk_ed_usuario" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ingrediente" ADD CONSTRAINT "fk_ingrediente_categoria" FOREIGN KEY ("id_categoria") REFERENCES "categoria"("id_categoria") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ingrediente" ADD CONSTRAINT "fk_ingrediente_proveedor" FOREIGN KEY ("id_proveedor") REFERENCES "proveedor"("id_proveedor") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "jefe_economato" ADD CONSTRAINT "fk_jefe_rol" FOREIGN KEY ("id_rol") REFERENCES "rol"("id_rol") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "movimiento" ADD CONSTRAINT "fk_movimiento_ingrediente" FOREIGN KEY ("id_ingrediente") REFERENCES "ingrediente"("id_ingrediente") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "movimiento" ADD CONSTRAINT "fk_movimiento_usuario" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pedido" ADD CONSTRAINT "fk_pedido_usuario" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pedido_ingrediente" ADD CONSTRAINT "fk_pi_ingrediente" FOREIGN KEY ("id_ingrediente") REFERENCES "ingrediente"("id_ingrediente") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pedido_ingrediente" ADD CONSTRAINT "fk_pi_pedido" FOREIGN KEY ("id_pedido") REFERENCES "pedido"("id_pedido") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "profesorado" ADD CONSTRAINT "fk_profesor_rol" FOREIGN KEY ("id_rol") REFERENCES "rol"("id_rol") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "receta_ingrediente" ADD CONSTRAINT "fk_ri_ingrediente" FOREIGN KEY ("id_ingrediente") REFERENCES "ingrediente"("id_ingrediente") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "receta_ingrediente" ADD CONSTRAINT "fk_ri_receta" FOREIGN KEY ("id_receta") REFERENCES "receta"("id_receta") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "fk_usuario_rol" FOREIGN KEY ("id_rol") REFERENCES "rol"("id_rol") ON DELETE NO ACTION ON UPDATE NO ACTION;
