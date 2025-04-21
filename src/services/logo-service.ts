import { supabase } from "@/integrations/supabase/client";
import { getTeamLogoUrl } from "./leaguepedia-service";
import { getLeagueLogo, isKnownLeague } from "@/config/league-logos";

interface LogoResponse {
  logoUrl: string | null;
  cached?: boolean;
}

// Logos connus en fallback si l'API échoue
const FALLBACK_LOGOS: Record<string, string> = {
  // Équipes majeures LEC
  'G2 Esports': 'https://am-a.akamaihd.net/image?resize=60:60&f=http%3A%2F%2Fstatic.lolesports.com%2Fteams%2FG2-FullonDark.png',
  'Fnatic': 'https://am-a.akamaihd.net/image?resize=60:60&f=http%3A%2F%2Fstatic.lolesports.com%2Fteams%2F1631819669850_fnatic-2021-worlds.png',
  'MAD Lions': 'https://am-a.akamaihd.net/image?resize=60:60&f=http%3A%2F%2Fstatic.lolesports.com%2Fteams%2FMad-Lions-Logo-FullonDark.png',
  'Team BDS': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/0/06/Team_BDSlogo_profile.png/revision/latest/scale-to-width-down/220?cb=20220111204832',
  'Excel': 'https://am-a.akamaihd.net/image?resize=60:60&f=http%3A%2F%2Fstatic.lolesports.com%2Fteams%2FXL-FullonDark.png',
  'SK Gaming': 'https://static.lolesports.com/teams/1643979272144_SK_Monochrome.png',
  'Team Heretics': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/c/c6/Team_Hereticslogo_profile.png/revision/latest?cb=20230116204953',
  'Team Vitality': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/8/86/Team_Vitalitylogo_square.png/revision/latest/scale-to-width-down/220?cb=20230224142251',
  
  // Ajouts spéciaux pour les équipes problématiques
  'Karmine Corp': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/2/2d/Karmine_Corplogo_square.png/revision/latest/scale-to-width-down/220?cb=20240119163338',
  'Rogue': 'https://am-a.akamaihd.net/image?resize=60:60&f=http%3A%2F%2Fstatic.lolesports.com%2Fteams%2F1592590374862_Rogue_Square_Blue.png',
  'Talon': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/6/66/TALON_%28Hong_Kong_Team%29logo_profile.png/revision/latest?cb=20210728214242',
  
  // Équipes majeures LCK
  'T1': 'https://am-a.akamaihd.net/image?resize=60:60&f=http%3A%2F%2Fstatic.lolesports.com%2Fteams%2F1631819360134_t1-2021-worlds.png',
  'Gen.G': 'https://am-a.akamaihd.net/image?resize=60:60&f=http%3A%2F%2Fstatic.lolesports.com%2Fteams%2F1631819238354_geng-2021-worlds.png',
  'Dplus KIA': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/e/e0/Dplus_KIAlogo_profile.png/revision/latest/scale-to-width-down/220?cb=20230512045312',
  'Dplus KIA Youth': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/e/e0/Dplus_KIAlogo_profile.png/revision/latest/scale-to-width-down/220?cb=20230512045312',
  'KT Rolster': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/5/5c/KT_Rolsterlogo_profile.png/revision/latest/scale-to-width-down/220?cb=20210605164657',
  'DRX': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/0/0d/DRXlogo_profile.png/revision/latest/scale-to-width-down/220?cb=20200107182345',
  'DN Freecs': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/5/5a/Dplus_Freecslogo_profile.png/revision/latest/scale-to-width-down/220?cb=20231122071644',
  'Hanwha Life Esports Challengers': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/f/f8/Hanwha_Life_Esportslogo_profile.png/revision/latest/scale-to-width-down/220?cb=20210108001027',
  'BNK FEARX Youth': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/f/f6/BNK_FEARXlogo_profile.png/revision/latest/scale-to-width-down/220?cb=20240108083242',
  'Nongshim Esports Academy': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/b/b8/Nongshim_RedForcelogo_square.png/revision/latest/scale-to-width-down/220?cb=20210325081928',
  
  // Équipes majeures LPL
  'JD Gaming': 'https://am-a.akamaihd.net/image?resize=60:60&f=http%3A%2F%2Fstatic.lolesports.com%2Fteams%2F1627457924722_JDG_Logo_200407-05.png',
  'Bilibili Gaming': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/f/fb/Bilibili_Gaminglogo_profile.png/revision/latest/scale-to-width-down/220?cb=20230503003727',
  'Weibo Gaming': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/8/87/Weibo_Gaminglogo_profile.png/revision/latest/scale-to-width-down/220?cb=20211227071502',
  'LNG Esports': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/d/d5/LNG_Esportslogo_square.png/revision/latest/scale-to-width-down/220?cb=20230426041003',
  'Top Esports': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/7/75/Top_Esportslogo_profile.png/revision/latest/scale-to-width-down/220?cb=20210728214429',
  'Ultra Prime': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/a/a3/Ultra_Primelogo_profile.png/revision/latest/scale-to-width-down/220?cb=20210728214456',
  'FunPlus Phoenix': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/f/f6/FunPlus_Phoenixlogo_profile.png/revision/latest/scale-to-width-down/220?cb=20210728212243',
  'Invictus Gaming': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/5/58/Invictus_Gaminglogo_profile.png/revision/latest/scale-to-width-down/220?cb=20210728212522',
  'Team WE': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/4/4e/Team_WElogo_profile.png/revision/latest/scale-to-width-down/220?cb=20210728214352',
  'Blood (Chinese Team)': 'https://lol-esports-assets.s3.amazonaws.com/production/images/blood-logo-light-on-dark.png',
  'GaoziGaming': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/f/f3/GaoziGaminglogo_profile.png/revision/latest/scale-to-width-down/220?cb=20240108082354',
  'All I Want': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/a/a9/All_I_Wantlogo_profile.png/revision/latest/scale-to-width-down/220?cb=20240108081417',
  'Happy Game (LGC Team)': 'https://lol-esports-assets.s3.amazonaws.com/production/images/happy-game-logo-light-on-dark.png',
  'Ninjas in Pyjamas.CN': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/1/12/Ninjas_in_Pyjamas.CNlogo_profile.png/revision/latest/scale-to-width-down/220?cb=20230107093945',
  
  // Équipes majeures LCS
  'Cloud9': 'https://am-a.akamaihd.net/image?resize=60:60&f=http%3A%2F%2Fstatic.lolesports.com%2Fteams%2F1631819887391_cloud9-2021-worlds.png',
  'Team Liquid': 'https://am-a.akamaihd.net/image?resize=60:60&f=http%3A%2F%2Fstatic.lolesports.com%2Fteams%2F1631819843362_tl-2021-worlds.png',
  '100 Thieves': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/9/94/100_Thieveslogo_profile.png/revision/latest/scale-to-width-down/220?cb=20210621230835',
  'NRG': 'https://am-a.akamaihd.net/image?resize=60:60&f=http%3A%2F%2Fstatic.lolesports.com%2Fteams%2FNRG-FullonDark.png',
  'FlyQuest': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/7/7d/FlyQuestlogo_profile.png/revision/latest/scale-to-width-down/220?cb=20210728212159',
  'Dignitas': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/1/12/Dignitaslogo_profile.png/revision/latest/scale-to-width-down/220?cb=20210728211950',
  'Shopify Rebellion': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/b/b5/Shopify_Rebellionlogo_profile.png/revision/latest/scale-to-width-down/220?cb=20231122073013',
  'Disguised': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/2/2e/Disguisedlogo_profile.png/revision/latest/scale-to-width-down/220?cb=20231122071756',
  
  // Équipes majeures LFL
  'LDLC OL': 'https://am-a.akamaihd.net/image?resize=60:60&f=http%3A%2F%2Fstatic.lolesports.com%2Fteams%2FLDLC-FullonDark.png',
  'Vitality.Bee': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/8/86/Team_Vitalitylogo_square.png/revision/latest/scale-to-width-down/220?cb=20230224142251',
  'BK ROG': 'https://am-a.akamaihd.net/image?resize=60:60&f=http%3A%2F%2Fstatic.lolesports.com%2Fteams%2FBKROG-FullonDark.png',
  'BK ROG Esports': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/3/3a/BK_ROG_Esportslogo_square.png/revision/latest/scale-to-width-down/220?cb=20230117172527',
  'Veni Vidi Vici (Spanish Team)': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/f/fa/Veni_Vidi_Vici_%28Spanish_Team%29logo_square.png/revision/latest/scale-to-width-down/220?cb=20250101155336',
  
  // Autres équipes
  'DetonatioN FocusMe': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/5/5f/DetonatioN_FocusMelogo_profile.png/revision/latest/scale-to-width-down/220?cb=20210728211916',
  'Chiefs Esports Club': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/8/88/Chiefs_Esports_Clublogo_profile.png/revision/latest/scale-to-width-down/220?cb=20210728211647',
  'Esprit Shonen': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/4/49/Esprit_Sh%C5%8Dnenlogo_square.png/revision/latest/scale-to-width-down/220?cb=20231229210448',
  'Esprit Shōnen': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/4/49/Esprit_Sh%C5%8Dnenlogo_square.png/revision/latest/scale-to-width-down/220?cb=20231229210448',
  'KIA.eSuba Academy': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/7/7f/KIA.eSuba_Academylogo_profile.png/revision/latest/scale-to-width-down/220?cb=20210614152515',
  'Gen.G Scholars': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/5/5b/Gen.Glogo_profile.png/revision/latest/scale-to-width-down/220?cb=20210325073641',
  'Ici Japon Corp. Esport': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/7/7a/Ici_Japon_Corp._Esportlogo_square.png/revision/latest/scale-to-width-down/220?cb=20241006054235',
  'Barça eSports': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/6/68/Bar%C3%A7a_eSportslogo_square.png/revision/latest/scale-to-width-down/220?cb=20221118223547',
  'Movistar KOI': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/b/bd/Movistar_KOIlogo_square.png',
  'Movistar KOI Fénix': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/b/bd/Movistar_KOIlogo_square.png',
  'Movistar Riders': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/b/bd/Movistar_KOIlogo_square.png',
  'ThunderTalk Gaming': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/2/22/ThunderTalk_Gaminglogo_square.png/revision/latest/scale-to-width-down/220?cb=20210306231456',
  
  // Ajout du logo Worlds officiel fourni par l'utilisateur
  'Worlds': '/leagues/worlds.png',
  'Worlds 2025': '/leagues/worlds.png',
  'LCS': '/leagues/lcs.png',
  'LCS Spring 2025': '/leagues/lcs.png',
  'LTA North': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/2/2d/LTA_North_logo.png/revision/latest/scale-to-width-down/220?cb=20241102204430',
  'LTA North 2025 Split 2': 'https://static.lolesports.com/leagues/1731566778368_LTANORTH-LOGO_Blue_RGB2000px.png',
  'LTA South': 'https://static.lolesports.com/leagues/1731566868757_LTASOUTH-LOGO_Red_RGB2000px.png',
  'LTA South 2025 Split 2': 'https://static.lolesports.com/leagues/1731566868757_LTASOUTH-LOGO_Red_RGB2000px.png',
  'Hitpoint Masters': 'https://static.lolesports.com/leagues/1641465237186_HM_white.png',
  'Hitpoint Masters 2025 Spring': 'https://static.lolesports.com/leagues/1641465237186_HM_white.png',
};

