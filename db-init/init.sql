--
-- PostgreSQL database dump
--

\restrict tZhnERXHYIaSsesQutI71JoXn9b38Sma5dG0U2mPENrZzpeaQSyE7y4FAc2xCWT

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

-- Started on 2026-03-22 11:40:59

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5 (class 2615 OID 16683)
-- Name: public; Type: SCHEMA; Schema: -; Owner: Enrique
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO "Enrique";

--
-- TOC entry 5166 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: Enrique
--

COMMENT ON SCHEMA public IS '';


--
-- TOC entry 926 (class 1247 OID 17048)
-- Name: estado_pedido; Type: TYPE; Schema: public; Owner: Enrique
--

CREATE TYPE public.estado_pedido AS ENUM (
    'PENDIENTE',
    'VALIDADO',
    'CONFIRMADO',
    'RECHAZADO',
    'BORRADOR',
    'INCOMPLETO'
);


ALTER TYPE public.estado_pedido OWNER TO "Enrique";

--
-- TOC entry 878 (class 1247 OID 16685)
-- Name: tipo_movimiento_enum; Type: TYPE; Schema: public; Owner: Enrique
--

CREATE TYPE public.tipo_movimiento_enum AS ENUM (
    'ENTRADA',
    'SALIDA',
    'AJUSTE',
    'MERMA'
);


ALTER TYPE public.tipo_movimiento_enum OWNER TO "Enrique";

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 241 (class 1259 OID 16979)
-- Name: alumnado; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alumnado (
    id_usuario integer NOT NULL,
    curso character varying(50)
);


ALTER TABLE public.alumnado OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16700)
-- Name: categoria; Type: TABLE; Schema: public; Owner: Enrique
--

CREATE TABLE public.categoria (
    id_categoria integer NOT NULL,
    nombre character varying(100) NOT NULL
);


ALTER TABLE public.categoria OWNER TO "Enrique";

--
-- TOC entry 219 (class 1259 OID 16699)
-- Name: categoria_id_categoria_seq; Type: SEQUENCE; Schema: public; Owner: Enrique
--

CREATE SEQUENCE public.categoria_id_categoria_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categoria_id_categoria_seq OWNER TO "Enrique";

--
-- TOC entry 5168 (class 0 OID 0)
-- Dependencies: 219
-- Name: categoria_id_categoria_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Enrique
--

ALTER SEQUENCE public.categoria_id_categoria_seq OWNED BY public.categoria.id_categoria;


--
-- TOC entry 222 (class 1259 OID 16709)
-- Name: escandallo; Type: TABLE; Schema: public; Owner: Enrique
--

