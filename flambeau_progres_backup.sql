--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

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
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- Name: StatutJustification; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."StatutJustification" AS ENUM (
    'BROUILLON',
    'SOUMISE',
    'EN_COURS',
    'DEMANDE_PRECISION',
    'VALIDEE',
    'REFUSEE'
);


ALTER TYPE public."StatutJustification" OWNER TO postgres;

--
-- Name: TypeCommentaire; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."TypeCommentaire" AS ENUM (
    'CHEF_REPONSE',
    'REFERENT_QUESTION',
    'REFERENT_FEEDBACK',
    'SYSTEM'
);


ALTER TYPE public."TypeCommentaire" OWNER TO postgres;

--
-- Name: TypeFichier; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."TypeFichier" AS ENUM (
    'IMAGE',
    'DOCUMENT',
    'AUTRE'
);


ALTER TYPE public."TypeFichier" OWNER TO postgres;

--
-- Name: TypeNotification; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."TypeNotification" AS ENUM (
    'NOUVELLE_JUSTIFICATION',
    'JUSTIFICATION_VALIDEE',
    'JUSTIFICATION_REFUSEE',
    'DEMANDE_PRECISION',
    'REPONSE_PRECISION',
    'BADGE_COMPLETE',
    'JUSTIFICATION_URGENTE',
    'NOUVEAU_COMMENTAIRE'
);


ALTER TYPE public."TypeNotification" OWNER TO postgres;

--
-- Name: TypeObjectif; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."TypeObjectif" AS ENUM (
    'COMPETENCE',
    'REALISATION'
);


ALTER TYPE public."TypeObjectif" OWNER TO postgres;

--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."UserRole" AS ENUM (
    'CHEF',
    'REFERENT',
    'ADMIN'
);