// Ajout d'un fallback direct pour les ligues majeures et régionales (logo officiel lolesports)
const HARDCODED_LEAGUE_LOGOS: Record<string, string> = {
  'LEC': 'https://am-a.akamaihd.net/image?resize=120:120&f=http%3A%2F%2Fstatic.lolesports.com%2Fleagues%2F1592516184297_LEC-01-FullonDark.png',
  'LCS': 'https://am-a.akamaihd.net/image?resize=120:120&f=http%3A%2F%2Fstatic.lolesports.com%2Fleagues%2F1592516315279_LCS-01-FullonDark.png',
  'LCK': 'https://am-a.akamaihd.net/image?resize=120:120&f=http%3A%2F%2Fstatic.lolesports.com%2Fleagues%2Flck-color-on-black.png',
  'LPL': 'https://am-a.akamaihd.net/image?resize=120:120&f=http%3A%2F%2Fstatic.lolesports.com%2Fleagues%2F1592516115322_LPL-01-FullonDark.png',
  'LFL': 'https://am-a.akamaihd.net/image?resize=120:120&f=http%3A%2F%2Fstatic.lolesports.com%2Fleagues%2Flfl-color-on-black.png',
  'LFL Division 2': 'https://am-a.akamaihd.net/image?resize=120:120&f=http%3A%2F%2Fstatic.lolesports.com%2Fleagues%2Flfl-division-2-color-on-black.png',
  'NLC': 'https://am-a.akamaihd.net/image?resize=120:120&f=http%3A%2F%2Fstatic.lolesports.com%2Fleagues%2Fnlc-color-on-black.png',
  'PCS': 'https://am-a.akamaihd.net/image?resize=120:120&f=http%3A%2F%2Fstatic.lolesports.com%2Fleagues%2Fpcs-color-on-black.png',
  'LJL': 'https://am-a.akamaihd.net/image?resize=120:120&f=http%3A%2F%2Fstatic.lolesports.com%2Fleagues%2Fljl-color-on-black.png',
  'Hitpoint Masters': 'https://static.lolesports.com/leagues/1641465237186_HM_white.png',
  'Hitpoint Masters 2025 Spring': 'https://static.lolesports.com/leagues/1641465237186_HM_white.png',
  'Worlds': 'https://am-a.akamaihd.net/image?resize=120:120&f=http%3A%2F%2Fstatic.lolesports.com%2Fleagues%2F1592594612171_WorldsDark.png',
  'MSI': 'https://am-a.akamaihd.net/image?resize=120:120&f=http%3A%2F%2Fstatic.lolesports.com%2Fleagues%2F1592594634248_MSIDark.png',
  'LTA North': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/2/2d/LTA_North_logo.png/revision/latest/scale-to-width-down/220?cb=20241102204430&format=original',
  'LTA North 2025 Split 2': 'https://static.lolesports.com/leagues/1731566778368_LTANORTH-LOGO_Blue_RGB2000px.png',
  'LTA South': 'https://static.lolesports.com/leagues/1731566868757_LTASOUTH-LOGO_Red_RGB2000px.png',
  'LTA South 2025 Split 2': 'https://static.lolesports.com/leagues/1731566868757_LTASOUTH-LOGO_Red_RGB2000px.png',
  'Arabian League': 'https://static.lolesports.com/leagues/1738573749768_GoldAL.png',
};

