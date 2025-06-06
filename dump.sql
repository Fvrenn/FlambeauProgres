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
-- Name: badges; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.badges (
    id integer NOT NULL,
    name text NOT NULL,
    number text,
    description text,
    image_src text
);


ALTER TABLE public.badges OWNER TO postgres;

--
-- Name: badges_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.badges_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.badges_id_seq OWNER TO postgres;

--
-- Name: badges_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.badges_id_seq OWNED BY public.badges.id;


--
-- Name: competences; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.competences (
    id integer NOT NULL,
    badge_id integer NOT NULL,
    description text NOT NULL
);


ALTER TABLE public.competences OWNER TO postgres;

--
-- Name: competences_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.competences_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.competences_id_seq OWNER TO postgres;

--
-- Name: competences_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.competences_id_seq OWNED BY public.competences.id;


--
-- Name: realisations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.realisations (
    id integer NOT NULL,
    badge_id integer NOT NULL,
    description text NOT NULL
);


ALTER TABLE public.realisations OWNER TO postgres;

--
-- Name: realisations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.realisations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.realisations_id_seq OWNER TO postgres;

--
-- Name: realisations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.realisations_id_seq OWNED BY public.realisations.id;


--
-- Name: badges id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.badges ALTER COLUMN id SET DEFAULT nextval('public.badges_id_seq'::regclass);


--
-- Name: competences id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.competences ALTER COLUMN id SET DEFAULT nextval('public.competences_id_seq'::regclass);


--
-- Name: realisations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.realisations ALTER COLUMN id SET DEFAULT nextval('public.realisations_id_seq'::regclass);


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
7b123be7-8432-46ca-97c6-2a0513090e49	4db04d5a95feeaf103ec8192abe73d75462455001eeb87e7b76e358a43fd4c4f	2025-06-01 12:10:55.761904+02	20250530230049_init	\N	\N	2025-06-01 12:10:55.746248+02	1
\.


