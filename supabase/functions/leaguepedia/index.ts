import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const LEAGUEPEDIA_API_URL = "https://lol.fandom.com/api.php";

// CORS headers pour préflight et réponses
const corsHeaders = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
};

// Headers requis par Fandom/Cargo pour éviter les MWException
const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  "User-Agent":    "lovable-edge/1.0",
  "Origin":        "https://lol.fandom.com",
  "Referer":       "https://lol.fandom.com"
};

/**
 * Formatte le nom selon la convention Leaguepedia Teamnames
 */
function formatTeamLinkName(teamName: string): string {
  // Règles de base pour team link
  teamName = teamName.toLowerCase()
    .replace(/\s+esports?$/i, '')
    .replace(/\s+gaming$/i, '')
    .replace(/^team\s+/i, '')
    .replace(/[.\s']/g, '')
    .replace(/&/g, 'and');
  
  // Cas spéciaux fréquents
  const specialCases: Record<string, string> = {
    'g2': 'g2',
    'fnatic': 'fnc',
    'rogue': 'rogue_(european_team)', // Correction pour Rogue
    'karmineorp': 'karmine_corp', // Correction pour Karmine Corp
    'kcorp': 'karmine_corp', // Correction pour K-Corp
    'excellondon': 'xl',
    'madlions': 'mad',
    'teamliquid': 'tl',
    'cloud9': 'c9',
    'skgaming': 'sk',
    '100thieves': '100',
    'talon': 'talon_(hong_kong_team)' // Correction pour Talon
  };
  
  for (const [key, value] of Object.entries(specialCases)) {
    if (teamName.includes(key)) {
      return value;
    }
  }
  
  return teamName.length <= 4 ? teamName : teamName.substring(0, 4);
}

serve(async (req) => {
  // 1) CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // 2) Parser le JSON body et extraire params
  let params: Record<string, any> = {};
  try {
    const { params: p } = await req.json();
    params = p ?? {};
  } catch {
    params = {};
  }

  // 3) Helper pour appeler Leaguepedia + logging raw + gestion d'erreur
  async function lpFetch(qs: URLSearchParams) {
    const url = `${LEAGUEPEDIA_API_URL}?${qs.toString()}`;
    const controller = new AbortController();
    const tid = setTimeout(() => controller.abort(), 5000);

    try {
      console.log("[LP] Sending request to:", url);
      
      const resp = await fetch(url, {
        signal: controller.signal,
        headers: DEFAULT_HEADERS
      });
      clearTimeout(tid);

      const raw = await resp.text();
      console.log("[LP RAW]", raw);

      let json: any;
      try {
        json = JSON.parse(raw);
      } catch (e) {
        console.error("[LP PARSE FAILED]", raw);
        throw e;
      }

      if (json.error) {
        console.error("[LP API ERROR]", json.error);
        return { error: json.error, cargoquery: [] };
      }

      return json;
    } catch (e) {
      clearTimeout(tid);
      console.error("[LP FETCH ERROR]", e.message);
      return { error: { message: e.message }, cargoquery: [] };
    }
  }

  try {
    // 4) Si on demande les infos d'une équipe
    if (typeof params.teamName === "string") {
      // Cas spéciaux pour certaines équipes problématiques
      const directMappings: Record<string, string> = {
        "Karmine Corp": "https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/2/2d/Karmine_Corplogo_square.png?format=original",
        "Rogue": "https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/a/a4/Rogue_%28European_Team%29logo_square.png?format=original",
        "Talon": "https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/6/66/TALON_%28Hong_Kong_Team%29logo_profile.png?format=original",
        "Rogue (European Team)": "https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/a/a4/Rogue_%28European_Team%29logo_square.png?format=original",
        "TALON (Hong Kong Team)": "https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/6/66/TALON_%28Hong_Kong_Team%29logo_profile.png?format=original"
      };
      
      if (directMappings[params.teamName]) {
        console.log(`[LP] Direct URL mapping for ${params.teamName}`);
        return new Response(JSON.stringify({
          cargoquery: [{
            title: {
              Name: params.teamName,
              Image: "",
              logoUrl: directMappings[params.teamName],
              Short: formatTeamLinkName(params.teamName)
            }
          }]
        }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
      
      const teamQs = new URLSearchParams({
        action:        "cargoquery",
        format:        "json",
        formatversion: "2",
        tables:        "Teams",
        fields:        "Name,Short,Region,League,Image",
        limit:         "1",
        where:         `Name=\"${params.teamName}\"`
      });

      console.log("[LP] Fetching team info for:", params.teamName);
      const json = await lpFetch(teamQs);

      // Si nous avons des données, mais pas d'image
      const teamData = json?.cargoquery?.[0]?.title;
      const imageFile = teamData?.Image;
      
      // Générer des noms de fichiers alternatifs si l'image n'est pas trouvée
      if (!imageFile || imageFile === "") {
        // Essayer la convention teamLink
        const teamShort = teamData?.Short || "";
        const teamLink = teamShort ? teamShort.toLowerCase() : formatTeamLinkName(params.teamName);
        
        // Essayer plusieurs formats de fichiers
        const possibleFiles = [
          `${teamLink}logo_square.png`,
          `${teamLink}_logo_square.png`,
          `${teamLink}logo.png`,
          // Formats spéciaux pour les équipes avec régions
          `${teamLink}_(European_Team)logo_square.png`,
          `${teamLink}_(Hong_Kong_Team)logo_profile.png`
        ];
        
        for (const filename of possibleFiles) {
          console.log("[LP] Trying alternative filename:", filename);
          
          const imageQs = new URLSearchParams({
            action:        "query",
            format:        "json",
            formatversion: "2",
            titles:        `File:${filename}`,
            prop:          "imageinfo",
            iiprop:        "url"
          });
          
          const imgJson = await lpFetch(imageQs);
          const page = Object.values(imgJson?.query?.pages || {})[0] as any;
          
          if (page && !page.missing) {
            let logoUrl = page?.imageinfo?.[0]?.url;
            console.log("[LP] Found alternative logo:", logoUrl);
            
            // Optimiser l'URL pour le chargement
            if (logoUrl) {
              logoUrl = logoUrl.replace(/^http:/, "https:");
              
              // Ajouter des paramètres pour éviter les problèmes de cache
              if (logoUrl.includes("/revision/latest")) {
                logoUrl = logoUrl.split('/revision/')[0] + `?format=original&nocache=${Date.now()}`;
              }
              
              return new Response(JSON.stringify({
                cargoquery: [{
                  title: {
                    Name: params.teamName,
                    Image: filename,
                    logoUrl,
                    Short: teamShort || teamLink
                  }
                }]
              }), {
                status: 200,
                headers: { ...corsHeaders, "Content-Type": "application/json" }
              });
            }
          }
        }
      } else {
        console.log("[LP LOGO FILE] Retrieved from cargo:", imageFile);
        
        // Procéder normalement avec le fichier Image trouvé
        const imageQs = new URLSearchParams({
          action:        "query",
          format:        "json",
          formatversion: "2",
          titles:        `File:${imageFile}`,
          prop:          "imageinfo",
          iiprop:        "url"
        });

        const imgJson = await lpFetch(imageQs);
        const page = Object.values(imgJson?.query?.pages || {})[0] as any;
        let logoUrl = page?.imageinfo?.[0]?.url;

        console.log("[LP LOGO URL] Retrieved for", params.teamName + ":", logoUrl);
        
        // Optimiser l'URL
        if (logoUrl) {
          logoUrl = logoUrl.replace(/^http:/, "https:");
          
          if (logoUrl.includes("/revision/latest")) {
            logoUrl = logoUrl.split('/revision/')[0] + `?format=original&nocache=${Date.now()}`;
          }
          
          return new Response(JSON.stringify({
            cargoquery: [{
              title: {
                ...teamData,
                logoUrl
              }
            }]
          }), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
      }

      // Si on arrive ici, on n'a pas trouvé de logo spécifique
      return new Response(JSON.stringify(json), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // 5) Si on veut une requête directe de matchs à venir (format exact demandé)
    if (params.directMatchQuery === true) {
      console.log("[LP] Using direct match query approach");
      
      // Construire l'URL exactement comme suggéré
      const matchQs = new URLSearchParams({
        action: "cargoquery",
        format: "json",
        formatversion: "2",
        tables: "MatchScheduleGame=MSG,MatchSchedule=MS",
        join_on: "MSG.MatchId=MS.MatchId",
        fields: "MSG.Team1,MSG.Team2,MS.OverviewPage,MS.DateTime_UTC=DateTime,MS.Tournament,MS.BestOf",
        where: "MS.DateTime_UTC>NOW()",
        order_by: "MS.DateTime_UTC",
        limit: params.limit || "5"
      });

      if (params.tournamentFilter) {
        matchQs.set("where", `MS.DateTime_UTC>NOW() AND MS.Tournament="${params.tournamentFilter}"`);
      }

      console.log("[LP] Direct match query params:", matchQs.toString());
      const json = await lpFetch(matchQs);
      
      return new Response(JSON.stringify(json), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // 6) Si on veut les prochains matchs (format demandé par l'utilisateur)
    if (params.upcomingMatches === true) {
      console.log("[LP] Fetching upcoming matches with new format");
      
      // Ajouter filtre de tournoi si nécessaire
      let whereClause = "MS.DateTime_UTC>NOW()";
      if (params.tournamentFilter) {
        whereClause += ` AND MS.Tournament="${params.tournamentFilter}"`;
      }
      
      const matchQs = new URLSearchParams({
        action: "cargoquery",
        format: "json",
        formatversion: "2",
        tables: "MatchScheduleGame=MSG,MatchSchedule=MS",
        join_on: "MSG.MatchId=MS.MatchId",
        fields: "MSG.Team1,MSG.Team2,MS.OverviewPage,MS.DateTime_UTC=DateTime,MS.Tournament,MS.BestOf",
        where: whereClause,
        order_by: "MS.DateTime_UTC",
        limit: params.limit || "5"
      });

      console.log("[LP] Upcoming matches query:", matchQs.toString());
      const json = await lpFetch(matchQs);
      
      if (json.error || !json.cargoquery || json.cargoquery.length === 0) {
        console.error("[LP] Error or no results from upcoming matches query, trying backup method");
        // Si la requête échoue, essayer une autre méthode
        return await handleLegacyMatchRequest(params);
      }
      
      return new Response(JSON.stringify(json), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // 7) Si on reçoit directement des paramètres de requête standard (action, format, tables, etc.)
    if (params.action === "cargoquery") {
      console.log("[LP] Processing direct CargoQuery params");
      
      const directQs = new URLSearchParams();
      
      // Transférer tous les paramètres directement
      for (const [key, value] of Object.entries(params)) {
        if (Array.isArray(value)) {
          for (const item of value) {
            directQs.append(key, item);
          }
        } else if (value !== undefined && value !== null) {
          directQs.append(key, value.toString());
        }
      }
      
      console.log("[LP] Direct params query:", directQs.toString());
      const json = await lpFetch(directQs);
      
      return new Response(JSON.stringify(json), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // 8) Sinon, on gère la requête de matchs avec l'ancienne format
    return await handleLegacyMatchRequest(params);
    
  } catch (e: any) {
    console.error("[LP UNEXPECTED ERROR]", e);
    return new Response(JSON.stringify({
      error: e.message,
      cargoquery: []
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
  
  // Méthode de secours pour gérer les requêtes avec l'ancien format
  async function handleLegacyMatchRequest(params: Record<string, any>) {
    const {
      action    = "cargoquery",
      format    = "json",
      tables    = "ScoreboardGames=SG,Tournaments=T",
      join_on   = "SG.Tournament=T.Name",
      fields    = "SG.Team1,SG.Team2,SG.Winner,SG.Team1Score,SG.Team2Score,T.Name=Tournament,T.Region,T.League,SG.DateTime_UTC=DateTime",
      limit     = "10",
      where,
      order_by
    } = params;

    const qs = new URLSearchParams({
      action,
      format,
      formatversion: "2",
      tables,
      join_on,
      fields,
      limit
    });

    if (where) {
      (Array.isArray(where) ? where : [where]).forEach(w => qs.append("where", w));
    } else {
      [
        `SG.DateTime_UTC >= \"${new Date().toISOString()}\"`,
        "T.IsQualifier=0"
      ].forEach(w => qs.append("where", w));
    }

    if (order_by) {
      qs.set("order_by", order_by);
    } else {
      qs.set("order_by", "SG.DateTime_UTC ASC");
    }

    console.log("[LP] Fetching games with params:", qs.toString());
    const json = await lpFetch(qs);

    return new Response(JSON.stringify(json), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