// Correction LOGO: mapping explicite pour toutes variantes possibles du tournoi
const HARDCODED_TOURNAMENT_LOGOS: Record<string, string> = {
  'Road Of Legends 2025 Spring': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/9/94/TransIP_Road_Of_Legends_logo.png',
  'Road of Legends 2025 Spring': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/9/94/TransIP_Road_Of_Legends_logo.png',
  'Road of Legends Spring 2025': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/9/94/TransIP_Road_Of_Legends_logo.png',
  'Road Of Legends Spring 2025': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/9/94/TransIP_Road_Of_Legends_logo.png',
  'Road Of Legends': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/9/94/TransIP_Road_Of_Legends_logo.png',
  'Road of Legends': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/9/94/TransIP_Road_Of_Legends_logo.png',
  // Toutes variantes pour POP Esports
  'POP Esports': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/0/0f/POP_Esports_Masters.png/',
  'POP Esports Masters': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/0/0f/POP_Esports_Masters.png/',
  'POP Esports 2025': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/0/0f/POP_Esports_Masters.png/',
  'POP Esports Masters 2025': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/0/0f/POP_Esports_Masters.png/',
  'POP Esports Spring 2025': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/0/0f/POP_Esports_Masters.png/',
  'POP Esports 2025 Spring': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/0/0f/POP_Esports_Masters.png/',
  'Create Your ArrMY Season 0 Group Stage': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/2/26/ArrMY_logo.png',
  // Toutes variantes pour Liga NEXO
  'Liga NEXO': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/9/91/Liga_Nexo_2020.png',
  'Liga NEXO 2024': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/9/91/Liga_Nexo_2020.png',
  'Liga NEXO 2025': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/9/91/Liga_Nexo_2020.png',
  'Liga NEXO Spring 2025': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/9/91/Liga_Nexo_2020.png',
  'Liga NEXO 2025 Spring': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/9/91/Liga_Nexo_2020.png',
  'Liga Nexo 24-25 Split 2 Relegations': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/9/91/Liga_Nexo_2020.png',
  // Ajout explicite Hitpoint 3rd Div (toutes variantes courantes)
  'Hitpoint 3rd Div': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/8/86/Hitpoint_3rd_Div_2024.png',
  'Hitpoint 3rd Div 2024': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/8/86/Hitpoint_3rd_Div_2024.png',
  'Hitpoint 3rd Div 2025': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/8/86/Hitpoint_3rd_Div_2024.png',
  'Hitpoint 3rd Div Spring 2025': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/8/86/Hitpoint_3rd_Div_2024.png',
  'Hitpoint 3rd Div 2025 Spring': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/8/86/Hitpoint_3rd_Div_2024.png',
  // Ajout explicite Hitpoint 2nd Div (toutes variantes courantes)
  'Hitpoint 2nd Div': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/c/c6/Hitpoint_Challengers_2021.png',
  'Hitpoint 2nd Div 2024': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/c/c6/Hitpoint_Challengers_2021.png',
  'Hitpoint 2nd Div 2025': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/c/c6/Hitpoint_Challengers_2021.png',
  'Hitpoint 2nd Div Spring 2025': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/c/c6/Hitpoint_Challengers_2021.png',
  'Hitpoint 2nd Div 2025 Spring': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/c/c6/Hitpoint_Challengers_2021.png',
  'Hitpoint 2nd Div Challengers 2025 Spring': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/c/c6/Hitpoint_Challengers_2021.png',
  // Ajout explicite Good Game-ligaen (toutes variantes courantes)
  'Good Game-ligaen': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/a/a6/Good_Game-ligaen.png',
  'Good Game-ligaen 2024': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/a/a6/Good_Game-ligaen.png',
  'Good Game-ligaen 2025': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/a/a6/Good_Game-ligaen.png',
  'Good Game-ligaen Spring 2025': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/a/a6/Good_Game-ligaen.png',
  'Good Game-ligaen 2025 Spring': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/a/a6/Good_Game-ligaen.png',
  // Ajout explicite EBL (toutes variantes courantes)
  'EBL': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/3/3a/EBL_2021.png',
  'EBL 2024': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/3/3a/EBL_2021.png',
  'EBL 2025': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/3/3a/EBL_2021.png',
  'EBL Spring 2025': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/3/3a/EBL_2021.png',
  'EBL 2025 Spring': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/3/3a/EBL_2021.png',
  // Ajout explicite Create Your ArrMY (toutes variantes courantes)
  'Create Your ArrMY': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/2/26/ArrMY_logo.png',
  'Create Your ArrMY 2024': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/2/26/ArrMY_logo.png',
  'Create Your ArrMY 2025': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/2/26/ArrMY_logo.png',
  'Create Your ArrMY Spring 2025': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/2/26/ArrMY_logo.png',
  'Create Your ArrMY 2025 Spring': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/2/26/ArrMY_logo.png',
  // Ajout explicite CD (Circuito Desafiante) toutes variantes courantes
  'CD': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/9/9a/Circuito_Desafiante_logo.png',
  'Circuito Desafiante': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/9/9a/Circuito_Desafiante_logo.png',
  'Circuito Desafiante 2024': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/9/9a/Circuito_Desafiante_logo.png',
  'Circuito Desafiante 2025': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/9/9a/Circuito_Desafiante_logo.png',
  'CD 2024': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/9/9a/Circuito_Desafiante_logo.png',
  'CD 2025': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/9/9a/Circuito_Desafiante_logo.png',
  'CD 2025 Split 1': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/9/9a/Circuito_Desafiante_logo.png',
  // Ajout explicite Baron Kupa (toutes variantes courantes)
  'Baron Kupa': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/5/5b/Baron_Kupa.png',
  'Baron Kupa 2024': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/5/5b/Baron_Kupa.png',
  'Baron Kupa 2025': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/5/5b/Baron_Kupa.png',
  'Baron Kupa Spring 2025': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/5/5b/Baron_Kupa.png',
  'Baron Kupa 2025 Spring': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/5/5b/Baron_Kupa.png',
  // Ajout explicite Almost Pro Legends (toutes variantes courantes)
  'Almost Pro Legends': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/0/09/Almost_Pro_Legends_logo.png',
  'Almost Pro Legends 2024': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/0/09/Almost_Pro_Legends_logo.png',
  'Almost Pro Legends 2025': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/0/09/Almost_Pro_Legends_logo.png',
  'Almost Pro Legends Spring 2025': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/0/09/Almost_Pro_Legends_logo.png',
  'Almost Pro Legends 2025 Spring': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/0/09/Almost_Pro_Legends_logo.png',
  'Almost Pro Legends 2025 Spring Group Stage': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/0/09/Almost_Pro_Legends_logo.png',
  // Ajout explicite 4 nations (toutes variantes courantes)
  '4 nations': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/d/d3/UKEL_2023.png',
  '4 nations 2024': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/d/d3/UKEL_2023.png',
  '4 nations 2025': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/d/d3/UKEL_2023.png',
  '4 nations Spring 2025': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/d/d3/UKEL_2023.png',
  '4 nations 2025 Spring': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/d/d3/UKEL_2023.png',
  '4 Nations 2025 Spring': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/d/d3/UKEL_2023.png',
};