--
-- Data for Name: badges; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.badges (id, name, number, description, image_src) FROM stdin;
1	Branche Petits Flambeaux	2B	Cette sp├®cialit├® s'adresse bien entendu aux Chefs de la branche Petits Flambeaux. C'est une ├®tape indispensable pour ├¬tre Chef de Troupe de cette branche mais elle concerne ├®galement tout responsable qui souhaite mieux comprendre les objectifs p├®dagogiques propres ├á cette tranche d'├óge.	/etape-badges/2b-spe_PF.svg
2	Branche Flambeaux	2C	Cette sp├®cialit├® s'adresse bien entendu aux Chefs de la branche Flambeaux. C'est une ├®tape indispensable pour ├¬tre Chef de Troupe de cette branche mais elle concerne ├®galement tout responsable qui souhaite mieux comprendre les objectifs p├®dagogiques propres ├á cette tranche d'├óge.	/etape-badges/2c-spe_F.svg
3	Animation	2E	Qui parmi les Chefs nÔÇÖest pas animateur? A tous de lancer un jeu impromptu et de savoir g├®rer une courbe de veill├®e. Si lÔÇÖun dÔÇÖentre vous se sp├®cialise, cÔÇÖest pour d├®velopper le plaisir de rendre chaque activit├® ludique, dÔÇÖavoir un th├¿me de camp l├®ch├® et de faire du jeu un ├®tat d'esprit pour un vivre ensemble tout sauf ennuyeux !	/etape-badges/2e-spe_animation.svg
4	Communication	2F	La communication est le syst├¿me nerveux du groupe, quÔÇÖelle soit interne ou en lien avec les diff├®rents partenaires. La bonne utilisation des diff├®rents moyens de communication est essentielle pour un groupe. Le num├®rique a totalement r├®volutionn├® ce domaine en quelques ann├®es, ├á toi d'utiliser le potentiel des nouveaux outils au service du groupe et de ses objectifs !	/etape-badges/2f-spe_communication.svg
5	Construction	2G	Vivre dans la nature d'accord, mais pas ├á n'importe quelle condition ! La ma├«trise des n┼ôuds, des outils et des techniques d'assemblage n'est pas une finalit├® en soi, mais un pr├®alable ├á une installation op├®rationnelle voire confortable !	/etape-badges/2g-spe_construction.svg
6	Exploration	2I	Vous vous passionnez pour les cartes, boussoles et signes de piste car chaque voyage est une aventure. Vous ma├«trisez donc les techniques dÔÇÖorientation pour trouver votre chemin, tout comme la s├®curit├® des enfants dans un environnement quÔÇÖils ne connaissent pas. Vous ne leur transmettez pas seulement une autonomie technique, mais aussi une curiosit├® et un esprit dÔÇÖinitiative dans leur voyage.	/etape-badges/2i-spe_explo.svg
7	Intendance	2J	Le tr├®sorier a une fonction strat├®gique. M├¬me si la gestion des finances demande un peu de discipline, chacun peut ├¬tre concern├® par ce r├┤le car nous avons tous ├á g├®rer de l'argent ├á un moment ou ├á un autre. Il faut pourtant apprendre ├á d├®coller le nez d'un tableur et interagir avec l'ensemble de l'├®quipe pour remplir efficacement sa mission.	/etape-badges/2j-spe_intendance.svg
8	Mat├®riel	2K	En tant que responsable mat├®riel, tu es le fournisseur de moyens de ton ├®quipe. Partir en WE, faire un jeu ou pr├®parer la Journ├®e Flambeaux ... quel que soit le programme, si le mat├®riel ne suit pas, difficile d'aller loin. Mais comme souvent, ce sont les finances qui ont le dernier mot ... ├á moins de faire preuve d'inventivit├® pour acqu├®rir le mat├®riel n├®cessaire et de discipline pour l'entretenir et le faire durer.	/etape-badges/2k-spe_materiel.svg
9	Nature	2L	Apprendre ├á conna├«tre la nature c'est apprendre ├á l'aimer et donc ├á la prot├®ger. Mais aux Flambeaux la nature n'est pas un mus├®e, on y vit ! Elle est l'un des quatre cadres dans lesquels nos activit├®s prennent leur place. C'est aussi une ressource dans laquelle il faut apprendre ├á puiser de fa├ºon raisonn├®e. A toi de jouer pour que la cr├®ation continue ├á mener les jeunes vers le Cr├®ateur !	/etape-badges/2l-spe_nature.svg
10	Sant├®	2M	En camp ou au cours de l'ann├®e, l'assistant sanitaire joue un r├┤le indispensable dans toute ├®quipe de responsables. Cette sp├®cialit├® ├®largit n├®anmoins leur champ d'action habituel en prenant en compte, en plus des soins, la pr├®vention et l'hygi├¿ne corporelle tout en y associant progressivement les jeunes. PR├ëREQUIS : M0 Passer le dipl├┤me du PSC1	/etape-badges/2m-sante.svg
11	Vie Spirituelle	2N	Cercle du Feu, engagement spirituel, ├®changes personnels ... chaque Chef est concern├® par la vie spirituelle du groupe. Mais il peut ├¬tre int├®ressant qu'une personne en particulier s'y consacre pour r├®fl├®chir, dynamiser, et renouveler les outils et les pratiques.	/etape-badges/2n-spe_vie_spi.svg
12	Cuisine	2H	Savoir cuisiner est un art, un devoir lorsqu'on veut d├®fendre la gastronomie fran├ºaise. Alors lorsqu'il s'agit d'officier sur feu de bois quelles que soient les circonstances, cela rel├¿ve plut├┤t de l'exploit ! Mais cÔÇÖest un vrai challenge que de faire de ce moment culinaire un plaisir tout en int├®grant les r├¿gles d'hygi├¿ne, l'├®quilibre alimentaire et une r├®flexion ├®thique sur le contenu de nos assiettes. Bref, ├á table !	/etape-badges/2h-spe_cuisine.svg
\.