ALTER TYPE public."UserRole" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: account; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.account (
    id text NOT NULL,
    "accountId" text NOT NULL,
    "providerId" text NOT NULL,
    "userId" text NOT NULL,
    "accessToken" text,
    "refreshToken" text,
    "idToken" text,
    "accessTokenExpiresAt" timestamp(3) without time zone,
    "refreshTokenExpiresAt" timestamp(3) without time zone,
    scope text,
    password text,
    "createdAt" timestamp(3) without time zone NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.account OWNER TO postgres;

--
-- Name: badge_referents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.badge_referents (
    id text NOT NULL,
    "referentId" text NOT NULL,
    "badgeId" text NOT NULL,
    "assigneAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "assignePar" text
);


ALTER TABLE public.badge_referents OWNER TO postgres;

--
-- Name: badges; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.badges (
    id text NOT NULL,
    description text NOT NULL,
    ordre integer NOT NULL,
    actif boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    image_src text,
    name text NOT NULL,
    number text NOT NULL
);


ALTER TABLE public.badges OWNER TO postgres;

--
-- Name: commentaires; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.commentaires (
    id text NOT NULL,
    "justificationId" text NOT NULL,
    "auteurId" text NOT NULL,
    contenu text NOT NULL,
    type public."TypeCommentaire" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.commentaires OWNER TO postgres;

--
-- Name: fichiers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fichiers (
    id text NOT NULL,
    "justificationId" text NOT NULL,
    "nomOriginal" text NOT NULL,
    "nomStockage" text NOT NULL,
    "cheminFichier" text NOT NULL,
    type public."TypeFichier" NOT NULL,
    "mimeType" text NOT NULL,
    taille integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.fichiers OWNER TO postgres;

--
-- Name: justifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.justifications (
    id text NOT NULL,
    "chefId" text NOT NULL,
    "objectifId" text NOT NULL,
    "badgeId" text NOT NULL,
    "activiteDescription" text NOT NULL,
    "dateActivite" timestamp(3) without time zone,
    "dureeHeures" double precision,
    contexte text,
    "nombreJeunes" text,
    "trancheAge" text,
    niveau text,
    "objectifsAtteints" text,
    statut public."StatutJustification" DEFAULT 'BROUILLON'::public."StatutJustification" NOT NULL,
    version integer DEFAULT 1 NOT NULL,
    "soumiseAt" timestamp(3) without time zone,
    "valideeAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.justifications OWNER TO postgres;

--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id text NOT NULL,
    "destinataireId" text NOT NULL,
    "justificationId" text,
    type public."TypeNotification" NOT NULL,
    titre text NOT NULL,
    message text NOT NULL,
    lue boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "lueAt" timestamp(3) without time zone
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: objectifs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.objectifs (
    id text NOT NULL,
    "badgeId" text NOT NULL,
    code text NOT NULL,
    description text NOT NULL,
    type public."TypeObjectif" NOT NULL,
    "fichiersRequis" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.objectifs OWNER TO postgres;

--
-- Name: session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.session (
    id text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    token text NOT NULL,
    "createdAt" timestamp(3) without time zone NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "ipAddress" text,
    "userAgent" text,
    "userId" text NOT NULL
);


ALTER TABLE public.session OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id text NOT NULL,
    email text NOT NULL,
    name text NOT NULL,
    image text,
    role public."UserRole" DEFAULT 'CHEF'::public."UserRole" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "emailVerified" boolean NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: verification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.verification (
    id text NOT NULL,
    identifier text NOT NULL,
    value text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone,
    "updatedAt" timestamp(3) without time zone
);


ALTER TABLE public.verification OWNER TO postgres;

--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
bdb8ceec-ca92-45cb-91d6-99259691c783	90a743dd796de66959d4a6ac2bb285b32fd154681ee4ce2eeb9cc6c5033c2124	2025-07-11 13:04:22.778342+02	20250706160905_init	\N	\N	2025-07-11 13:04:22.75633+02	1
2fc354a8-81ea-4fb6-a49c-96b95b397ca5	779bd9421164eef5063d928d6d2d3a6d52d9d8de6416eebe16a22135c01ad15c	2025-07-11 13:04:22.796758+02	20250711105633_auth	\N	\N	2025-07-11 13:04:22.778621+02	1
8c05d801-8c93-47d0-8cec-a706ca1f2458	e87f3120674ebba0b15d284b6e17fd929fff55abaabd69e34c42a85708251ae5	2025-07-11 13:04:22.821236+02	20250711110238_full_db	\N	\N	2025-07-11 13:04:22.797046+02	1
9732dc5f-0146-4b4a-8779-fd09873857e6	bf1dbd0d953dc1a4f35d511a87717977f99fbb1c3df9e78aa9e003eeb8da56d9	2025-07-11 13:07:14.626656+02	20250711110714_adpate_role	\N	\N	2025-07-11 13:07:14.623288+02	1
2b9c174f-702c-4fac-baba-ffd33ae944ac	bb9d8f5e0f762974db6c08cd4d5b87e069b6465a260d97ecd42fa04c9bcf177b	2025-07-11 13:09:37.935606+02	20250711110937_edit_emailverified	\N	\N	2025-07-11 13:09:37.929065+02	1
099c352a-580b-495e-ae7e-8a22e8495903	228ef955cd5140a164b74226827736c52c9727be6c0a0b41712aabba38baab9b	2025-07-21 22:39:12.460616+02	20250721203912_update_badge_model	\N	\N	2025-07-21 22:39:12.441535+02	1
69e4260e-ca44-4b77-bacf-7ef2048d0120	674f126a82f88da13b6162940b5b34385e4f1cbe7bfe939bd45a1da7177392c5	2025-07-23 22:49:03.928594+02	20250723204903_remove_requiredcount	\N	\N	2025-07-23 22:49:03.924241+02	1
08efb5f9-2c2f-4939-af25-d1f5457b4cf2	81c99e0e408494c0698fe10e142e9fbbdbfed8ecc98bb8cde10f7fa42b9903c1	2025-07-23 22:52:44.692601+02	20250723205244_remove_parentid	\N	\N	2025-07-23 22:52:44.688084+02	1
cfe1b4c6-5632-4efa-9908-e384367fe238	e1fc803da9a036b5ebb3e92a475a72bb23bf068489dbc4af39c932a94b14e626	2025-07-23 23:10:00.552087+02	20250723211000_remove_couleur	\N	\N	2025-07-23 23:10:00.55071+02	1
07c69512-d553-4d90-a3dd-ebb807421f92	fb911a69bb55e0c25b9345a1353353993cacd584bae5b9104a463e1afe69310d	2025-07-23 23:15:48.213936+02	20250723211548_remove_title_objectif	\N	\N	2025-07-23 23:15:48.211364+02	1
9ce98507-49e6-47a1-920d-299194792483	5ae033bebbcc353c4f17747676405a4a7f563a5f2e8696e2061fe62f51bfd987	2025-08-24 14:32:39.391722+02	20250824123239_nombre_jeunes_string	\N	\N	2025-08-24 14:32:39.373112+02	1
\.


--
-- Data for Name: account; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.account (id, "accountId", "providerId", "userId", "accessToken", "refreshToken", "idToken", "accessTokenExpiresAt", "refreshTokenExpiresAt", scope, password, "createdAt", "updatedAt") FROM stdin;
kny27TkimitHbPiwj5u03w2Bm0v9a7oH	ltYJhwsP2efowDQRL0MZeXBvHNqMUYDi	credential	ltYJhwsP2efowDQRL0MZeXBvHNqMUYDi	\N	\N	\N	\N	\N	\N	fa1d6b191ad2a72073ef6a7a07e935fe:eaae1b7494a61ac73f648e934ab85bebc6a5343ade358b6d78d7ddaf7aed6932b0e9eb9b454935d518f7fad15404ee4e80df0e9fde42ca508d49aeb58ed7f959	2025-09-16 17:15:38.166	2025-09-16 17:15:38.166
HtQSPNcvvyHsMs1X4XzqN7e4LaK3nxYb	EHANF0wSuUes9radht8bpMCOsF8RFV9o	credential	EHANF0wSuUes9radht8bpMCOsF8RFV9o	\N	\N	\N	\N	\N	\N	d3e4d815298028592df76759ab2ac510:d7ff59f14e67deca9514b75ff40c29ff7243f98ed4b7a8271f60654ed9f1c340df81af89e857bb5b3c5a28330bdc89c3332bd3c9156939b343fd1c4602ba2574	2025-07-15 14:35:54.562	2025-07-15 14:35:54.562
\.


--
-- Data for Name: badge_referents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.badge_referents (id, "referentId", "badgeId", "assigneAt", "assignePar") FROM stdin;
cmfmtenlc000fw5ycwh7b9ill	ltYJhwsP2efowDQRL0MZeXBvHNqMUYDi	cmdhs5267000uw5lg0zk8zzkx	2025-09-16 17:16:33.648	\N
\.


--
-- Data for Name: badges; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.badges (id, description, ordre, actif, "createdAt", "updatedAt", image_src, name, number) FROM stdin;
cmdhs05lx0000w5lgci8c97qf	Cette spécialité s'adresse bien entendu aux Chefs de la branche Flambeaux. C'est une étape indispensable pour être Chef de Troupe de cette branche mais elle concerne également tout responsable qui souhaite mieux comprendre les objectifs pédagogiques propres à cette tranche d'âge.	2	t	2025-07-24 19:19:01.987	2025-07-24 19:19:01.987	/badges/2c-spe_F.svg	Branche Flambeaux	2C
cmdhs236a000aw5lguyjkuir8	Qui parmi les Chefs n’est pas animateur ? À tous de lancer un jeu impromptu et de savoir gérer une courbe de veillée. Si l’un d’entre vous se spécialise, c’est pour développer le plaisir de rendre chaque activité ludique, d’avoir un thème de camp léché et de faire du jeu un état d'esprit pour un vivre ensemble tout sauf ennuyeux !	3	t	2025-07-24 19:20:32.147	2025-07-24 19:20:32.147	/badges/2e-spe_animation.svg	Animation	2E
cmdhs45td000kw5lgxnrpb7sf	La communication est le système nerveux du groupe, qu’elle soit interne ou en lien avec les différents partenaires. La bonne utilisation des différents moyens de communication est essentielle pour un groupe. Le numérique a totalement révolutionné ce domaine en quelques années, à toi d'utiliser le potentiel des nouveaux outils au service du groupe et de ses objectifs !	4	t	2025-07-24 19:22:08.881	2025-07-24 19:22:08.881	/badges/2f-spe_communication.svg	Communication	2F
cmdhs5267000uw5lg0zk8zzkx	Vivre dans la nature d'accord, mais pas à n'importe quelle condition ! La maîtrise des nœuds, des outils et des techniques d'assemblage n'est pas une finalité en soi, mais un préalable à une installation opérationnelle voire confortable !	5	t	2025-07-24 19:22:50.815	2025-07-24 19:22:50.815	/badges/2g-spe_construction.svg	Construction	2G
cmdhs69r80014w5lg4q7aqegm	Savoir cuisiner est un art, un devoir lorsqu'on veut défendre la gastronomie française. Alors lorsqu'il s'agit d'officier sur feu de bois quelles que soient les circonstances, cela relève plutôt de l'exploit ! Mais c’est un vrai challenge que de faire de ce moment culinaire un plaisir tout en intégrant les règles d'hygiène, l'équilibre alimentaire et une réflexion éthique sur le contenu de nos assiettes. Bref, à table !	6	t	2025-07-24 19:23:47.3	2025-07-24 19:23:47.3	/badges/2h-spe_cuisine.svg	Cuisine	2H
cmdhs75mx001fw5lgjts2yz3e	Vous vous passionnez pour les cartes, boussoles et signes de piste car chaque voyage est une aventure. Vous maîtrisez donc les techniques d’orientation pour trouver votre chemin, tout comme la sécurité des enfants dans un environnement qu’ils ne connaissent pas. Vous ne leur transmettez pas seulement une autonomie technique, mais aussi une curiosité et un esprit d’initiative dans leur voyage.	7	t	2025-07-24 19:24:28.618	2025-07-24 19:24:28.618	/badges/2i-spe_explo.svg	Exploration	2I
cmdhs8663001pw5lg3dsvkvw9	Le trésorier a une fonction stratégique. Même si la gestion des finances demande un peu de discipline, chacun peut être concerné par ce rôle car nous avons tous à gérer de l'argent à un moment ou à un autre. Il faut pourtant apprendre à décoller le nez d'un tableur et interagir avec l'ensemble de l'équipe pour remplir efficacement sa mission.	1	t	2025-07-24 19:25:15.963	2025-07-24 19:25:15.963	/badges/2j-spe_intendance.svg	Intendance	2J
cmdhs9ly4001zw5lg6jd6k7qd	En tant que responsable matériel, tu es le fournisseur de moyens de ton équipe. Partir en WE, faire un jeu ou préparer la Journée Flambeaux ... quel que soit le programme, si le matériel ne suit pas, difficile d'aller loin. Mais comme souvent, ce sont les finances qui ont le dernier mot ... à moins de faire preuve d'inventivité pour acquérir le matériel nécessaire et de discipline pour l'entretenir et le faire durer.	8	t	2025-07-24 19:26:23.068	2025-07-24 19:26:23.068	/badges/2k-spe_materiel.svg	Matériel	2K
cmdhsak610029w5lgz6wfts58	Apprendre à connaître la nature c'est apprendre à l'aimer et donc à la protéger. Mais aux Flambeaux la nature n'est pas un musée, on y vit ! Elle est l'un des quatre cadres dans lesquels nos activités prennent leur place. C'est aussi une ressource dans laquelle il faut apprendre à puiser de façon raisonnée. A toi de jouer pour que la création continue à mener les jeunes vers le Créateur !	9	t	2025-07-24 19:27:07.417	2025-07-24 19:27:07.417	/badges/2l-spe_nature.svg	Nature	2L
cmdhsbbnz002jw5lgbv3ad3os	En camp ou au cours de l'année, l'assistant sanitaire joue un rôle indispensable dans toute équipe de responsables. Cette spécialité élargit néanmoins leur champ d'action habituel en prenant en compte, en plus des soins, la prévention et l'hygiène corporelle tout en y associant progressivement les jeunes.	10	t	2025-07-24 19:27:43.056	2025-07-24 19:27:43.056	/badges/2m-sante.svg	Santé	2M
cmdhsgd0s002tw5lggq32q8n8	Cercle du Feu, engagement spirituel, échanges personnels ... chaque Chef est concerné par la vie spirituelle du groupe. Mais il peut être intéressant qu'une personne en particulier s'y consacre pour réfléchir, dynamiser, et renouveler les outils et les pratiques.	11	t	2025-07-24 19:31:38.092	2025-07-24 19:31:38.092	/badges/2n-spe_vie_spi.svg	Vie Spirituelle	2N
cmdh7uoxt0001w5z8a1q5tigi	Cette spécialité s'adresse bien entendu aux Chefs de la branche Petits Flambeaux. C'est une étape indispensable pour être Chef de Troupe de cette branche mais elle concerne également tout responsable qui souhaite mieux comprendre les objectifs pédagogiques propres à cette tranche d'âge.	1	t	2025-07-24 09:54:54.786	2025-07-27 20:45:17.627	/badges/2b-spe_PF.svg	Branche Petits Flambeaux	2B
\.


--
-- Data for Name: commentaires; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.commentaires (id, "justificationId", "auteurId", contenu, type, "createdAt") FROM stdin;
\.


--
-- Data for Name: fichiers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fichiers (id, "justificationId", "nomOriginal", "nomStockage", "cheminFichier", type, "mimeType", taille, "createdAt") FROM stdin;
\.


--
-- Data for Name: justifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.justifications (id, "chefId", "objectifId", "badgeId", "activiteDescription", "dateActivite", "dureeHeures", contexte, "nombreJeunes", "trancheAge", niveau, "objectifsAtteints", statut, version, "soumiseAt", "valideeAt", "createdAt", "updatedAt") FROM stdin;
cmfmtghyk000hw5yc2gyydimo	EHANF0wSuUes9radht8bpMCOsF8RFV9o	cmdhs5268000ww5lgcruy5d3q	cmdhs5267000uw5lg0zk8zzkx	Atelier nœuds de 2h avec jeux et défis	2025-08-06 00:00:00	\N	Camp rallye 2025	5-10			c'était cool 	SOUMISE	1	2025-09-16 20:04:04.681	2025-09-16 17:20:11.658	2025-09-16 17:17:59.66	2025-09-16 20:04:04.682
cmfn144dp000tw5ycfxylp0tq	EHANF0wSuUes9radht8bpMCOsF8RFV9o	cmdhs5268000vw5lgsyen5x37	cmdhs5267000uw5lg0zk8zzkx	hfghfgh	\N	\N						SOUMISE	1	2025-09-16 20:57:51.398	\N	2025-09-16 20:52:19.118	2025-09-16 20:57:51.4
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, "destinataireId", "justificationId", type, titre, message, lue, "createdAt", "lueAt") FROM stdin;
cmfmthxdb000lw5ycc4eqmksi	EHANF0wSuUes9radht8bpMCOsF8RFV9o	cmfmtghyk000hw5yc2gyydimo	DEMANDE_PRECISION	Précision demandée sur Construction	Le référent demande une précision sur "objectifsAtteints" pour l'objectif G2	f	2025-09-16 17:19:06.287	\N
cmfmti6si000pw5ycjx0km9qi	EHANF0wSuUes9radht8bpMCOsF8RFV9o	cmfmtghyk000hw5yc2gyydimo	DEMANDE_PRECISION	Précision demandée sur Construction	Le référent demande une précision sur "trancheAge" pour l'objectif G2	f	2025-09-16 17:19:18.499	\N
cmfmtjbtc000rw5ycire5q56k	EHANF0wSuUes9radht8bpMCOsF8RFV9o	cmfmtghyk000hw5yc2gyydimo	JUSTIFICATION_VALIDEE	Justification validée	Votre justification pour Construction a été validée	f	2025-09-16 17:20:11.664	\N
\.


--
-- Data for Name: objectifs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.objectifs (id, "badgeId", code, description, type, "fichiersRequis", "createdAt", "updatedAt") FROM stdin;
cmdh7uoxw0002w5z8gb1qfvtu	cmdh7uoxt0001w5z8a1q5tigi	B1	Acquérir et savoir utiliser le "Guide du Bois" (p. 9 à 11)	COMPETENCE	f	2025-07-24 09:54:54.788	2025-07-24 09:54:54.788
cmdh7uoxw0003w5z8noi73hqs	cmdh7uoxt0001w5z8a1q5tigi	B2	Se repérer dans le carnet et savoir expliquer l'ordre et le principe des différentes parties de chaque volume.	COMPETENCE	f	2025-07-24 09:54:54.788	2025-07-24 09:54:54.788
cmdh7uoxw0004w5z8xpg1e7gv	cmdh7uoxt0001w5z8a1q5tigi	B3	Lire le chapitre "L'enfant à l'âge PF" p.19 du Guide du Bois et animer une discussion avec la maîtrise pour adapter les activités et les attitudes des Chefs.	COMPETENCE	f	2025-07-24 09:54:54.788	2025-07-24 09:54:54.788
cmdh7uoxw0005w5z8hc1h4xu0	cmdh7uoxt0001w5z8a1q5tigi	B4	Observer les jeunes de ta sizaine, noter pour chacun d'eux les domaines dans lesquels il peut progresser (gestion affaires perso, vie de groupe, une des 5 relations ...), proposer des activités en rapport et faire le point à la fin du trimestre.	COMPETENCE	f	2025-07-24 09:54:54.788	2025-07-24 09:54:54.788
cmdh7uoxw0006w5z8y7910u3w	cmdh7uoxt0001w5z8a1q5tigi	B5	Connaître les grandes lignes de l'histoire des ABQS, le rôle des 5 personnages principaux et savoir raconter le départ et l'arrivée au Parc.	COMPETENCE	f	2025-07-24 09:54:54.788	2025-07-24 09:54:54.788
cmdh7uoxw0007w5z8ffl1z060	cmdh7uoxt0001w5z8a1q5tigi	B6	Expliquer aux jeunes le sens des différents rituels (rassemblement, Grand Arbre, Foulard d'Accueil...) et connaître la place des différents marqueurs sur l'uniforme.	COMPETENCE	f	2025-07-24 09:54:54.788	2025-07-24 09:54:54.788
cmdh7uoxw0008w5z8h44hok52	cmdh7uoxt0001w5z8a1q5tigi	B7	Accompagner un ami du Bois dans toute la démarche de la Parole de PF.	COMPETENCE	f	2025-07-24 09:54:54.788	2025-07-24 09:54:54.788
cmdh7uoya0009w5z837pjqgng	cmdh7uoxt0001w5z8a1q5tigi	B8	Concevoir un jeu, un Cercle du Feu et un Grand Arbre en lien avec l'imaginaire des ABQS et réaliser une fiche d'activité pour chacune d'elles en précisant les objectifs, la durée, le matériel nécessaire ...	REALISATION	t	2025-07-24 09:54:54.803	2025-07-24 09:54:54.803
cmdh7uoya000aw5z8o3mr8vha	cmdh7uoxt0001w5z8a1q5tigi	B9	Proposer une ressource pédagogique (autre qu'une fiche d'animation) pour compléter la partie "Bois Tahouti" du "Guide du Bois"	REALISATION	t	2025-07-24 09:54:54.803	2025-07-24 09:54:54.803
cmdhs05mj0001w5lgpgiyxaam	cmdhs05lx0000w5lgci8c97qf	C1	Acquérir, savoir utiliser les ressources pour les jeunes et les Chefs spécifiques de la branche Flambeaux et savoir accompagner les jeunes dans l'utilisation du carnet "Empreintes"	COMPETENCE	f	2025-07-24 19:19:02.012	2025-07-24 19:19:02.012
cmdhs05mj0002w5lgbwpmv4ch	cmdhs05lx0000w5lgci8c97qf	C2	Être capable d'expliquer la notion d'engagement et la Loi Flambeaux et accompagner un jeune tout au long de cette démarche (présentation, engagement, suivi ...)	COMPETENCE	f	2025-07-24 19:19:02.012	2025-07-24 19:19:02.012
cmdhs05mj0003w5lg0y0bis13	cmdhs05lx0000w5lgci8c97qf	C3	Maîtriser le sens et les objectifs des étapes Flambeaux et être capable d'intégrer la progression (Étapes + Brevets) dans les activités du groupe. Veiller à ce que chaque jeune y trouve son compte (niveau, méthode, rythme ...).	COMPETENCE	f	2025-07-24 19:19:02.012	2025-07-24 19:19:02.012
cmdhs05mk0004w5lgqbah5ei4	cmdhs05lx0000w5lgci8c97qf	C4	Connaître le fonctionnement et les objectifs du système de patrouille. Mettre en place le cadre permettant une vie de patrouille. Accompagner la mise en place des PA et des référents de PA avec des temps dédiés. Veiller à la tenue régulière de Conseils de patrouille et en faire le bilan.	COMPETENCE	f	2025-07-24 19:19:02.012	2025-07-24 19:19:02.012
cmdhs05mk0005w5lgkq6od9f4	cmdhs05lx0000w5lgci8c97qf	C5	Accompagner individuellement les membres de la HP dans leurs responsabilités. Organiser 3 CDC au cours de l'année et proposer du contenu spécifique en fonction de leur rôle et de leurs besoins.	COMPETENCE	f	2025-07-24 19:19:02.012	2025-07-24 19:19:02.012
cmdhs05mk0006w5lgoeegs7x9	cmdhs05lx0000w5lgci8c97qf	C6	Suivre individuellement 4 à 6 jeunes de ton groupe, apprendre à les connaître, être capable de les écouter et les conseiller dans leurs choix personnels (PA, brevets ...) et leur cheminement (questionnement, vie spi ...)	COMPETENCE	f	2025-07-24 19:19:02.012	2025-07-24 19:19:02.012
cmdhs05mk0007w5lghc6nk4kz	cmdhs05lx0000w5lgci8c97qf	C7	Connaître et rappeler le sens et l'objectif des différentes traditions (folklore national et de groupe). Encourager et accompagner le développement de l'identité de chaque patrouille (cri, fanion, livre de patrouille ...)	COMPETENCE	f	2025-07-24 19:19:02.012	2025-07-24 19:19:02.012
cmdhs05mw0008w5lgjoe6bkix	cmdhs05lx0000w5lgci8c97qf	C8	Accompagner les projets de patrouille pendant l'année ou le camp (initier les projets, veiller à la démarche, valider la faisabilité, gérer l'intervention des différents référents de PA...)	REALISATION	t	2025-07-24 19:19:02.024	2025-07-24 19:19:02.024
cmdhs05mw0009w5lgxunbsy28	cmdhs05lx0000w5lgci8c97qf	C9	Réaliser une fiche ressource pour les Chefs spécifique à la branche Flambeaux (fiche activité : jeu, CDF ... ou fiche technique : PA, formation HP ...)	REALISATION	t	2025-07-24 19:19:02.024	2025-07-24 19:19:02.024
cmdhs236c000bw5lgtut7hur2	cmdhs236a000aw5lguyjkuir8	E1	Maîtriser les paramètres pour un temps d'animation réussi et organiser un temps d'échange libre en maîtrise pour progresser ensemble dans ce domaine (explications, répartition des jeunes, gestion du temps, préparation du matériel, bilan...)	COMPETENCE	f	2025-07-24 19:20:32.148	2025-07-24 19:20:32.148
cmdhs236c000cw5lg4ea97hbb	cmdhs236a000aw5lguyjkuir8	E2	Connaître les spécificités des différents styles de jeux (nuit/approche, plateau, capture, stratégie, ...) pour pouvoir les adapter aux objectifs pédagogiques d’un temps de progression, de cohésion, d’autonomie ...	COMPETENCE	f	2025-07-24 19:20:32.148	2025-07-24 19:20:32.148
cmdhs236c000dw5lgy473pt2d	cmdhs236a000aw5lguyjkuir8	E3	Transmission aux jeunes : préparer une activité avec des jeunes volontaires ou les PA animation jeunes.	COMPETENCE	f	2025-07-24 19:20:32.148	2025-07-24 19:20:32.148
cmdhs236c000ew5lgxxbfydjo	cmdhs236a000aw5lguyjkuir8	E4	Maîtriser le folklore national et proposer un cadre propre au groupe pour les temps de rassemblement, d’engagement et de valorisation de la progression.	COMPETENCE	f	2025-07-24 19:20:32.148	2025-07-24 19:20:32.148
cmdhs236c000fw5lgzmu43vtl	cmdhs236a000aw5lguyjkuir8	E5	Prendre la responsabilité d’un temps de chant régulier à chaque rencontre.	COMPETENCE	f	2025-07-24 19:20:32.148	2025-07-24 19:20:32.148
cmdhs236c000gw5lghn7hgpym	cmdhs236a000aw5lguyjkuir8	E6	Gérer le matériel pédagogique de la troupe en lien avec le PA matériel (matériel de jeu, bricolage ...)	COMPETENCE	f	2025-07-24 19:20:32.148	2025-07-24 19:20:32.148
cmdhs236c000hw5lgrmksjxf0	cmdhs236a000aw5lguyjkuir8	E7	Avoir validé le BAFA	COMPETENCE	f	2025-07-24 19:20:32.148	2025-07-24 19:20:32.148
cmdhs236d000iw5lgfm4dt9lg	cmdhs236a000aw5lguyjkuir8	E8	Être chargé de l’imaginaire de groupe ou de camp, le faire vivre et le décliner dans les différents temps (repas, jeux, vie quotidienne ...) en fonction du cadre défini en équipe.	REALISATION	t	2025-07-24 19:20:32.15	2025-07-24 19:20:32.15
cmdhs236d000jw5lgt5ew4ure	cmdhs236a000aw5lguyjkuir8	E9	Inventer un jeu, et l'utiliser à plusieurs reprises en tenant compte des retours des jeunes et des Chefs pour l'améliorer progressivement. Réaliser une fiche qui reprend la démarche et l'évolution du jeu pour pouvoir la présenter lors d'un temps de formation.	REALISATION	t	2025-07-24 19:20:32.15	2025-07-24 19:20:32.15
cmdhs45te000lw5lg4vg9zc59	cmdhs45td000kw5lgxnrpb7sf	F1	Savoir communiquer de manière pertinente avec les jeunes en fonction de leur âge (consignes claires, informations qui vont droit au but, contenu et objectif d'une activité ...).	COMPETENCE	f	2025-07-24 19:22:08.882	2025-07-24 19:22:08.882
cmdhs45te000mw5lgip7nkbww	cmdhs45td000kw5lgxnrpb7sf	F2	Mettre en place et coordonner un temps d'échange et de prière régulier avec la maîtrise pour faire le point sur le vécu de l'équipe du groupe et des jeunes.	COMPETENCE	f	2025-07-24 19:22:08.882	2025-07-24 19:22:08.882
cmdhs45te000nw5lgux6i1gyy	cmdhs45td000kw5lgxnrpb7sf	F3	Veiller à l'information des partenaires (Église(s), partenaires locaux, Mouvement ..) en adaptant les moyens au message à faire passer tout en respectant la charte graphique du Mouvement.	COMPETENCE	f	2025-07-24 19:22:08.882	2025-07-24 19:22:08.882
cmdhs45te000ow5lgml4y342w	cmdhs45td000kw5lgxnrpb7sf	F4	Garder un lien avec les parents par différents moyens (réunion de rentrée, nouvelles par mail, réponse aux questions ...) en ayant conscience des enjeux (précautions/transparence ...).	COMPETENCE	f	2025-07-24 19:22:08.882	2025-07-24 19:22:08.882
cmdhs45te000pw5lgl4qj52hb	cmdhs45td000kw5lgxnrpb7sf	F5	Encourager la prise de photos régulières et l'utilisation des nouvelles technologies pour communiquer sur les activités du groupe tout en veillant au respect du droit à l'image (autorisation parentale) et à la protection des données personnelles.	COMPETENCE	f	2025-07-24 19:22:08.882	2025-07-24 19:22:08.882
cmdhs45te000qw5lgse83xq2t	cmdhs45td000kw5lgxnrpb7sf	F6	Connaître le bon usage (net étiquette, réactivité ...) et les limites de la communication par courriel.	COMPETENCE	f	2025-07-24 19:22:08.882	2025-07-24 19:22:08.882
cmdhs45te000rw5lgx8usua2i	cmdhs45td000kw5lgxnrpb7sf	F7	Savoir diriger une réunion d'équipe (permettre à chacun de s'exprimer, favoriser l'écoute réciproque, faire ressortir les idées importantes, ...) et savoir rédiger un compte-rendu fidèle et synthétique.	COMPETENCE	f	2025-07-24 19:22:08.882	2025-07-24 19:22:08.882
cmdhs45tf000sw5lg2x1435x1	cmdhs45td000kw5lgxnrpb7sf	F8	Intervenir dans la préparation et l’animation d’un évènement lié à la promotion du groupe ou du Mouvement : Journée Nationale du Mouvement, stand Flambeaux lors d'un événement (Journée des associations ...)	REALISATION	t	2025-07-24 19:22:08.884	2025-07-24 19:22:08.884
cmdhs45tf000tw5lgfki2aumm	cmdhs45td000kw5lgxnrpb7sf	F9	Développer un outil de communication (clip vidéo, blog ou site web, prospectus ...) au profit des Flambeaux (groupe local, événement régional ou national ...). Réaliser et faire valider son travail en lien avec un professionnel de la communication.	REALISATION	t	2025-07-24 19:22:08.884	2025-07-24 19:22:08.884
cmdhs5268000vw5lgsyen5x37	cmdhs5267000uw5lg0zk8zzkx	G1	Maîtriser l'utilisation des outils de ta troupe, connaître leur utilité et leur entretien et organiser un atelier de formation mettant en avant la sécurité. (Cf. capacité "Port de hache" pour les Flambeaux)	COMPETENCE	f	2025-07-24 19:22:50.816	2025-07-24 19:22:50.816
cmdhs5268000ww5lgcruy5d3q	cmdhs5267000uw5lg0zk8zzkx	G2	Organiser une activité autour de l'apprentissage des nœuds avec les jeunes en faisant la démonstration de leur utilité.	COMPETENCE	f	2025-07-24 19:22:50.816	2025-07-24 19:22:50.816
cmdhs5268000xw5lgjs7126sh	cmdhs5267000uw5lg0zk8zzkx	G3	Maîtriser les techniques d'assemblage (brêlage, froissartage ...) et les notions assurant la solidité des installations (diamètres, triangles, jambe de force ...) et transmettre les bases à l'ensemble de la maîtrise.	COMPETENCE	f	2025-07-24 19:22:50.816	2025-07-24 19:22:50.816
cmdhs5268000yw5lgo7v8598v	cmdhs5267000uw5lg0zk8zzkx	G4	Utiliser de manière responsable les ressources naturelles pour les constructions (privilégier les constructions économes en bois, utiliser au maximum le bois mort, recycler le bois plutôt que de le brûler à la fin ...)	COMPETENCE	f	2025-07-24 19:22:50.816	2025-07-24 19:22:50.816
cmdhs5268000zw5lgmudc1obh	cmdhs5267000uw5lg0zk8zzkx	G5	Savoir tendre rapidement une bâche et prévoir le matériel nécessaire pour se protéger des intempéries lors des sorties.	COMPETENCE	f	2025-07-24 19:22:50.816	2025-07-24 19:22:50.816
cmdhs52680010w5lg589tb73p	cmdhs5267000uw5lg0zk8zzkx	G6	Accompagner les jeunes dans les différentes étapes (plans, choix du lieu, réalisation, entretien ...) de la réalisation de leur construction d'équipe (cabane de sizaine, coin pat ...)	COMPETENCE	f	2025-07-24 19:22:50.816	2025-07-24 19:22:50.816
cmdhs52680011w5lgq6r7mgbt	cmdhs5267000uw5lg0zk8zzkx	G7	Lors de l'installation d'un camp, connaître tous les paramètres et la façon de les prendre en compte.	COMPETENCE	f	2025-07-24 19:22:50.816	2025-07-24 19:22:50.816
cmdhs52690012w5lge1c7c3wk	cmdhs5267000uw5lg0zk8zzkx	G8	Participer activement à l'installation d'un camp en procédant à un repérage du lieu en amont, en réalisant un plan détaillé (campement, constructions, sanitaires ...) et en coordonnant les constructions collectives.	REALISATION	t	2025-07-24 19:22:50.817	2025-07-24 19:22:50.817
cmdhs52690013w5lgp1iz36mx	cmdhs5267000uw5lg0zk8zzkx	G9	Concevoir le plan et réaliser une installation collective originale de camp en utilisant les différentes techniques apprises (2 brêlages différents, 2 techniques de froissartage différentes ...)	REALISATION	t	2025-07-24 19:22:50.817	2025-07-24 19:22:50.817
cmdhs69r90015w5lg6ym8l83j	cmdhs69r80014w5lg4q7aqegm	H1	Réaliser un carnet de 30 recettes avec : 10 plats adaptés au plein air, 5 plats élaborés mais rapidement réalisables, 5 recettes trappeurs, 5 desserts réalisables en extérieur (au moins un avec cuisson), 5 salades composées.	COMPETENCE	f	2025-07-24 19:23:47.302	2025-07-24 19:23:47.302
cmdhs69r90016w5lge5oouteu	cmdhs69r80014w5lg4q7aqegm	H2	Veiller au respect des règles de base de l'hygiène en cuisine et mettre en place deux actions de sensibilisation pour les Chefs (ateliers, formation, jeu ...).	COMPETENCE	f	2025-07-24 19:23:47.302	2025-07-24 19:23:47.302
cmdhs69r90017w5lgdsijeygu	cmdhs69r80014w5lg4q7aqegm	H3	Accompagner les jeunes dans la transmission d’une nouvelle technique de cuisine.	COMPETENCE	f	2025-07-24 19:23:47.302	2025-07-24 19:23:47.302
cmdhs69r90018w5lgqczc9bp0	cmdhs69r80014w5lg4q7aqegm	H4	Être responsable de la disponibilité et de l’état du matériel de cuisine en fonction des besoins en lien avec le responsable matériel de ta troupe.	COMPETENCE	f	2025-07-24 19:23:47.302	2025-07-24 19:23:47.302
cmdhs69r90019w5lg0voyo0jr	cmdhs69r80014w5lg4q7aqegm	H5	Connaître les portions théoriques individuelles et savoir les adapter en fonction du public et du contexte (âge, météo, activité, cadre ...).	COMPETENCE	f	2025-07-24 19:23:47.302	2025-07-24 19:23:47.302
cmdhs69r9001aw5lgda8bvpdd	cmdhs69r80014w5lg4q7aqegm	H6	Établir des menus équilibrés et adaptés aux différents temps et contraintes de la journée (midi, soir, durée de préparation, ...) et savoir gérer les régimes alimentaires spécifiques (allergies alimentaires, convictions ...).	COMPETENCE	f	2025-07-24 19:23:47.302	2025-07-24 19:23:47.302
cmdhs69r9001bw5lgo1fn0389	cmdhs69r80014w5lg4q7aqegm	H7	Savoir inclure une réflexion éthique dans l'élaboration des menus : utiliser des légumes de saison, privilégier les circuits courts, optimiser les quantités, limiter les plats avec viandes pour privilégier la qualité et mettre en place un compost.	COMPETENCE	f	2025-07-24 19:23:47.302	2025-07-24 19:23:47.302
cmdhs69ra001cw5lge78nyg9c	cmdhs69r80014w5lg4q7aqegm	H8	Lors d’un WE ou d’un camp, gérer l'installation de la cuisine et optimiser son agencement en lien avec l’équipe cuisine et le PA construction.	REALISATION	t	2025-07-24 19:23:47.303	2025-07-24 19:23:47.303
cmdhs69ra001dw5lgs4bat5ny	cmdhs69r80014w5lg4q7aqegm	H9	Réaliser un menu complet pour un évènement particulier (WE de troupe/groupe, gala, fête de Noël, repas avec les parents, ...) et préparer le repas avec l’aide des jeunes.	REALISATION	t	2025-07-24 19:23:47.303	2025-07-24 19:23:47.303
cmdhs69rb001ew5lgq54vlg7i	cmdhs69r80014w5lg4q7aqegm	H10	Organiser un concours cuisine de A à Z (constitution des équipes, critères d’évaluation, règles : panier imposé, budget imposé, thème ..., animation, prix ...).	REALISATION	t	2025-07-24 19:23:47.303	2025-07-24 19:23:47.303
cmdhs75mz001gw5lgrhpq52uz	cmdhs75mx001fw5lgjts2yz3e	I1	Savoir créer un itinéraire de randonnée et adapter la difficulté en fonction du niveau des jeunes, de la durée, de la distance, du dénivelé, de la météo, ...	COMPETENCE	f	2025-07-24 19:24:28.62	2025-07-24 19:24:28.62
cmdhs75mz001hw5lgtshs3j45	cmdhs75mx001fw5lgjts2yz3e	I2	Maîtriser la lecture de cartes de randonnée (légendes, codes couleurs, dénivelés remarquables, savoir "lire" le paysage en 3D, ...).	COMPETENCE	f	2025-07-24 19:24:28.62	2025-07-24 19:24:28.62
cmdhs75mz001iw5lg954mcojn	cmdhs75mx001fw5lgjts2yz3e	I3	Savoir s'orienter avec une boussole à visée, savoir utiliser les azimuts et connaître d’autres techniques d’orientation (signes de piste, Nord sans boussole, Gilwell, Topo express, ...).	COMPETENCE	f	2025-07-24 19:24:28.62	2025-07-24 19:24:28.62
cmdhs75mz001jw5lgcpqs83an	cmdhs75mx001fw5lgjts2yz3e	I4	Connaître et faire appliquer la réglementation et les consignes de sécurité : code de la route et déplacements en groupes, prévisions météo et conduite à tenir, moyenne montagne, autonomie, trousse de secours...	COMPETENCE	f	2025-07-24 19:24:28.62	2025-07-24 19:24:28.62
cmdhs75mz001kw5lgj17icja5	cmdhs75mx001fw5lgjts2yz3e	I5	Être capable d'organiser rapidement un bivouac à un endroit autorisé et de monter un abri en bâche en respectant les paramètres d'installation d'un campement.	COMPETENCE	f	2025-07-24 19:24:28.62	2025-07-24 19:24:28.62
cmdhs75mz001lw5lgv6pcmvsu	cmdhs75mx001fw5lgjts2yz3e	I6	Présenter une exploration et organiser la répartition des groupes de façon attractive et ludique pour amener chaque jeune à prendre goût à l'effort et à se dépasser.	COMPETENCE	f	2025-07-24 19:24:28.62	2025-07-24 19:24:28.62
cmdhs75mz001mw5lgzonean5q	cmdhs75mx001fw5lgjts2yz3e	I7	Développer une spécialité autour de la randonnée : rando sportive, course d'orientation, immersion, découverte du milieu naturel ...	COMPETENCE	f	2025-07-24 19:24:28.62	2025-07-24 19:24:28.62
cmdhs75n2001nw5lg43x4kcej	cmdhs75mx001fw5lgjts2yz3e	I8	Préparer et réaliser une activité d’orientation impliquant la manipulation de carte et boussole.	REALISATION	t	2025-07-24 19:24:28.623	2025-07-24 19:24:28.623
cmdhs75n2001ow5lg8i52illt	cmdhs75mx001fw5lgjts2yz3e	I9	Concevoir avec les jeunes un projet de randonnée (sur 2 jours avec hébergement et repas) dont ils définissent les objectifs et les modalités. Le projet doit avoir une dimension sportive, technique, ludique ou environnementale.	REALISATION	t	2025-07-24 19:24:28.623	2025-07-24 19:24:28.623
cmdhs8664001qw5lge1ig1ean	cmdhs8663001pw5lg3dsvkvw9	J1	Établir le budget d'un WE en anticipant un maximum les recettes et les dépenses et savoir calculer un prix de journée alimentaire.	COMPETENCE	f	2025-07-24 19:25:15.964	2025-07-24 19:25:15.964
cmdhs8664001rw5lgdrye8dgn	cmdhs8663001pw5lg3dsvkvw9	J2	Être responsable de la caisse du groupe ou du camp et tenir le tableau (opérations) et le cahier (justificatifs) de comptabilité de la troupe à jour.	COMPETENCE	f	2025-07-24 19:25:15.964	2025-07-24 19:25:15.964
cmdhs8664001sw5lgil41tthk	cmdhs8663001pw5lg3dsvkvw9	J3	Collecter les inscriptions et les cotisations des jeunes, établir des reçus le cas échéant et tenir le registre de présence des jeunes à jour.	COMPETENCE	f	2025-07-24 19:25:15.964	2025-07-24 19:25:15.964
cmdhs8664001tw5lgpt4rhiij	cmdhs8663001pw5lg3dsvkvw9	J4	Gérer le stock alimentaire du groupe (dates de péremption, relevé des températures du réfrigérateur ...).	COMPETENCE	f	2025-07-24 19:25:15.964	2025-07-24 19:25:15.964
cmdhs8664001uw5lgrsl9vt7w	cmdhs8663001pw5lg3dsvkvw9	J5	Accompagner les jeunes dans l'établissement d'une liste de courses à partir d'un menu, dans le choix des lieux d'approvisionnement et dans le respect de la chaîne du froid.	COMPETENCE	f	2025-07-24 19:25:15.964	2025-07-24 19:25:15.964
cmdhs8664001vw5lghude2ho2	cmdhs8663001pw5lg3dsvkvw9	J6	Définir un plan de financement pour un investissement du groupe et suivre sa réalisation jusqu'à l'achat.	COMPETENCE	f	2025-07-24 19:25:15.964	2025-07-24 19:25:15.964
cmdhs8664001ww5lgax9elwbg	cmdhs8663001pw5lg3dsvkvw9	J7	Mettre en place un fonctionnement permettant de prendre en compte les familles qui ont peu de ressources financières en y associant les différents partenaires (parents, groupe, église, assistance sociale ...).	COMPETENCE	f	2025-07-24 19:25:15.964	2025-07-24 19:25:15.964
cmdhs8665001xw5lgfurp502e	cmdhs8663001pw5lg3dsvkvw9	J8	Assurer la fonction de trésorier pendant l'année ou un camp, depuis le budget jusqu'au bilan en passant par les achats.	REALISATION	t	2025-07-24 19:25:15.966	2025-07-24 19:25:15.966
cmdhs8665001yw5lgoqscvi4s	cmdhs8663001pw5lg3dsvkvw9	J9	Coordonner une opération de collecte de fonds (choix du projet, communication, organisation de la collecte, bilan ...) au profit d’un projet du groupe ou de soutien d’une œuvre sociale.	REALISATION	t	2025-07-24 19:25:15.966	2025-07-24 19:25:15.966
cmdhs9ly50020w5lg8mccv0ix	cmdhs9ly4001zw5lg6jd6k7qd	K1	Réaliser un inventaire complet du matériel à disposition et de son état. Faire le tri, marquer le matériel, faire la liste de ce qui doit être réparé, remplacé.	COMPETENCE	f	2025-07-24 19:26:23.069	2025-07-24 19:26:23.069
cmdhs9ly50021w5lgrvv061z9	cmdhs9ly4001zw5lg6jd6k7qd	K2	Avec l'ensemble de l'équipe, faire la liste du matériel à acheter et définir les priorités avec l'intendant en fonction des moyens. Connaître les nouveautés et être une force de proposition en matière d'investissement.	COMPETENCE	f	2025-07-24 19:26:23.069	2025-07-24 19:26:23.069
cmdhs9ly50022w5lg9u8h2i2z	cmdhs9ly4001zw5lg6jd6k7qd	K3	Organiser un stockage fonctionnel du matériel (rangement par catégorie, identification du contenu ...) permettant une utilisation facile et sécurisée.	COMPETENCE	f	2025-07-24 19:26:23.069	2025-07-24 19:26:23.069
cmdhs9ly50023w5lgyvlhikba	cmdhs9ly4001zw5lg6jd6k7qd	K4	Connaître les bases de l'entretien du matériel et des outils (huilage outils, séchage tentes ...).	COMPETENCE	f	2025-07-24 19:26:23.069	2025-07-24 19:26:23.069
cmdhs9ly50024w5lgmmmjjsfg	cmdhs9ly4001zw5lg6jd6k7qd	K5	Réfléchir et mettre en œuvre des alternatives à l'achat de matériel neuf pour développer une attitude responsable et réaliser des économies : achat d'occasion, marchés aux puces, réparation du matériel abîmé, mise à disposition, location ...	COMPETENCE	f	2025-07-24 19:26:23.069	2025-07-24 19:26:23.069
cmdhs9ly50025w5lg77hxu5q4	cmdhs9ly4001zw5lg6jd6k7qd	K6	Savoir évaluer le volume et la masse du matériel et maîtriser les contraintes du chargement et du transport du matériel (limites réglementaires, équilibre des charges, protection du matériel sensible ...).	COMPETENCE	f	2025-07-24 19:26:23.069	2025-07-24 19:26:23.069
cmdhs9ly50026w5lglfdsryf7	cmdhs9ly4001zw5lg6jd6k7qd	K7	Réaliser une liste de fournitures et de consommables (ficelle, bâche, recharge gaz ...) en indiquant leur prix moyen ainsi que l'enseigne la plus proche.	COMPETENCE	f	2025-07-24 19:26:23.069	2025-07-24 19:26:23.069
cmdhs9ly70027w5lg55unrabq	cmdhs9ly4001zw5lg6jd6k7qd	K8	Réaliser une installation permettant d'optimiser le rangement et/ou la mise à disposition du matériel du groupe ou du camp (étagères, caisse, coffre-banc, porte-outils ...).	REALISATION	t	2025-07-24 19:26:23.071	2025-07-24 19:26:23.071
cmdhs9ly70028w5lgapvpv97t	cmdhs9ly4001zw5lg6jd6k7qd	K9	En lien avec les jeunes, identifier un besoin (malle de patrouille, malle d'activité, malle de jeux ...), définir le contenu type ainsi que les règles d'utilisation pour un fonctionnement autonome, assurer le suivi pendant l'année ou le camp et réaliser l'inventaire à la fin.	REALISATION	t	2025-07-24 19:26:23.071	2025-07-24 19:26:23.071
cmdhsak62002aw5lgo3v6qnoc	cmdhsak610029w5lgz6wfts58	L1	Réaliser un jeu à postes permettant de développer les connaissances des jeunes sur la nature environnante (faune, flore, minéraux ...) et réévaluer les connaissances à différents moments.	COMPETENCE	f	2025-07-24 19:27:07.419	2025-07-24 19:27:07.419
cmdhsak62002bw5lgdqczuf4k	cmdhsak610029w5lgz6wfts58	L2	Reconnaître 5 formations nuageuses et savoir interpréter différents signes naturels pour anticiper les événements météorologiques.	COMPETENCE	f	2025-07-24 19:27:07.419	2025-07-24 19:27:07.419
cmdhsak62002cw5lgech9boh0	cmdhsak610029w5lgz6wfts58	L3	Savoir aménager son campement, les installations et le coin du feu en respectant les lieux et leurs occupants (le moins d'impact) et ne pas laisser de traces à son départ.	COMPETENCE	f	2025-07-24 19:27:07.419	2025-07-24 19:27:07.419
cmdhsak62002dw5lghssls807	cmdhsak610029w5lgz6wfts58	L4	Connaître différents indicateurs d'impact (bilan carbone, quantité d'eau nécessaire ...) et sensibiliser le groupe au développement de comportements éco-responsables en terme de déplacement, d'achat, de recyclage ... par la rédaction d'une charte, la définition d'objectifs ...	COMPETENCE	f	2025-07-24 19:27:07.419	2025-07-24 19:27:07.419
cmdhsak62002ew5lgm86dx8he	cmdhsak610029w5lgz6wfts58	L5	Organiser une sortie avec un naturaliste ou un forestier pour découvrir la richesse d'un écosystème, sa fragilité et les défis à relever pour le préserver.	COMPETENCE	f	2025-07-24 19:27:07.419	2025-07-24 19:27:07.419
cmdhsak62002fw5lgm17qfpf6	cmdhsak610029w5lgz6wfts58	L6	Organiser avec les jeunes la réalisation d'un objet utile ou décoratif à partir d'éléments naturels (instrument, couronne de l'avent, ustensile taillés dans le bois ...).	COMPETENCE	f	2025-07-24 19:27:07.419	2025-07-24 19:27:07.419
cmdhsak62002gw5lg9dskgnxd	cmdhsak610029w5lgz6wfts58	L7	Développer une connaissance approfondie dans un domaine particulier (insectes, arbres, champignons, minéraux ...) ou une compétence particulière en lien avec la nature.	COMPETENCE	f	2025-07-24 19:27:07.419	2025-07-24 19:27:07.419
cmdhsak64002hw5lg8wcefs5j	cmdhsak610029w5lgz6wfts58	L8	Réaliser un carnet qui permet d'identifier les éléments naturels disponibles ayant une utilisation pratique (essences de bois spécifique pour avoir des flammes, de la chaleur, qui dure ; champignons, baies, racines et plantes comestibles ; autres éléments naturels utiles : répulsifs, pour soigner ...).	REALISATION	t	2025-07-24 19:27:07.42	2025-07-24 19:27:07.42
cmdhsak64002iw5lg254nnsl6	cmdhsak610029w5lgz6wfts58	L9	Accompagner les jeunes dans la réalisation d'une action en faveur de la nature (nettoyage d'un terrain ou d'une berge, réalisation d'un nichoir, d'une mangeoire ou d'un hôtel à insectes ...) en sensibilisant les jeunes aux conséquences des choix humains sur la nature.	REALISATION	t	2025-07-24 19:27:07.42	2025-07-24 19:27:07.42
cmdhsbbo0002kw5lghs8cxngi	cmdhsbbnz002jw5lgbv3ad3os	M1	Connaître le contenu type d'une trousse de secours, savoir expliquer l'utilité et l'utilisation de chaque élément la composant et impliquer les jeunes dans la préparation et l'utilisation de la trousse de secours pour une sortie.	COMPETENCE	f	2025-07-24 19:27:43.057	2025-07-24 19:27:43.057
cmdhsbbo0002lw5lgs3unqudq	cmdhsbbnz002jw5lgbv3ad3os	M2	Savoir prodiguer les soins de base (coupure/plaie, brûlure, tique, coup de chaud, ampoule, contusion ...).	COMPETENCE	f	2025-07-24 19:27:43.057	2025-07-24 19:27:43.057
cmdhsbbo1002mw5lgn9536w1q	cmdhsbbnz002jw5lgbv3ad3os	M3	Savoir évaluer la gravité d'une situation et agir en conséquence tout en connaissant ses limites. Sensibiliser le groupe à trois situations précises pour lesquelles il faut faire appel à l'aide extérieure (assistant sanitaire, directeur, médecin, urgences ...).	COMPETENCE	f	2025-07-24 19:27:43.057	2025-07-24 19:27:43.057
cmdhsbbo1002nw5lgdnn7tbu1	cmdhsbbnz002jw5lgbv3ad3os	M4	Connaître et mettre à jour les affichages obligatoires en accueil de mineurs (numéros d'urgence, prévention, interdiction de fumer, consignes lavage des mains ...).	COMPETENCE	f	2025-07-24 19:27:43.057	2025-07-24 19:27:43.057
cmdhsbbo1002ow5lgy044xpjw	cmdhsbbnz002jw5lgbv3ad3os	M5	Veiller aux moyens et à la mise en œuvre des actions de prévention (casquette et boisson régulière, utilisation correcte des outils, lavage des mains, javellisation des jerricans ...).	COMPETENCE	f	2025-07-24 19:27:43.057	2025-07-24 19:27:43.057
cmdhsbbo1002pw5lgbc7jyyd1	cmdhsbbnz002jw5lgbv3ad3os	M6	Avec un(e) Chef/taine de l'autre sexe, organiser et veiller au bon déroulement du temps de douche (que tout le monde se douche, respect de l'intimité, séchage des serviettes ...) et du brossage quotidien des dents.	COMPETENCE	f	2025-07-24 19:27:43.057	2025-07-24 19:27:43.057
cmdhsbbo1002qw5lgovvrs6nu	cmdhsbbnz002jw5lgbv3ad3os	M7	Encourager le rangement des affaires personnelles en organisant une inspection des tentes en binôme avec un Chef/taine de l'autre sexe. Veiller au tri des affaires sales/propres (quantité suffisante ?), des habits humides/secs et au stock de sucreries.	COMPETENCE	f	2025-07-24 19:27:43.057	2025-07-24 19:27:43.057
cmdhsbbo2002rw5lg0igpojnu	cmdhsbbnz002jw5lgbv3ad3os	M8	Assurer la fonction d'assistant sanitaire pendant l'année ou le camp, en veillant au contenu et la mise à jour du matériel, en assurant les soins de base, la distribution des médicaments sur prescription et en organisant le fonctionnement de l'infirmerie.	REALISATION	t	2025-07-24 19:27:43.058	2025-07-24 19:27:43.058
cmdhsbbo2002sw5lgov4783p9	cmdhsbbnz002jw5lgbv3ad3os	M9	Mettre en place une action de sensibilisation à l'hygiène corporelle et une action de prévention aux accidents (identifier les besoins, organiser les actions, réaliser une fiche de prévention, en faire le bilan en mesurant l'impact ...).	REALISATION	t	2025-07-24 19:27:43.058	2025-07-24 19:27:43.058
cmdhsgd0t002uw5lgjxh9b7l5	cmdhsgd0s002tw5lggq32q8n8	N1	Etre capable de faire des canevas de Cercles du Feu et de méditations personnelles.	COMPETENCE	f	2025-07-24 19:31:38.094	2025-07-24 19:31:38.094
cmdhsgd0t002vw5lg03xopten	cmdhsgd0s002tw5lggq32q8n8	N2	Lister les outils et les ressources permettant aux Chefs de renouveler les Cercle du Feu : discussion sur un sujet qui touche la troupe ...	COMPETENCE	f	2025-07-24 19:31:38.094	2025-07-24 19:31:38.094
cmdhsgd0t002ww5lgwqak0pda	cmdhsgd0s002tw5lggq32q8n8	N3	Encourager la prise d’initiative des jeunes dans l’expression de leur foi en les accompagnant dans leur démarche (CDF par un jeunes, témoignage, musique, choix des chants ...).	COMPETENCE	f	2025-07-24 19:31:38.094	2025-07-24 19:31:38.094
cmdhsgd0t002xw5lgoh4eui2m	cmdhsgd0s002tw5lggq32q8n8	N4	Être capable de conduire d’autres formes de temps spi: culte Flambeaux, Veillée spi, temps d'engagement et/ou de témoignage ...	COMPETENCE	f	2025-07-24 19:31:38.094	2025-07-24 19:31:38.094
cmdhsgd0t002yw5lg9yewuhaz	cmdhsgd0s002tw5lggq32q8n8	N5	Veiller à laisser à chaque jeune un espace pour grandir spirituellement tout en forgeant ses propres convictions. Sensibiliser les Chefs aux attitudes de manipulation.	COMPETENCE	f	2025-07-24 19:31:38.094	2025-07-24 19:31:38.094
cmdhsgd0t002zw5lgapulpkdk	cmdhsgd0s002tw5lggq32q8n8	N6	Mettre en place une action régulière pour sensibiliser l’Eglise et/ou les Amis Flambeaux aux défis spi du groupe.	COMPETENCE	f	2025-07-24 19:31:38.094	2025-07-24 19:31:38.094
cmdhsgd0t0030w5lgbr0skl6d	cmdhsgd0s002tw5lggq32q8n8	N7	Mettre en œuvre deux actions pour encourager les Chefs à mettre en place un suivi personnalisé de chaque jeune.	COMPETENCE	f	2025-07-24 19:31:38.094	2025-07-24 19:31:38.094
cmdhsgd0w0031w5lg3mvogg5x	cmdhsgd0s002tw5lggq32q8n8	N8	Organiser un cycle cohérent de Cercle du Feu sur un camp ou un trimestre à partir d'un thème ou d'un fil rouge.	REALISATION	t	2025-07-24 19:31:38.096	2025-07-24 19:31:38.096
cmdhsgd0w0032w5lgkel08god	cmdhsgd0s002tw5lggq32q8n8	N9	Mettre en place un parrainage spi des Chefs par l'Eglise.	REALISATION	t	2025-07-24 19:31:38.096	2025-07-24 19:31:38.096
cmdhsgd0w0033w5lghtggs6a2	cmdhsgd0s002tw5lggq32q8n8	N10	Monter une journée d'action dans la ville (témoignage par les actes).	REALISATION	t	2025-07-24 19:31:38.096	2025-07-24 19:31:38.096
\.


--
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.session (id, "expiresAt", token, "createdAt", "updatedAt", "ipAddress", "userAgent", "userId") FROM stdin;
kulWSS9hYiGXrAjKK9TAeDQmAakX8LaE	2025-09-23 17:06:55.778	nPt2vrzv2vGtUDySWCnDK4zmwBw4fAmd	2025-09-16 17:06:55.779	2025-09-16 17:06:55.779		Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36	EHANF0wSuUes9radht8bpMCOsF8RFV9o
9B6cUcMGV6rVhTLO2M3oPj31CNfC49S4	2025-09-25 09:25:12.063	r6a2sKX4Ljy9s8aiXT3c7rnlo8cyJiJU	2025-09-18 09:25:12.063	2025-09-18 09:25:12.063		Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36	EHANF0wSuUes9radht8bpMCOsF8RFV9o
TX6GsxVlyva6msy82yKjF8pIRuGSl27L	2025-07-31 16:09:46.266	ii0Yedym0d8M9HcgM9Svz7ypKlgONdBf	2025-07-24 16:09:46.267	2025-07-24 16:09:46.267		Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36	EHANF0wSuUes9radht8bpMCOsF8RFV9o
5ooujbgDAKYDrCEwcXrxJeF48QLlbEku	2025-08-02 17:04:44.997	RODTfsueVy8ife6GylgBzMhIkPqbNi5F	2025-07-26 17:04:44.997	2025-07-26 17:04:44.997		Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36	EHANF0wSuUes9radht8bpMCOsF8RFV9o
pogIeFXcQJj8eM0N0ECxpZ5SKxN0uhrw	2025-08-05 20:42:01.432	vGFoNc2wUwWY47NmVWGawIWvhcBICVxN	2025-07-29 20:42:01.433	2025-07-29 20:42:01.433		Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36	EHANF0wSuUes9radht8bpMCOsF8RFV9o
KmF9HOIGzCGxTd2mT3iptopTRfQxsWWR	2025-08-06 20:44:19.195	uj95dDKynmpzxnT39AOnZOTbhjgkw9uL	2025-07-27 17:05:23.429	2025-07-30 20:44:19.195		Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36	EHANF0wSuUes9radht8bpMCOsF8RFV9o
PFeBfFm0tqlBaC0XHt32koTl2nSRR5hB	2025-09-09 15:53:05.919	2iqi8vJqahQ5Wxf1Hn7aGaHAO4lQQOsh	2025-09-02 15:53:05.919	2025-09-02 15:53:05.919		Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36	EHANF0wSuUes9radht8bpMCOsF8RFV9o
7g6YFKhkpTuvqyC7VhsvKlKI5W09p6vx	2025-09-09 16:21:01.691	44BP8fEb6BlviDxlFdFPdWbHVV6vJdPN	2025-09-02 16:21:01.691	2025-09-02 16:21:01.691		Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36	EHANF0wSuUes9radht8bpMCOsF8RFV9o
bKdJZM2fiBfzYlohZ2t2ylUHR57PHE6U	2025-09-10 19:45:28.06	WJgbb68KEBkm6Qov8mwEjzraULeOWeUd	2025-09-03 19:45:28.06	2025-09-03 19:45:28.06		Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36	EHANF0wSuUes9radht8bpMCOsF8RFV9o
4v8WFScTPjvIUU1nEVIsX66nvvbpmpVo	2025-09-15 19:58:08.362	c62P0J1kw1wVdZ2UDfZwi2FImCBTS7k7	2025-09-08 19:58:08.362	2025-09-08 19:58:08.362		Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36	EHANF0wSuUes9radht8bpMCOsF8RFV9o
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, name, image, role, "createdAt", "updatedAt", "emailVerified") FROM stdin;
EHANF0wSuUes9radht8bpMCOsF8RFV9o	hegetimothe@gmail.com	Timothé Hege	\N	ADMIN	2025-07-15 14:35:54.554	2025-07-22 18:05:24.115	f
ltYJhwsP2efowDQRL0MZeXBvHNqMUYDi	cerf@gmail.com	cerf cerf	\N	REFERENT	2025-09-16 17:15:38.164	2025-09-16 17:16:13.981	f
\.


--
-- Data for Name: verification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.verification (id, identifier, value, "expiresAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: account account_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_pkey PRIMARY KEY (id);


--
-- Name: badge_referents badge_referents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.badge_referents
    ADD CONSTRAINT badge_referents_pkey PRIMARY KEY (id);


--
-- Name: badges badges_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.badges
    ADD CONSTRAINT badges_pkey PRIMARY KEY (id);


--
-- Name: commentaires commentaires_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.commentaires
    ADD CONSTRAINT commentaires_pkey PRIMARY KEY (id);


--
-- Name: fichiers fichiers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fichiers
    ADD CONSTRAINT fichiers_pkey PRIMARY KEY (id);


--
-- Name: justifications justifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.justifications
    ADD CONSTRAINT justifications_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: objectifs objectifs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.objectifs
    ADD CONSTRAINT objectifs_pkey PRIMARY KEY (id);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: verification verification_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.verification
    ADD CONSTRAINT verification_pkey PRIMARY KEY (id);


--
-- Name: badge_referents_referentId_badgeId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "badge_referents_referentId_badgeId_key" ON public.badge_referents USING btree ("referentId", "badgeId");


--
-- Name: badges_number_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX badges_number_key ON public.badges USING btree (number);


--
-- Name: justifications_chefId_objectifId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "justifications_chefId_objectifId_key" ON public.justifications USING btree ("chefId", "objectifId");


--
-- Name: objectifs_badgeId_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "objectifs_badgeId_code_key" ON public.objectifs USING btree ("badgeId", code);


--
-- Name: session_token_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX session_token_key ON public.session USING btree (token);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: account account_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: badge_referents badge_referents_badgeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.badge_referents
    ADD CONSTRAINT "badge_referents_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES public.badges(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: badge_referents badge_referents_referentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.badge_referents
    ADD CONSTRAINT "badge_referents_referentId_fkey" FOREIGN KEY ("referentId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: commentaires commentaires_auteurId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.commentaires
    ADD CONSTRAINT "commentaires_auteurId_fkey" FOREIGN KEY ("auteurId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: commentaires commentaires_justificationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.commentaires
    ADD CONSTRAINT "commentaires_justificationId_fkey" FOREIGN KEY ("justificationId") REFERENCES public.justifications(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: fichiers fichiers_justificationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fichiers
    ADD CONSTRAINT "fichiers_justificationId_fkey" FOREIGN KEY ("justificationId") REFERENCES public.justifications(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: justifications justifications_badgeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.justifications
    ADD CONSTRAINT "justifications_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES public.badges(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: justifications justifications_chefId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.justifications
    ADD CONSTRAINT "justifications_chefId_fkey" FOREIGN KEY ("chefId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: justifications justifications_objectifId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.justifications
    ADD CONSTRAINT "justifications_objectifId_fkey" FOREIGN KEY ("objectifId") REFERENCES public.objectifs(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: notifications notifications_destinataireId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "notifications_destinataireId_fkey" FOREIGN KEY ("destinataireId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: notifications notifications_justificationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "notifications_justificationId_fkey" FOREIGN KEY ("justificationId") REFERENCES public.justifications(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: objectifs objectifs_badgeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.objectifs
    ADD CONSTRAINT "objectifs_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES public.badges(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: session session_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