// Normalise le nom d'une équipe pour la recherche de fallback
function normalizeTeamName(name: string): string {
  // Supprime les caractères spéciaux et met en minuscules
  const normalized = name.toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace(/esports?/g, '')
    .replace(/gaming/g, '')
    .trim();
  
  // Map des alias connus
  const aliases: Record<string, string> = {
    'geng': 'gen.g',
    'dpk': 'dplus kia',
    'dk': 'dplus kia',
    'blg': 'bilibili gaming',
    'c9': 'cloud9',
    'tl': 'team liquid',
    '100t': '100 thieves',
    'kcorp': 'karmine corp',
    'karmineorp': 'karmine corp',
    'bds': 'team bds',
    'rge': 'rogue',
  };
  
  return aliases[normalized] || normalized;
}

// Normalise le nom d'une compétition pour matcher les clés de logos
function normalizeTournamentName(name: string): string {
  if (!name) return '';
  const lower = name.trim().toLowerCase();
  if (lower.includes('worlds')) return 'Worlds';
  if (lower.includes('lcs') && lower.includes('spring')) return 'LCS Spring 2025';
  if (lower.includes('lcs')) return 'LCS';
  // Ajoute ici d'autres règles si besoin
  return name;
}

/**
 * Sauvegarde une URL de logo dans Supabase
 */