--
-- Data for Name: competences; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.competences (id, badge_id, description) FROM stdin;
1	1	B1 Acqu├®rir et savoir utiliser le "Guide du Bois" (p. 9 ├á 11)
2	1	B2 Se rep├®rer dans le carnet et savoir expliquer l'ordre et le principe des diff├®rentes parties de chaque volume.
3	1	B3 Lire le chapitre "L'enfant ├á l'├óge PF" p.19 du Guide du Bois et animer une discussion avec la ma├«trise pour adapter les activit├®s et les attitudes des Chefs.
4	1	B4 Observer les jeunes de ta sizaine, noter pour chacun d'eux les domaines dans lesquels il peut progresser (gestion affaires perso, vie de groupe, une des 5 relations ...), proposer des activit├®s en rapport et faire le point ├á la fin du trimestre.
5	1	B5 Conna├«tre les grandes lignes de l'histoire des ABQS, le r├┤le des 5 personnages principaux et savoir raconter le d├®part et l'arriv├®e au Parc.
6	1	B6 Expliquer aux jeunes le sens des diff├®rents rituels (rassemblement, Grand Arbre, Foulard d'Accueil...) et conna├«tre la place des diff├®rents marqueurs sur l'uniforme.
7	1	B7 Accompagner un ami du Bois dans toute la d├®marche de la Parole de PF.
8	2	C1 Acqu├®rir, savoir utiliser les ressources pour les jeunes et les Chefs sp├®cifiques de la branche Flambeaux et savoir accompagner les jeunes dans l'utilisation du carnet Empreintes
9	2	C2 Etre capable d'expliquer la notion d'engagement et la Loi Flambeaux et accompagner un jeune tout au long de cette d├®marche (pr├®sentation, engagement, suivi ...)
10	2	C3 Ma├«triser le sens et les objectifs des ├®tapes Flambeaux et ├¬tre capable d'int├®grer la progression (Etapes + Brevets) dans les activit├®s du groupe. Veiller ├á ce que chaque jeune y trouve son compte (niveau, m├®thode, rythme ...).
11	2	C4 Conna├«tre le fonctionnement et les objectifs du syst├¿me de patrouille. Mettre en place le cadre permettant une vie de patrouille. Accompagner la mise en place des PA et des r├®f├®rents de PA avec des temps d├®di├®s. Veiller ├á la tenue r├®guli├¿re de Conseils de patrouille et en faire le bilan.
12	2	C5 Accompagner individuellement les membres de la HP dans leur responsabilit├®s. Organiser 3 CDC au cours de l'ann├®e et proposer du contenu sp├®cifique en fonction de leur r├┤le et de leurs besoins.
13	2	C6 Suivre individuellement 4 ├á 6 jeunes de ton groupe, apprendre ├á les conna├«tre, ├¬tre capable de les ├®couter et les conseiller dans leurs choix personnels (PA, brevets ...) et leur cheminement (questionnement, vie spi ...)
14	2	C7 Conna├«tre et rappeler le sens et l'objectif des diff├®rentes traditions (folklore national et de groupe). Encourager et accompagner le d├®veloppement de l'identit├® de chaque patrouille (cri, fanion, livre de patrouille ...)
15	3	E1 Ma├«triser les param├¿tres pour un temps d'animation r├®ussi et organiser un temps d'├®change libre en ma├«trise pour progresser ensemble dans ce domaine (explications, r├®partition des jeunes, gestion du temps, pr├®paration du mat├®riel, bilan...)
16	3	E2 Conna├«tre les sp├®cificit├®s des diff├®rents styles de jeux (nuit/approche, plateau, capture, strat├®gie, ...), pour pouvoir les adapter aux objectifs p├®dagogiques dÔÇÖun temps de progression, de coh├®sion, dÔÇÖautonomie ...
17	3	E3 Transmission aux jeunes: pr├®parer une activit├® avec des jeunes volontaires ou les PA animation jeunes.
18	3	E4 Ma├«triser le folklore national et proposer un cadre propre au groupe pour les temps de rassemblement, dÔÇÖengagement et de valorisation de la progression.
19	3	E5 Prendre la responsabilit├® dÔÇÖun temps de chant r├®gulier ├á chaque rencontre.
20	3	E6 G├®rer le mat├®riel p├®dagogique de la troupe en lien avec le PA mat├®riel (mat├®riel de jeu, bricolage ...)
21	3	E7 Avoir valid├® le BAFA
22	4	F1 Savoir communiquer de mani├¿re pertinente avec les jeunes en fonction de leur ├óge (consignes claires, informations qui vont droit au but, contenu et objectif d'une activit├® ...).
23	4	F2 Mettre en place et coordonner un temps d'├®change et de pri├¿re r├®gulier avec la ma├«trise pour faire le point sur le v├®cu de l'├®quipe du groupe et des jeunes.
24	4	F3 Veiller ├á l'information des partenaires (Eglise(s), partenaires locaux, Mouvement ..) en adaptant les moyens au message ├á faire passer tout en respectant la charte graphique du Mouvement.
25	4	F4 Garder un lien avec les parents par diff├®rents moyens (r├®union de rentr├®e, nouvelles par mail, r├®ponse aux question ...) en ayant conscience des enjeux (pr├®cautions/transparence ...)
26	4	F5 Encourager la prise de photos r├®guli├¿res et l'utilisation des nouvelles technologies pour communiquer sur les activit├®s du groupe tout en veillant au respect du droit ├á l'image (autorisation parentale) et ├á la protection des donn├®es personnelles.
27	4	F6 Conna├«tre le bon usage (net ├®tiquette, r├®activit├® ...) et les limites de la communication par courriel.
28	4	F7 Savoir diriger une r├®union d'├®quipe (permettre ├á chacun de s'exprimer, favoriser l'├®coute r├®ciproque, faire ressortir les id├®es importantes, ...) et savoir r├®diger un compte-rendu fid├¿le et synth├®tique.
29	5	G1 Ma├«triser l'utilisation des outils de ta troupe, conna├«tre leur utilit├® et leur entretien et organiser un atelier de formation mettant en avant la s├®curit├®. (Cf. capacit├® "Port de hache" pour les Flambeaux)
30	5	G2 Organiser une activit├® autour de l'apprentissage des n┼ôuds avec les jeunes en faisant la d├®monstration de leur utilit├®.
31	5	G3 Ma├«triser les techniques d'assemblage (br├¬lage, froissartage ...) et les notions assurant la solidit├® des installations (diam├¿tres, triangles, jambe de force ...) et transmettre les bases ├á l'ensemble de la ma├«trise.
32	5	G4 Utiliser de mani├¿re responsable les ressources naturelles pour les constructions (privil├®gier les constructions ├®conomes en bois, utiliser au maximum le bois mort, recycler le bois plut├┤t que de le br├╗ler ├á la fin ...)
33	5	G5 Savoir tendre rapidement une b├óche et pr├®voir le mat├®riel n├®cessaire pour se prot├®ger des intemp├®ries lors des sorties.
34	5	G6 Accompagner les jeunes dans les diff├®rentes ├®tapes (plans, choix du lieu, r├®alisation, entretien ...) de la r├®alisation de leur construction d'├®quipe (cabane de sizaine, coin pat ...)
35	5	G7 Lors de l'installation d'un camp, conna├«tre tous les param├¿tres et la fa├ºon de les prendre en compte.
36	6	I1 Savoir cr├®er un itin├®raire de randonn├®e et adapter la difficult├® en fonction du niveau des jeunes, de la dur├®e, de la distance, du d├®nivel├®, de la m├®t├®o, ...
37	6	I2 Ma├«triser la lecture de cartes de randonn├®e (l├®gendes, codes couleurs, d├®nivel├®s remarquables, savoir "lire" le paysage (appr├®hension de la 3D) ...).
38	6	I3 Savoir s'orienter avec une boussole ├á vis├®e, savoir utiliser les azimuts et conna├«tre dÔÇÖautres techniques dÔÇÖorientation (signes de piste, Nord sans boussole, Gilwell (Topo express)...).
39	6	I4 Conna├«tre et faire appliquer la r├®glementation et les consignes de s├®curit├® : code la route et d├®placements en groupes, pr├®visions m├®t├®o et conduite ├á tenir, moyenne montagne, autonomie, trousse de secours...
40	6	I5 Etre capable d'organiser rapidement un bivouac ├á un endroit autoris├® et de monter un abri en b├óche en respectant les param├¿tres d'installation d'un campement.
41	6	I6 Pr├®senter une exploration et organiser la r├®partition des groupes de fa├ºon attractive et ludique pour amener chaque jeune ├á prendre go├╗t ├á l'effort et ├á se d├®passer.
42	6	I7 D├®velopper une sp├®cialit├® autour de la randonn├®e : rando sportive, course d'orientation, immersion, d├®couverte du milieu naturel ...
43	7	J1 Etablir le budget d'un WE en anticipant un maximum les recettes et les d├®penses et savoir calculer un prix de journ├®e alimentaire.
44	7	J2 Etre responsable de la caisse du groupe ou du camp et tenir le tableau (op├®rations) et le cahier (justificatifs) de comptabilit├® de la troupe ├á jour.
45	7	J3 Collecter les inscriptions et les cotisations des jeunes, ├®tablir des re├ºus le cas ├®ch├®ant et tenir le registre de pr├®sence des jeunes ├á jour.
46	7	J4 G├®rer le stock alimentaire du groupe (dates de p├®remption, relev├® des t┬░ du r├®frig├®rateur ...)
47	7	J5 Accompagner les jeunes dans l'├®tablissement d'une liste de courses ├á partir d'un menu, dans le choix des lieux d'approvisionnement et dans le respect de la chaine du froid.
48	7	J6 D├®finir un plan de financement pour un investissement du groupe et suivre sa r├®alisation jusqu'├á l'achat.
49	7	J7 Mettre en place un fonctionnement permettant de prendre en compte les familles qui ont peu de ressources financi├¿res en y associant les diff├®rents partenaires(parents, groupe, ├®glise, assistance sociale ...).
50	8	K1 R├®aliser un inventaire complet du mat├®riel ├á disposition et de son ├®tat. Faire le tri, marquer le mat├®riel, faire la liste de ce qui doit ├¬tre r├®par├®, remplac├®.
51	8	K2 Avec l'ensemble de l'├®quipe, faire la liste du mat├®riel ├á acheter et d├®finir les priorit├®s avec l'intendant en fonctions des moyens. Conna├«tre les nouveaut├®s et ├¬tre une force de proposition en mati├¿re d'investissement.
52	8	K3 Organiser un stockage fonctionnel du mat├®riel (rangement par cat├®gorie, identification du contenu ...) permettant une utilisation facile et s├®curis├®e.
53	8	K4 Conna├«tre les bases de l'entretien du mat├®riel et des outils (huilage outils, s├®chage tentes ...)
54	8	K5 R├®fl├®chir et mettre en ┼ôuvre des alternatives ├á l'achat de mat├®riel neuf pour d├®velopper une attitude responsable et r├®aliser des ├®conomies : achat d'occasion, march├®s aux puces, r├®paration du mat├®riel ab├«m├®, mise ├á disposition, location ...
55	8	K6 Savoir ├®valuer le volume et la masse du mat├®riel et ma├«triser les contraintes du chargement et du transport du mat├®riel (limites r├®glementaires, ├®quilibre des charges, protection du mat├®riel sensible ...)
56	8	K7 R├®aliser une liste de fournitures et de consommables (ficelle, b├óche, recharge gaz ...) en indiquant leur prix moyen ainsi que l'enseigne la plus proche.
57	9	L1 R├®aliser un jeu ├á postes permettant de d├®velopper les connaissances des jeunes sur la nature environnante (faune, flore, min├®raux ...) et r├®├®valuer les connaissances ├á diff├®rents moments.
58	9	L2 Reconna├«tre 5 formations nuageuses et savoir interpr├®ter diff├®rents signes naturels pour anticiper les ├®v├®nements m├®t├®orologiques.
59	9	L3 Savoir am├®nager son campement, les installations et le coin du feu en respectant les lieux et leurs occupants (le moins d'impact) et ne pas laisser de traces ├á son d├®part.
60	9	L4 Conna├«tre diff├®rents indicateurs d'impact (bilan carbone, quantit├® d'eau n├®cessaire ...) et sensibiliser le groupe au d├®veloppement de comportements ├®co-responsables en terme de d├®placement, d'achat, de recyclage ... par la r├®daction d'une charte, la d├®finition d'objectifs ...
61	9	L5 Organiser une sortie avec un naturaliste ou un forestier pour d├®couvrir la richesse d'un ├®cosyst├¿me, sa fragilit├® et les d├®fis ├á relever pour le pr├®server.
62	9	L6 Organiser avec les jeunes la r├®alisation d'un objet utile ou d├®coratif ├á partir d'├®l├®ments naturels (instrument, couronne de l'avant, ustensile taill├®s dans le bois ...)
63	9	L7 D├®velopper une connaissance approfondie dans un domaine particulier (insectes, arbres, champignons, min├®raux ...) ou une comp├®tence particuli├¿re en lien avec la nature.
64	10	M1 Conna├«tre le contenu type d'une trousse de secours, savoir expliquer l'utilit├® et l'utilisation de chaque ├®l├®ment la composant et impliquer les jeunes dans la pr├®paration et l'utilisation de la trousse de secours pour une sortie.
65	10	M2 Savoir prodiguer les soins de base (coupure/plaie, br├╗lure, tique, coup de chaud, ampoule, contusion ...)
66	10	M3 Savoir ├®valuer la gravit├® d'une situation et agir en cons├®quence tout en connaissant ses limites. Sensibiliser le groupe ├á trois situations pr├®cises pour lesquelles il faut faire appel ├á l'aide ext├®rieur (assistant sanitaire, directeur, m├®decin, urgences ...)
67	10	M4 Conna├«tre et mettre ├á jour les affichages obligatoires en accueil de mineurs (num├®ros d'urgence, pr├®vention, interdiction de fumer, consignes lavage des mains ...)
68	10	M5 Veiller aux moyens et ├á la mise en ┼ôuvre des actions de pr├®vention (casquette et boisson r├®guli├¿re, utilisation correcte des outils, lavage des mains, javellisation des jerricans ...)
69	10	M6 Avec un(e) Chef/taine de l'autre sexe, organiser et veiller au bon d├®roulement du temps de douche (que tout le monde se douche, respect de l'intimit├®, s├®chage des serviettes ...) et du brossage quotidien des dents.
70	10	M7 Encourager le rangement des affaires personnelles en organisant une inspection des tentes en bin├┤me avec un Chef/taine de l'autre sexe. Veiller au tri des affaires sales/propres (quantit├® suffisante ?), des habits humides/secs et au stock de sucreries.
71	11	N1 Etre capable de faire des canevas de Cercles du Feu et de m├®ditations personnelles.
72	11	N2 Lister les outils et les ressources permettant aux Chefs de renouveler les Cercle du Feu : discussion sur un sujet qui touche la troupe ...
73	11	N3 Encourager la prise dÔÇÖinitiative des jeunes dans lÔÇÖexpression de leur foi en les accompagnant dans leur d├®marche (CDF par un jeunes, t├®moignage, musique, choix des chants ...)
74	11	N4 ├ètre capable de conduire dÔÇÖautres formes de temps spi: culte Flambeaux, Veill├®e spi, temps d'engagement et/ou de t├®moignage ...
75	11	N5 Veiller ├á laisser ├á chaque jeune un espace pour grandir spirituellement tout en forgeant ses propres convictions. Sensibiliser les Chefs aux attitudes de manipulation.
76	11	N6 Mettre en place une action r├®guli├¿re pour sensibiliser lÔÇÖEglise et/ou les Amis Flambeaux aux d├®fis spi du groupe.
77	11	N7 Mettre en ┼ôuvre deux actions pour encourager les Chefs ├á mettre en place un suivi personnalis├® de chaque jeune.
78	12	H1 R├®aliser un carnet de 30 recettes avec : 10 plats adapt├®s au plein air, 5 plats ├®labor├®s mais rapidement r├®alisables, 5 recettes trappeurs, 5 desserts r├®alisables en ext├®rieur (au moins un avec cuisson), 5 salades compos├®es
79	12	H2 Veiller au respect des r├¿gles de base de l'hygi├¿ne en cuisine et mettre en place deux actions de sensibilisation pour les Chefs (ateliers, formation, jeu ...)
80	12	H3 Accompagner les jeunes dans la transmission dÔÇÖune nouvelle technique de cuisine.
81	12	H4 ├ètre responsable de la disponibilit├® et de lÔÇÖ├®tat du mat├®riel de cuisine en fonction des besoins en lien avec le responsable mat├®riel de ta troupe.
82	12	H5 Conna├«tre les portions th├®oriques individuelles et savoir les adapter en fonction du public et du contexte. (├óge, m├®t├®o, activit├®, cadre ...)
83	12	H6 ├ëtablir des menus ├®quilibr├®s et adapt├®s au diff├®rents temps et contraintes de la journ├®e (midi, soir, dur├®e de pr├®paration,...) et savoir g├®rer les r├®gimes alimentaires sp├®cifiques (allergies alimentaires, convictions ...)
84	12	H7 Savoir inclure une r├®flexion ├®thique dans l'├®laboration des menus : utiliser des l├®gumes de saison, privil├®gier les circuits courts, optimiser les quantit├®s, limiter les plats avec viandes pour privil├®gier la qualit├® et mettre en place un compost.
\.


--
-- Data for Name: realisations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.realisations (id, badge_id, description) FROM stdin;
1	1	B8 Concevoir un jeu, un Cercle du Feu et un Grand Arbre en lien avec l'imaginaire des ABQS et r├®aliser une fiche d'activit├® pour chacune d'elles en pr├®cisant les objectifs, la dur├®e, le mat├®riel n├®cessaire ...
2	1	B9 Proposer une ressource p├®dagogique (autre qu'une fiche d'animation) pour compl├®ter la partie "Bois Tahouti" du "Guide du Bois"
3	2	C8 Accompagner les projets de patrouille pendant l'ann├®e ou le camp (initier les projets, veiller ├á la d├®marche, valider la faisabilit├®, g├®rer l'intervention des diff├®rents r├®f├®rents de PA...)
4	2	C9 R├®alise une fiche ressource pour les Chefs sp├®cifique ├á la branche Flambeaux (fiche activit├® : jeu, CDF ... ou fiche technique : PA, formation HP ...)
5	3	E8 ├ètre charg├® de lÔÇÖimaginaire de groupe ou de camp, le faire vivre et le d├®cliner dans les diff├®rents temps (repas, jeux, vie quotidienne ...) en fonction du cadre d├®fini en ├®quipe.
6	3	E9 Inventer un jeu, et l'utiliser ├á plusieurs reprises en tenant compte des retours des jeunes et des Chefs pour l'am├®liorer progressivement. R├®aliser une fiche qui reprend la d├®marche et l'├®volution du jeu pour pouvoir la pr├®senter lors d'un temps de formation.
7	4	F8 Intervenir dans la pr├®paration et lÔÇÖanimation dÔÇÖun ├®v├¿nement li├® ├á la promotion du groupe ou du Mouvement : Journ├®e Nationale du Mouvement, stand Flambeaux lors d'un ├®v├®nement (Journ├®e des associations ...)
8	4	F9 D├®velopper un outil de communication (clip vid├®o, blog ou site-web, prospectus ...) au profit des Flambeaux (groupe local, ├®v├®nement r├®gional ou national ...). R├®aliser et faire valider son travail en lien avec un professionnel de la communication.
9	5	G8 Participer activement ├á l'installation d'un camp en proc├®dant un rep├®rage du lieu en amont, en r├®alisant un plan d├®taill├® (campement, constructions, sanitaires ...) et en coordonnant les constructions collectives.
10	5	G9 Concevoir le plan et r├®aliser une installation collective originale de camp en utilisant les diff├®rents techniques apprises (2 br├¬lages diff├®rents, 2 techniques de froissartage diff├®rentes ...)
11	6	I8 Pr├®parer et r├®aliser une activit├® dÔÇÖorientation impliquant la manipulation de carte et boussole.
12	6	I9 Concevoir avec les jeunes un projet de randonn├®e (sur 2 jours avec h├®bergement et repas) dont ils d├®finissent les objectifs et les modalit├®s. Le projet doit avoir une dimension sportive, technique, ludique ou environnementale.
13	7	J8 Assurer la fonction de tr├®sorier pendant l'ann├®e ou un camp, depuis le budget jusqu'au bilan en passant par les achats.
14	7	J9 Coordonner une op├®ration de collecte de fonds (choix du projet, communication, organisation de la collecte, bilan ...) au profit dÔÇÖun projet du groupe ou de soutien dÔÇÖune ┼ôuvre sociale.
15	8	K8 R├®alise une installation permettant d'optimiser le rangement et/ou la mise ├á disposition du mat├®riel du groupe ou du camp (├®tag├¿res, caisse, coffre-banc, porte-outils ...)
16	8	K9 En lien avec les jeunes, identifier un besoin (malle de patrouille, malle d'activit├®, malle de jeux ...), d├®finir le contenu type ainsi que les r├¿gles d'utilisation pour un fonctionnement autonome, assurer le suivi pendant l'ann├®e ou le camp et r├®aliser l'inventaire ├á la fin.
17	9	L8 R├®aliser un carnet qui permet d'identifier les ├®l├®ments naturels disponibles ayant une utilisation pratique (essences de bois sp├®cifique pour avoir des flammes, de la chaleur, qui dure ; champignons, baies, racines et plantes comestibles ; autres ├®l├®ments naturels utiles : r├®pulsifs, pour soigner ...)
18	9	L9 Accompagner les jeunes dans la r├®alisation d'une action en faveur de la nature (nettoyage d'un terrain ou d'une berge, r├®alisation d'un nichoir, d'une mangeoire ou d'un h├┤tel ├á insecte ...) en sensibilisant les jeunes aux cons├®quences des choix humains sur la nature.
19	10	M8 Assurer la fonction d'assistant sanitaire pendant l'ann├®e ou le camp, en veillant au contenu et la mise ├á jour du mat├®riel, en assurant les soins de base, la distribution des m├®dicaments sur prescription et en organisant le fonctionnement de l'infirmerie.
20	10	M9 Mettre en place une action de sensibilisation ├á l'hygi├¿ne corporelle et une action de pr├®vention aux accidents (identifier les besoins, organiser les actions, r├®aliser une fiche de pr├®vention, en faire le bilan en mesurant l'impact ...).
21	11	N8a Organiser un cycle coh├®rent de Cercle du Feu sur un camp ou un trimestre ├á partir d'un th├¿me ou d'un fil rouge.
22	11	N8b Mettre en place un parrainage spi des Chefs par l'Eglise.
23	11	N8c Monter une journ├®e d'action dans la ville (t├®moignage par les actes).
24	12	H8 Lors dÔÇÖun WE ou dÔÇÖun camp, g├®rer l'installation de la cuisine et optimiser son agencement en lien avec lÔÇÖ├®quipe cuisine et le PA construction
25	12	H9a R├®aliser un menu complet pour un ├®v├¿nement particulier (WE de troupe/groupe, gala, f├¬te de no├½l, repas avec les parents,...) et pr├®parer le repas avec lÔÇÖaide des jeunes.
26	12	H9b Organiser un concours cuisine de A ├á Z (constitution des ├®quipes, crit├¿res dÔÇÖ├®valuation, r├¿gles (panier impos├®, budget impos├®, th├¿me ...), animation, prix ...)
\.


--
-- Name: badges_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.badges_id_seq', 12, true);


--
-- Name: competences_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.competences_id_seq', 84, true);


--
-- Name: realisations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.realisations_id_seq', 26, true);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: badges badges_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.badges
    ADD CONSTRAINT badges_pkey PRIMARY KEY (id);


--
-- Name: competences competences_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.competences
    ADD CONSTRAINT competences_pkey PRIMARY KEY (id);


--
-- Name: realisations realisations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.realisations
    ADD CONSTRAINT realisations_pkey PRIMARY KEY (id);


--
-- Name: competences competences_badge_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.competences
    ADD CONSTRAINT competences_badge_id_fkey FOREIGN KEY (badge_id) REFERENCES public.badges(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: realisations realisations_badge_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.realisations
    ADD CONSTRAINT realisations_badge_id_fkey FOREIGN KEY (badge_id) REFERENCES public.badges(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