CREATE TABLE public.escandallo (
    id_escandallo integer NOT NULL,
    descripcion character varying(255),
    fecha_creacion timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.escandallo OWNER TO "Enrique";

--
-- TOC entry 223 (class 1259 OID 16717)
-- Name: escandallo_detalle; Type: TABLE; Schema: public; Owner: Enrique
--

CREATE TABLE public.escandallo_detalle (
    id_escandallo integer NOT NULL,
    id_usuario integer NOT NULL,
    id_ingrediente integer NOT NULL
);


ALTER TABLE public.escandallo_detalle OWNER TO "Enrique";

--
-- TOC entry 221 (class 1259 OID 16708)
-- Name: escandallo_id_escandallo_seq; Type: SEQUENCE; Schema: public; Owner: Enrique
--

CREATE SEQUENCE public.escandallo_id_escandallo_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.escandallo_id_escandallo_seq OWNER TO "Enrique";

--
-- TOC entry 5169 (class 0 OID 0)
-- Dependencies: 221
-- Name: escandallo_id_escandallo_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Enrique
--

ALTER SEQUENCE public.escandallo_id_escandallo_seq OWNED BY public.escandallo.id_escandallo;


--
-- TOC entry 225 (class 1259 OID 16726)
-- Name: ingrediente; Type: TABLE; Schema: public; Owner: Enrique
--

CREATE TABLE public.ingrediente (
    id_ingrediente integer NOT NULL,
    nombre character varying(150) NOT NULL,
    imagen character varying(255),
    stock numeric(10,2) DEFAULT 0.00,
    stock_minimo numeric(10,2) DEFAULT 0.00,
    tipo character varying(50),
    id_categoria integer,
    id_proveedor integer,
    precio_unidad numeric(10,2) DEFAULT 0.00 NOT NULL,
    unidad_medida character varying(50)
);


ALTER TABLE public.ingrediente OWNER TO "Enrique";

--
-- TOC entry 224 (class 1259 OID 16725)
-- Name: ingrediente_id_ingrediente_seq; Type: SEQUENCE; Schema: public; Owner: Enrique
--

CREATE SEQUENCE public.ingrediente_id_ingrediente_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ingrediente_id_ingrediente_seq OWNER TO "Enrique";

--
-- TOC entry 5170 (class 0 OID 0)
-- Dependencies: 224
-- Name: ingrediente_id_ingrediente_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Enrique
--

ALTER SEQUENCE public.ingrediente_id_ingrediente_seq OWNED BY public.ingrediente.id_ingrediente;


--
-- TOC entry 226 (class 1259 OID 16736)
-- Name: jefe_economato; Type: TABLE; Schema: public; Owner: Enrique
--

CREATE TABLE public.jefe_economato (
    id_rol integer NOT NULL,
    permisos character varying(255)
);


ALTER TABLE public.jefe_economato OWNER TO "Enrique";

--
-- TOC entry 244 (class 1259 OID 17062)
-- Name: material; Type: TABLE; Schema: public; Owner: Enrique
--

CREATE TABLE public.material (
    id_material integer NOT NULL,
    nombre character varying(150) NOT NULL,
    unidad_medida character varying(50),
    precio_unidad numeric(10,2) DEFAULT 0.00 NOT NULL,
    id_categoria integer,
    stock integer DEFAULT 0 NOT NULL,
    stock_minimo integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.material OWNER TO "Enrique";

--
-- TOC entry 243 (class 1259 OID 17061)
-- Name: material_id_material_seq; Type: SEQUENCE; Schema: public; Owner: Enrique
--

CREATE SEQUENCE public.material_id_material_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.material_id_material_seq OWNER TO "Enrique";

--
-- TOC entry 5171 (class 0 OID 0)
-- Dependencies: 243
-- Name: material_id_material_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Enrique
--

ALTER SEQUENCE public.material_id_material_seq OWNED BY public.material.id_material;


--
-- TOC entry 228 (class 1259 OID 16743)
-- Name: movimiento; Type: TABLE; Schema: public; Owner: Enrique
--

CREATE TABLE public.movimiento (
    id_movimiento integer NOT NULL,
    id_ingrediente integer NOT NULL,
    id_usuario integer NOT NULL,
    tipo_movimiento public.tipo_movimiento_enum NOT NULL,
    cantidad numeric(10,2) NOT NULL,
    fecha timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP,
    observaciones character varying(255)
);


ALTER TABLE public.movimiento OWNER TO "Enrique";

--
-- TOC entry 227 (class 1259 OID 16742)
-- Name: movimiento_id_movimiento_seq; Type: SEQUENCE; Schema: public; Owner: Enrique
--

CREATE SEQUENCE public.movimiento_id_movimiento_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.movimiento_id_movimiento_seq OWNER TO "Enrique";

--
-- TOC entry 5172 (class 0 OID 0)
-- Dependencies: 227
-- Name: movimiento_id_movimiento_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Enrique
--

ALTER SEQUENCE public.movimiento_id_movimiento_seq OWNED BY public.movimiento.id_movimiento;


--
-- TOC entry 230 (class 1259 OID 16756)
-- Name: pedido; Type: TABLE; Schema: public; Owner: Enrique
--

CREATE TABLE public.pedido (
    id_pedido integer NOT NULL,
    fecha_pedido timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP,
    id_usuario integer NOT NULL,
    estado public.estado_pedido DEFAULT 'PENDIENTE'::public.estado_pedido NOT NULL,
    observaciones text,
    proveedor character varying(150),
    tipo_pedido character varying(50),
    total_estimado numeric(10,2)
);


ALTER TABLE public.pedido OWNER TO "Enrique";

--
-- TOC entry 229 (class 1259 OID 16755)
-- Name: pedido_id_pedido_seq; Type: SEQUENCE; Schema: public; Owner: Enrique
--

CREATE SEQUENCE public.pedido_id_pedido_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pedido_id_pedido_seq OWNER TO "Enrique";

--
-- TOC entry 5173 (class 0 OID 0)
-- Dependencies: 229
-- Name: pedido_id_pedido_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Enrique
--

ALTER SEQUENCE public.pedido_id_pedido_seq OWNED BY public.pedido.id_pedido;


--
-- TOC entry 231 (class 1259 OID 16765)
-- Name: pedido_ingrediente; Type: TABLE; Schema: public; Owner: Enrique
--

CREATE TABLE public.pedido_ingrediente (
    id_pedido integer NOT NULL,
    id_ingrediente integer NOT NULL,
    cantidad_solicitada numeric(10,2) NOT NULL,
    cantidad_recibida numeric(10,2) DEFAULT 0 NOT NULL
);


ALTER TABLE public.pedido_ingrediente OWNER TO "Enrique";

--
-- TOC entry 245 (class 1259 OID 17105)
-- Name: pedido_material; Type: TABLE; Schema: public; Owner: Enrique
--

CREATE TABLE public.pedido_material (
    id_pedido integer NOT NULL,
    id_material integer NOT NULL,
    cantidad_solicitada integer NOT NULL,
    cantidad_recibida integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.pedido_material OWNER TO "Enrique";

--
-- TOC entry 242 (class 1259 OID 16990)
-- Name: profesorado; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profesorado (
    id_usuario integer NOT NULL,
    asignaturas character varying(255)
);


ALTER TABLE public.profesorado OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 16780)
-- Name: proveedor; Type: TABLE; Schema: public; Owner: Enrique
--

CREATE TABLE public.proveedor (
    id_proveedor integer NOT NULL,
    nombre character varying(150) NOT NULL
);


ALTER TABLE public.proveedor OWNER TO "Enrique";

--
-- TOC entry 232 (class 1259 OID 16779)
-- Name: proveedor_id_proveedor_seq; Type: SEQUENCE; Schema: public; Owner: Enrique
--

CREATE SEQUENCE public.proveedor_id_proveedor_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.proveedor_id_proveedor_seq OWNER TO "Enrique";

--
-- TOC entry 5174 (class 0 OID 0)
-- Dependencies: 232
-- Name: proveedor_id_proveedor_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Enrique
--

ALTER SEQUENCE public.proveedor_id_proveedor_seq OWNED BY public.proveedor.id_proveedor;


--
-- TOC entry 235 (class 1259 OID 16789)
-- Name: receta; Type: TABLE; Schema: public; Owner: Enrique
--

CREATE TABLE public.receta (
    id_receta integer NOT NULL,
    fecha_creacion timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP,
    cantidad_platos integer
);


ALTER TABLE public.receta OWNER TO "Enrique";

--
-- TOC entry 234 (class 1259 OID 16788)
-- Name: receta_id_receta_seq; Type: SEQUENCE; Schema: public; Owner: Enrique
--

CREATE SEQUENCE public.receta_id_receta_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.receta_id_receta_seq OWNER TO "Enrique";

--
-- TOC entry 5175 (class 0 OID 0)
-- Dependencies: 234
-- Name: receta_id_receta_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Enrique
--

ALTER SEQUENCE public.receta_id_receta_seq OWNED BY public.receta.id_receta;


--
-- TOC entry 236 (class 1259 OID 16797)
-- Name: receta_ingrediente; Type: TABLE; Schema: public; Owner: Enrique
--

CREATE TABLE public.receta_ingrediente (
    id_receta integer NOT NULL,
    id_ingrediente integer NOT NULL,
    cantidad numeric(10,2) NOT NULL,
    rendimiento numeric(5,2)
);


ALTER TABLE public.receta_ingrediente OWNER TO "Enrique";

--
-- TOC entry 238 (class 1259 OID 16806)
-- Name: rol; Type: TABLE; Schema: public; Owner: Enrique
--

CREATE TABLE public.rol (
    id_rol integer NOT NULL,
    nombre character varying(50) NOT NULL,
    tipo character varying(50) NOT NULL
);


ALTER TABLE public.rol OWNER TO "Enrique";

--
-- TOC entry 237 (class 1259 OID 16805)
-- Name: rol_id_rol_seq; Type: SEQUENCE; Schema: public; Owner: Enrique
--

CREATE SEQUENCE public.rol_id_rol_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rol_id_rol_seq OWNER TO "Enrique";

--
-- TOC entry 5176 (class 0 OID 0)
-- Dependencies: 237
-- Name: rol_id_rol_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Enrique
--

ALTER SEQUENCE public.rol_id_rol_seq OWNED BY public.rol.id_rol;


--
-- TOC entry 240 (class 1259 OID 16816)
-- Name: usuario; Type: TABLE; Schema: public; Owner: Enrique
--

CREATE TABLE public.usuario (
    id_usuario integer NOT NULL,
    username character varying(50) NOT NULL,
    nombre character varying(50) NOT NULL,
    apellido1 character varying(50) NOT NULL,
    apellido2 character varying(50),
    email character varying(100),
    contrasenya character varying(255) NOT NULL,
    id_rol integer NOT NULL,
    primer_login boolean DEFAULT true NOT NULL
);


ALTER TABLE public.usuario OWNER TO "Enrique";

--
-- TOC entry 239 (class 1259 OID 16815)
-- Name: usuario_id_usuario_seq; Type: SEQUENCE; Schema: public; Owner: Enrique
--

CREATE SEQUENCE public.usuario_id_usuario_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuario_id_usuario_seq OWNER TO "Enrique";

--
-- TOC entry 5177 (class 0 OID 0)
-- Dependencies: 239
-- Name: usuario_id_usuario_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Enrique
--

ALTER SEQUENCE public.usuario_id_usuario_seq OWNED BY public.usuario.id_usuario;


--
-- TOC entry 4935 (class 2604 OID 16703)
-- Name: categoria id_categoria; Type: DEFAULT; Schema: public; Owner: Enrique
--

ALTER TABLE ONLY public.categoria ALTER COLUMN id_categoria SET DEFAULT nextval('public.categoria_id_categoria_seq'::regclass);


--
-- TOC entry 4936 (class 2604 OID 16712)
-- Name: escandallo id_escandallo; Type: DEFAULT; Schema: public; Owner: Enrique
--

ALTER TABLE ONLY public.escandallo ALTER COLUMN id_escandallo SET DEFAULT nextval('public.escandallo_id_escandallo_seq'::regclass);


--
-- TOC entry 4938 (class 2604 OID 16729)
-- Name: ingrediente id_ingrediente; Type: DEFAULT; Schema: public; Owner: Enrique
--

ALTER TABLE ONLY public.ingrediente ALTER COLUMN id_ingrediente SET DEFAULT nextval('public.ingrediente_id_ingrediente_seq'::regclass);


--
-- TOC entry 4954 (class 2604 OID 17065)
-- Name: material id_material; Type: DEFAULT; Schema: public; Owner: Enrique
--

ALTER TABLE ONLY public.material ALTER COLUMN id_material SET DEFAULT nextval('public.material_id_material_seq'::regclass);


--
-- TOC entry 4942 (class 2604 OID 16746)
-- Name: movimiento id_movimiento; Type: DEFAULT; Schema: public; Owner: Enrique
--

ALTER TABLE ONLY public.movimiento ALTER COLUMN id_movimiento SET DEFAULT nextval('public.movimiento_id_movimiento_seq'::regclass);


--
-- TOC entry 4944 (class 2604 OID 16759)
-- Name: pedido id_pedido; Type: DEFAULT; Schema: public; Owner: Enrique
--

ALTER TABLE ONLY public.pedido ALTER COLUMN id_pedido SET DEFAULT nextval('public.pedido_id_pedido_seq'::regclass);


--
-- TOC entry 4948 (class 2604 OID 16783)
-- Name: proveedor id_proveedor; Type: DEFAULT; Schema: public; Owner: Enrique
--

ALTER TABLE ONLY public.proveedor ALTER COLUMN id_proveedor SET DEFAULT nextval('public.proveedor_id_proveedor_seq'::regclass);


--
-- TOC entry 4949 (class 2604 OID 16792)
-- Name: receta id_receta; Type: DEFAULT; Schema: public; Owner: Enrique
--

ALTER TABLE ONLY public.receta ALTER COLUMN id_receta SET DEFAULT nextval('public.receta_id_receta_seq'::regclass);


--
-- TOC entry 4951 (class 2604 OID 16809)
-- Name: rol id_rol; Type: DEFAULT; Schema: public; Owner: Enrique
--

ALTER TABLE ONLY public.rol ALTER COLUMN id_rol SET DEFAULT nextval('public.rol_id_rol_seq'::regclass);


--
-- TOC entry 4952 (class 2604 OID 16819)
-- Name: usuario id_usuario; Type: DEFAULT; Schema: public; Owner: Enrique
--

ALTER TABLE ONLY public.usuario ALTER COLUMN id_usuario SET DEFAULT nextval('public.usuario_id_usuario_seq'::regclass);


--
-- TOC entry 4988 (class 2606 OID 16984)
-- Name: alumnado alumnado_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alumnado
    ADD CONSTRAINT alumnado_pkey PRIMARY KEY (id_usuario);


--
-- TOC entry 4960 (class 2606 OID 16707)
-- Name: categoria categoria_pkey; Type: CONSTRAINT; Schema: public; Owner: Enrique
--

ALTER TABLE ONLY public.categoria
    ADD CONSTRAINT categoria_pkey PRIMARY KEY (id_categoria);


--
-- TOC entry 4964 (class 2606 OID 16724)
-- Name: escandallo_detalle escandallo_detalle_pkey; Type: CONSTRAINT; Schema: public; Owner: Enrique
--

ALTER TABLE ONLY public.escandallo_detalle
    ADD CONSTRAINT escandallo_detalle_pkey PRIMARY KEY (id_escandallo, id_usuario, id_ingrediente);


--
-- TOC entry 4962 (class 2606 OID 16716)
-- Name: escandallo escandallo_pkey; Type: CONSTRAINT; Schema: public; Owner: Enrique
--

ALTER TABLE ONLY public.escandallo
    ADD CONSTRAINT escandallo_pkey PRIMARY KEY (id_escandallo);


--
-- TOC entry 4966 (class 2606 OID 16735)
-- Name: ingrediente ingrediente_pkey; Type: CONSTRAINT; Schema: public; Owner: Enrique
--

ALTER TABLE ONLY public.ingrediente
    ADD CONSTRAINT ingrediente_pkey PRIMARY KEY (id_ingrediente);


--
-- TOC entry 4968 (class 2606 OID 16741)
-- Name: jefe_economato jefe_economato_pkey; Type: CONSTRAINT; Schema: public; Owner: Enrique
--

ALTER TABLE ONLY public.jefe_economato
    ADD CONSTRAINT jefe_economato_pkey PRIMARY KEY (id_rol);


--
-- TOC entry 4992 (class 2606 OID 17071)
-- Name: material material_pkey; Type: CONSTRAINT; Schema: public; Owner: Enrique
--

ALTER TABLE ONLY public.material
    ADD CONSTRAINT material_pkey PRIMARY KEY (id_material);


--
-- TOC entry 4970 (class 2606 OID 16754)
-- Name: movimiento movimiento_pkey; Type: CONSTRAINT; Schema: public; Owner: Enrique
--

ALTER TABLE ONLY public.movimiento
    ADD CONSTRAINT movimiento_pkey PRIMARY KEY (id_movimiento);


--
-- TOC entry 4974 (class 2606 OID 16772)
-- Name: pedido_ingrediente pedido_ingrediente_pkey; Type: CONSTRAINT; Schema: public; Owner: Enrique
--

ALTER TABLE ONLY public.pedido_ingrediente
    ADD CONSTRAINT pedido_ingrediente_pkey PRIMARY KEY (id_pedido, id_ingrediente);


--
-- TOC entry 4994 (class 2606 OID 17112)
-- Name: pedido_material pedido_material_pkey; Type: CONSTRAINT; Schema: public; Owner: Enrique
--

ALTER TABLE ONLY public.pedido_material
    ADD CONSTRAINT pedido_material_pkey PRIMARY KEY (id_pedido, id_material);


--
-- TOC entry 4972 (class 2606 OID 16764)
-- Name: pedido pedido_pkey; Type: CONSTRAINT; Schema: public; Owner: Enrique
--

ALTER TABLE ONLY public.pedido
    ADD CONSTRAINT pedido_pkey PRIMARY KEY (id_pedido);


--
-- TOC entry 4990 (class 2606 OID 16995)
-- Name: profesorado profesorado_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profesorado
    ADD CONSTRAINT profesorado_pkey PRIMARY KEY (id_usuario);


--
-- TOC entry 4976 (class 2606 OID 16787)
-- Name: proveedor proveedor_pkey; Type: CONSTRAINT; Schema: public; Owner: Enrique
--

ALTER TABLE ONLY public.proveedor
    ADD CONSTRAINT proveedor_pkey PRIMARY KEY (id_proveedor);


--
-- TOC entry 4980 (class 2606 OID 16804)
-- Name: receta_ingrediente receta_ingrediente_pkey; Type: CONSTRAINT; Schema: public; Owner: Enrique
--

ALTER TABLE ONLY public.receta_ingrediente
    ADD CONSTRAINT receta_ingrediente_pkey PRIMARY KEY (id_receta, id_ingrediente);


--
-- TOC entry 4978 (class 2606 OID 16796)
-- Name: receta receta_pkey; Type: CONSTRAINT; Schema: public; Owner: Enrique
--

ALTER TABLE ONLY public.receta
    ADD CONSTRAINT receta_pkey PRIMARY KEY (id_receta);


--
-- TOC entry 4982 (class 2606 OID 16814)
-- Name: rol rol_pkey; Type: CONSTRAINT; Schema: public; Owner: Enrique
--

ALTER TABLE ONLY public.rol
    ADD CONSTRAINT rol_pkey PRIMARY KEY (id_rol);


--
-- TOC entry 4985 (class 2606 OID 16831)
-- Name: usuario usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: Enrique
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (id_usuario);


--
-- TOC entry 4983 (class 1259 OID 17002)
-- Name: usuario_email_key; Type: INDEX; Schema: public; Owner: Enrique
--

CREATE UNIQUE INDEX usuario_email_key ON public.usuario USING btree (email);


--
-- TOC entry 4986 (class 1259 OID 17001)
-- Name: usuario_username_key; Type: INDEX; Schema: public; Owner: Enrique
--

CREATE UNIQUE INDEX usuario_username_key ON public.usuario USING btree (username);


--
-- TOC entry 5009 (class 2606 OID 17019)
-- Name: alumnado alumnado_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alumnado
    ADD CONSTRAINT alumnado_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuario(id_usuario) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4995 (class 2606 OID 16839)
-- Name: escandallo_detalle fk_ed_escandallo; Type: FK CONSTRAINT; Schema: public; Owner: Enrique
--

ALTER TABLE ONLY public.escandallo_detalle
    ADD CONSTRAINT fk_ed_escandallo FOREIGN KEY (id_escandallo) REFERENCES public.escandallo(id_escandallo) ON DELETE CASCADE;


--
-- TOC entry 4996 (class 2606 OID 16844)
-- Name: escandallo_detalle fk_ed_ingrediente; Type: FK CONSTRAINT; Schema: public; Owner: Enrique
--

ALTER TABLE ONLY public.escandallo_detalle
    ADD CONSTRAINT fk_ed_ingrediente FOREIGN KEY (id_ingrediente) REFERENCES public.ingrediente(id_ingrediente);


--
-- TOC entry 4997 (class 2606 OID 16849)
-- Name: escandallo_detalle fk_ed_usuario; Type: FK CONSTRAINT; Schema: public; Owner: Enrique
--

ALTER TABLE ONLY public.escandallo_detalle
    ADD CONSTRAINT fk_ed_usuario FOREIGN KEY (id_usuario) REFERENCES public.usuario(id_usuario);


--
-- TOC entry 4998 (class 2606 OID 16854)
-- Name: ingrediente fk_ingrediente_categoria; Type: FK CONSTRAINT; Schema: public; Owner: Enrique
--

ALTER TABLE ONLY public.ingrediente
    ADD CONSTRAINT fk_ingrediente_categoria FOREIGN KEY (id_categoria) REFERENCES public.categoria(id_categoria);


--
-- TOC entry 4999 (class 2606 OID 16859)
-- Name: ingrediente fk_ingrediente_proveedor; Type: FK CONSTRAINT; Schema: public; Owner: Enrique
--

ALTER TABLE ONLY public.ingrediente
    ADD CONSTRAINT fk_ingrediente_proveedor FOREIGN KEY (id_proveedor) REFERENCES public.proveedor(id_proveedor);


--
-- TOC entry 5000 (class 2606 OID 16864)
-- Name: jefe_economato fk_jefe_rol; Type: FK CONSTRAINT; Schema: public; Owner: Enrique
--

ALTER TABLE ONLY public.jefe_economato
    ADD CONSTRAINT fk_jefe_rol FOREIGN KEY (id_rol) REFERENCES public.rol(id_rol) ON DELETE CASCADE;


--
-- TOC entry 5011 (class 2606 OID 17072)
-- Name: material fk_material_categoria; Type: FK CONSTRAINT; Schema: public; Owner: Enrique
--

ALTER TABLE ONLY public.material
    ADD CONSTRAINT fk_material_categoria FOREIGN KEY (id_categoria) REFERENCES public.categoria(id_categoria);


--
-- TOC entry 5001 (class 2606 OID 16869)
-- Name: movimiento fk_movimiento_ingrediente; Type: FK CONSTRAINT; Schema: public; Owner: Enrique
--

ALTER TABLE ONLY public.movimiento
    ADD CONSTRAINT fk_movimiento_ingrediente FOREIGN KEY (id_ingrediente) REFERENCES public.ingrediente(id_ingrediente);


--
-- TOC entry 5002 (class 2606 OID 16874)
-- Name: movimiento fk_movimiento_usuario; Type: FK CONSTRAINT; Schema: public; Owner: Enrique
--

ALTER TABLE ONLY public.movimiento
    ADD CONSTRAINT fk_movimiento_usuario FOREIGN KEY (id_usuario) REFERENCES public.usuario(id_usuario);


--
-- TOC entry 5003 (class 2606 OID 16879)
-- Name: pedido fk_pedido_usuario; Type: FK CONSTRAINT; Schema: public; Owner: Enrique
--

ALTER TABLE ONLY public.pedido
    ADD CONSTRAINT fk_pedido_usuario FOREIGN KEY (id_usuario) REFERENCES public.usuario(id_usuario);


--
-- TOC entry 5004 (class 2606 OID 16884)
-- Name: pedido_ingrediente fk_pi_ingrediente; Type: FK CONSTRAINT; Schema: public; Owner: Enrique
--

ALTER TABLE ONLY public.pedido_ingrediente
    ADD CONSTRAINT fk_pi_ingrediente FOREIGN KEY (id_ingrediente) REFERENCES public.ingrediente(id_ingrediente);


--
-- TOC entry 5005 (class 2606 OID 16889)
-- Name: pedido_ingrediente fk_pi_pedido; Type: FK CONSTRAINT; Schema: public; Owner: Enrique
--

ALTER TABLE ONLY public.pedido_ingrediente
    ADD CONSTRAINT fk_pi_pedido FOREIGN KEY (id_pedido) REFERENCES public.pedido(id_pedido) ON DELETE CASCADE;


--
-- TOC entry 5006 (class 2606 OID 16899)
-- Name: receta_ingrediente fk_ri_ingrediente; Type: FK CONSTRAINT; Schema: public; Owner: Enrique
--

ALTER TABLE ONLY public.receta_ingrediente
    ADD CONSTRAINT fk_ri_ingrediente FOREIGN KEY (id_ingrediente) REFERENCES public.ingrediente(id_ingrediente);


--
-- TOC entry 5007 (class 2606 OID 16904)
-- Name: receta_ingrediente fk_ri_receta; Type: FK CONSTRAINT; Schema: public; Owner: Enrique
--

ALTER TABLE ONLY public.receta_ingrediente
    ADD CONSTRAINT fk_ri_receta FOREIGN KEY (id_receta) REFERENCES public.receta(id_receta) ON DELETE CASCADE;


--
-- TOC entry 5012 (class 2606 OID 17113)
-- Name: pedido_material pedido_material_id_material_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Enrique
--

ALTER TABLE ONLY public.pedido_material
    ADD CONSTRAINT pedido_material_id_material_fkey FOREIGN KEY (id_material) REFERENCES public.material(id_material);


--
-- TOC entry 5013 (class 2606 OID 17118)
-- Name: pedido_material pedido_material_id_pedido_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Enrique
--

ALTER TABLE ONLY public.pedido_material
    ADD CONSTRAINT pedido_material_id_pedido_fkey FOREIGN KEY (id_pedido) REFERENCES public.pedido(id_pedido) ON DELETE CASCADE;


--
-- TOC entry 5010 (class 2606 OID 17024)
-- Name: profesorado profesorado_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profesorado
    ADD CONSTRAINT profesorado_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuario(id_usuario) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5008 (class 2606 OID 17014)
-- Name: usuario usuario_id_rol_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Enrique
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_id_rol_fkey FOREIGN KEY (id_rol) REFERENCES public.rol(id_rol) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5167 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: Enrique
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


-- Completed on 2026-03-22 11:41:00

--
-- PostgreSQL database dump complete
--

\unrestrict tZhnERXHYIaSsesQutI71JoXn9b38Sma5dG0U2mPENrZzpeaQSyE7y4FAc2xCWT