async function saveLogoToCache(
  entityType: 'team' | 'tournament',
  name: string,
  logoUrl: string,
  isFallback: boolean = false
): Promise<void> {
  // Ne pas sauvegarder les fallbacks codés en dur
  if (isFallback) return;
  
  try {
    // Utiliser upsert pour éviter les conflits, mais ne pas inclure le champ updated_at
    // car il peut ne pas exister dans toutes les installations de Supabase
    const { error } = await supabase
      .from('assets')
      .upsert({
        entity_type: entityType,
        name,
        logo_url: logoUrl
      }, {
        onConflict: 'entity_type,name'
      });

    if (error) {
      console.warn('[Logo] Failed to save to cache:', error);
      return;
    }

    console.log(`[Logo] Saved to cache: ${name}`);
  } catch (error) {
    console.warn('[Logo] Error saving to cache:', error);
  }
}

// Vérifie si une URL est celle de Wikia/Fandom et la nettoie si nécessaire
function cleanWikiaUrl(url: string): string {
  if (!url) return url;
  
  // Si l'URL est déjà propre, la retourner telle quelle
  if (!url.includes('wikia.nocookie.net') && !url.includes('static.wikia.nocookie.net')) {
    return url;
  }
  
  try {
    // Nettoyer l'URL pour éviter les problèmes de cache et de redirection
    let cleanedUrl = url.replace(/^http:/, 'https:');
    
    // Pour les URLs Wikia, conserver la structure complète mais ajouter format=original
    if (!cleanedUrl.includes('format=original')) {
      // Si l'URL a déjà des paramètres, ajouter format=original
      if (cleanedUrl.includes('?')) {
        cleanedUrl += '&format=original';
      } else {
        // Si l'URL n'a pas de paramètres, ajouter format=original
        cleanedUrl += '?format=original';
      }
    }
    
    // Ajouter un timestamp pour éviter le cache
    cleanedUrl += `&t=${Date.now()}`;
    
    console.log(`[Logo] Cleaned Wikia URL from ${url} to ${cleanedUrl}`);
    return cleanedUrl;
  } catch (e) {
    console.error('[Logo] Error cleaning Wikia URL:', e);
    return url;
  }
}

