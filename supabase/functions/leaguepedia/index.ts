
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

    const resp = await fetch(url, {
      signal: controller.signal,
      headers: DEFAULT_HEADERS
    });
    clearTimeout(tid);

    const raw = await resp.text();
    console.error("[LP RAW]", raw);

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
  }

  try {
    // 4) Si on demande les infos d'une équipe
    if (typeof params.teamName === "string") {
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

      const imageFile = json?.cargoquery?.[0]?.title?.Image;
      console.log("[LP] Image filename from cargoquery:", imageFile);

      if (imageFile) {
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
        
        // Optimiser l'URL pour le chargement si c'est une URL Wikia
        if (logoUrl && (logoUrl.includes("wikia.nocookie.net") || logoUrl.includes("static.wikia.nocookie.net"))) {
          // S'assurer que l'URL utilise HTTPS
          logoUrl = logoUrl.replace(/^http:/, "https:");
          
          // Optimiser la taille de l'image pour éviter le problème de chargement
          if (logoUrl.includes("/revision/latest")) {
            logoUrl = logoUrl.replace("/revision/latest", "/revision/latest/scale-to-width-down/150");
          }
        }

        return new Response(JSON.stringify({
          cargoquery: [{
            title: {
              Name: params.teamName,
              Image: imageFile,
              logoUrl
            }
          }]
        }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      return new Response(JSON.stringify(json), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // 5) Sinon, on gère la requête de matchs
    const {
      action    = "cargoquery",
      format    = "json",
      tables    = "ScoreboardGames=SG,Tournaments=T",
      join_on   = "SG.Tournament=T.Name",
      fields    = "SG.Team1,SG.Team2,SG.Winner,SG.Team1Score,SG.Team2Score,T.Name=Tournament,T.Region,T.League",
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
        "T.IsQualifier=0",
        "T.IsPlayoffs=0"
      ].forEach(w => qs.append("where", w));
    }

    if (order_by) {
      qs.set("order_by", order_by);
    }

    console.log("[LP] Fetching games with params:", qs.toString());
    const json = await lpFetch(qs);

    return new Response(JSON.stringify(json), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
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
});