export async function getLogo(
  entityType: 'team' | 'tournament',
  name: string,
  defaultLogo?: string
): Promise<string> {
  // LOGO PATCH: check explicit tournament mapping first
  if (entityType === 'tournament' && name && HARDCODED_TOURNAMENT_LOGOS[name]) {
    console.log('[LOGO DEBUG][HARDCODED_TOURNAMENT_LOGOS] match:', name, HARDCODED_TOURNAMENT_LOGOS[name]);
    return HARDCODED_TOURNAMENT_LOGOS[name];
  }
  // Si c'est une compétition connue, retourne le logo officiel lolesports
  if (entityType === 'tournament') {
    console.log('[LOGO DEBUG] tournament name:', name);
    // 1. Vérifie si la compétition est connue via getLeagueLogo (mapping LoLEsports officiel)
    const leaguepediaLogo = getLeagueLogo(name);
    if (leaguepediaLogo) {
      console.log('[LOGO DEBUG] getLeagueLogo match:', name, leaguepediaLogo);
      return leaguepediaLogo;
    }
    // 2. Correspondance exacte sur HARDCODED_LEAGUE_LOGOS
    if (HARDCODED_LEAGUE_LOGOS[name]) {
      let logoUrl = HARDCODED_LEAGUE_LOGOS[name];
      console.log('[LOGO DEBUG] HARDCODED_LEAGUE_LOGOS exact match:', name, logoUrl);
      return logoUrl;
    }
    // 3. Partial match HARDCODED_LEAGUE_LOGOS
    const baseName = Object.keys(HARDCODED_LEAGUE_LOGOS).find(key => name.includes(key));
    if (baseName) {
      console.log('[LOGO DEBUG] HARDCODED_LEAGUE_LOGOS partial match:', baseName, HARDCODED_LEAGUE_LOGOS[baseName]);
      return HARDCODED_LEAGUE_LOGOS[baseName];
    }
  }
  
  // Normalisation du nom pour les tournois
  const normalized = entityType === 'tournament' ? normalizeTournamentName(name) : name;

  // 1. Fallback logos (mapping local prioritaire)
  if (entityType === 'tournament' && FALLBACK_LOGOS[normalized]) {
    return FALLBACK_LOGOS[normalized];
  }
  // 2. Mapping assets/leagues/index.ts (si utilisé)
  // (optionnel selon ton flux)
  // 3. Mapping config/league-logos.ts (LEAGUE_LOGOS)
  try {
    const { getLeagueLogo } = await import('@/config/league-logos');
    const leagueLogo = getLeagueLogo(normalized);
    if (entityType === 'tournament' && leagueLogo) {
      return leagueLogo;
    }
  } catch (e) {
    // ignore si le mapping n'existe pas
  }
  // 4. Génération dynamique (API ou fallback générique)
  console.log(`[Logo] Fetching ${entityType} logo for: ${name}`);
  
  try {
    // Cas spécial : forcer le fallback pour Esprit Shōnen (avant le cache et l'API)
    if (entityType === 'team' && (name === 'Esprit Shōnen' || name === 'Esprit Shonen')) {
      console.warn(`[Logo][DEBUG] Fallback forcé pour Esprit Shōnen (bypass cache/API)`);
      return FALLBACK_LOGOS['Esprit Shōnen'] || FALLBACK_LOGOS['Esprit Shonen'];
    }
    
    // Cas spécial : forcer le fallback pour KIA.eSuba Academy et Gen.G Scholars (avant cache/API)
    if (entityType === 'team' && (name === 'KIA.eSuba Academy' || name === 'Gen.G Scholars')) {
      console.warn(`[Logo][DEBUG] Fallback forcé pour équipe spéciale (bypass cache/API): ${name}`);
      return FALLBACK_LOGOS[name];
    }
    
    // Cas spécial : forcer le fallback pour Dplus KIA Youth (avant cache/API)
    if (entityType === 'team' && name === 'Dplus KIA Youth') {
      console.warn(`[Logo][DEBUG] Fallback forcé pour Dplus KIA Youth (bypass cache/API)`);
      return FALLBACK_LOGOS['Dplus KIA Youth'];
    }
    
    // Cas spécial : forcer le fallback pour Ici Japon Corp. Esport (avant cache/API)
    if (entityType === 'team' && name === 'Ici Japon Corp. Esport') {
      console.warn(`[Logo][DEBUG] Fallback forcé pour Ici Japon Corp. Esport (bypass cache/API)`);
      return FALLBACK_LOGOS['Ici Japon Corp. Esport'];
    }
    
    // Cas spécial : forcer le fallback pour Vitality.Bee (avant cache/API)
    if (entityType === 'team' && name === 'Vitality.Bee') {
      console.warn(`[Logo][DEBUG] Fallback forcé pour Vitality.Bee (bypass cache/API)`);
      return FALLBACK_LOGOS['Vitality.Bee'];
    }
    
    // Cas spécial : forcer le fallback pour Barça eSports et Movistar KOI Fénix (avant cache/API)
    if (entityType === 'team' && (name === 'Barça eSports' || name === 'Movistar KOI' || name === 'Movistar KOI Fénix' || name === 'Movistar Riders')) {
      console.warn(`[Logo][DEBUG] Fallback forcé pour équipe spéciale (bypass cache/API): ${name}`);
      return FALLBACK_LOGOS['Movistar KOI'];
    }
    
    // Cas spécial : forcer le fallback pour Veni Vidi Vici (Spanish Team) et BK ROG Esports (avant cache/API)
    if (entityType === 'team' && (name === 'Veni Vidi Vici (Spanish Team)' || name === 'BK ROG Esports')) {
      console.warn(`[Logo][DEBUG] Fallback forcé pour équipe spéciale (bypass cache/API): ${name}`);
      return FALLBACK_LOGOS[name];
    }
    
    // Cas spécial : forcer le fallback pour Nongshim Esports Academy (avant cache/API)
    if (entityType === 'team' && name === 'Nongshim Esports Academy') {
      console.warn(`[Logo][DEBUG] Fallback forcé pour Nongshim Esports Academy (bypass cache/API)`);
      return FALLBACK_LOGOS['Nongshim Esports Academy'];
    }
    
    // Cas spécial pour Talon - vider le cache
    if (entityType === 'team' && name === 'Talon') {
      console.log(`[Logo] Clearing cache for Talon`);
      try {
        await supabase
          .from('assets')
          .delete()
          .eq('entity_type', 'team')
          .eq('name', 'Talon');
      } catch (error) {
        console.error('[Logo] Error clearing cache for Talon:', error);
      }
    }
    // Cas spécial pour Lyon - vider le cache
    if (entityType === 'team' && /lyon/i.test(name)) {
      console.log(`[Logo] Clearing cache for LYON: ${name}`);
      try {
        await supabase
          .from('assets')
          .delete()
          .eq('entity_type', 'team')
          .eq('name', name);
      } catch (error) {
        console.error('[Logo] Error clearing cache for Lyon:', error);
      }
    }
    // Cas spécial pour Rogue - vider le cache et loguer le nom reçu
    if (entityType === 'team' && /rogue/i.test(name)) {
      console.log(`[Logo][DEBUG] Nom reçu pour Rogue : ${name}`);
      console.log(`[Logo] Clearing cache for ROGUE: ${name}`);
      try {
        await supabase
          .from('assets')
          .delete()
          .eq('entity_type', 'team')
          .eq('name', name);
      } catch (error) {
        console.error('[Logo] Error clearing cache for Rogue:', error);
      }
    }
    // Log pour debug 100 Thieves
    if (entityType === 'team' && (/100/i.test(name) || /thieves/i.test(name))) {
      console.log(`[Logo][DEBUG] Nom reçu pour 100 Thieves : ${name}`);
    }
    // Debug : log le nom reçu pour Karmine Corp
    if (entityType === 'team' && /karmine/i.test(name)) {
      console.log(`[Logo][DEBUG] Nom reçu pour Karmine : ${name}`);
    }
    // Debug : log le nom reçu pour Esprit Shõnen
    if (entityType === 'team' && (/esprit/i.test(name) || /shonen/i.test(name) || /shõnen/i.test(name))) {
      console.log(`[Logo][DEBUG] Nom reçu pour Esprit Shõnen : ${name}`);
    }
    // Debug : log le nom reçu pour KIA.eSuba Academy et Gen.G Scholars
    if (entityType === 'team' && (/kia/i.test(name) || /suba/i.test(name) || /gen/i.test(name) || /schol/i.test(name))) {
      console.log(`[Logo][DEBUG] Nom reçu pour équipe spéciale : ${name}`);
    }
    
    // Cas spécial : forcer le fallback pour Ninjas in Pyjamas.CN (avant cache/API)
    if (entityType === 'team' && name === 'Ninjas in Pyjamas.CN') {
      console.warn(`[Logo][DEBUG] Fallback forcé pour Ninjas in Pyjamas.CN (bypass cache/API)`);
      return FALLBACK_LOGOS['Ninjas in Pyjamas.CN'];
    }
    
    // Cas spécial : forcer le fallback pour ThunderTalk Gaming (avant cache/API)
    if (entityType === 'team' && name === 'ThunderTalk Gaming') {
      console.warn(`[Logo][DEBUG] Fallback forcé pour ThunderTalk Gaming (bypass cache/API)`);
      return FALLBACK_LOGOS['ThunderTalk Gaming'];
    }
    
    // Cas spécial : forcer le fallback pour Team Vitality (avant cache/API)
    if (entityType === 'team' && name === 'Team Vitality') {
      console.warn(`[Logo][DEBUG] Fallback forcé pour Team Vitality (bypass cache/API)`);
      return FALLBACK_LOGOS['Team Vitality'];
    }
    
    // 1. Si c'est une compétition, vérifier si on peut générer son logo
    if (entityType === 'tournament' && isKnownLeague(name)) {
      const logoUrl = getLeagueLogo(name);
      if (logoUrl) {
        console.log(`[Logo] Generated logo URL for ${name}`);
        return logoUrl;
      }
    }

    // 2. Vérifier dans Supabase
    const { data: cachedLogo, error: cacheError } = await supabase
      .from('assets')
      .select('logo_url')
      .eq('entity_type', entityType)
      .eq('name', name)
      .maybeSingle();

    if (!cacheError && cachedLogo?.logo_url) {
      console.log(`[Logo] Cache hit for ${entityType} ${name}`);
      return cleanWikiaUrl(cachedLogo.logo_url);
    }
    
    console.log(`[Logo] Not in cache, fetching from API...`);

    // 3. Vérifier les logos connus en fallback
    if (entityType === 'team') {
      // Vérifier le nom exact
      if (FALLBACK_LOGOS[name]) {
        console.log(`[Logo] Using known fallback for ${name}`);
        return FALLBACK_LOGOS[name];
      }
      
      // Vérifier avec le nom normalisé
      const normalizedName = normalizeTeamName(name);
      const fallbackKey = Object.keys(FALLBACK_LOGOS).find(key => 
        normalizeTeamName(key) === normalizedName
      );
      
      if (fallbackKey) {
        console.log(`[Logo] Using fallback logo for ${name} (matched ${fallbackKey})`);
        return FALLBACK_LOGOS[fallbackKey];
      }
    }

    // Correction : Normalisation du nom pour les tournois
    if (entityType === 'tournament') {
      const normalized = normalizeTournamentName(name);
      if (FALLBACK_LOGOS[normalized]) {
        console.warn(`[Logo][DEBUG] Fallback logo for tournament (normalized): ${normalized}`);
        return FALLBACK_LOGOS[normalized];
      }
    }

    // 4. Si c'est une équipe, essayer l'API Leaguepedia
    if (entityType === 'team') {
      console.log(`[Logo] Fetching from Leaguepedia API for ${name}`);
      try {
        const logoUrl = await getTeamLogoUrl(name);
        
        if (logoUrl) {
          // Nettoyer l'URL si nécessaire
          const cleanedUrl = cleanWikiaUrl(logoUrl);
          
          // Sauvegarder dans Supabase pour la prochaine fois
          await saveLogoToCache(entityType, name, cleanedUrl);
          return cleanedUrl;
        }
      } catch (error) {
        console.error(`[Logo] API internal error for team ${name}:`, error);
      }
    }

    // 5. En dernier recours, utiliser le logo par défaut ou le fallback connu
    if ((name === 'Karmine Corp' || /karmine/i.test(name)) && FALLBACK_LOGOS['Karmine Corp']) {
      console.warn(`[Logo][DEBUG] Fallback forcé pour Karmine Corp`);
      return FALLBACK_LOGOS['Karmine Corp'];
    }
    if (name === '100 Thieves' && FALLBACK_LOGOS['100 Thieves']) {
      console.warn(`[Logo][DEBUG] Fallback forcé pour 100 Thieves`);
      return FALLBACK_LOGOS['100 Thieves'];
    }
    if (name === 'Esprit Shōnen' && FALLBACK_LOGOS['Esprit Shōnen']) {
      console.warn(`[Logo][DEBUG] Fallback forcé pour Esprit Shōnen`);
      return FALLBACK_LOGOS['Esprit Shōnen'];
    }
    if (/lyon/i.test(name)) {
      console.warn(`[Logo][DEBUG] Fallback utilisé pour LYON: ${name}`);
    }
    console.log(`[Logo] No logo found for ${name}, using default`);
    return defaultLogo || '/placeholder.svg';
    
  } catch (error) {
    console.error('[Logo] Error fetching logo:', error);
    return defaultLogo || '/placeholder.svg';
  }
}
