// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

console.log("Hello from proxy-api!");

serve(async (req) => {
  try {
    // Récupérer l'URL à partir du corps de la requête
    const { url } = await req.json();
    
    if (!url) {
      return new Response(
        JSON.stringify({ error: "URL parameter is required" }),
        { headers: { "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    console.log(`Proxying request to: ${url}`);
    
    // Effectuer la requête à l'URL spécifiée
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Esport Arena Tracker/1.0",
        "Accept": "application/json",
      },
    });
    
    if (!response.ok) {
      console.error(`Error from API: ${response.status} ${response.statusText}`);
      return new Response(
        JSON.stringify({ error: `API responded with status ${response.status}` }),
        { headers: { "Content-Type": "application/json" }, status: response.status }
      );
    }
    
    // Récupérer les données de la réponse
    const data = await response.json();
    
    // Retourner les données au client
    return new Response(
      JSON.stringify(data),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in proxy-api:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { "Content-Type": "application/json" }, status: 500 }
    );
  }
});

// Pour activer cette fonction, exécutez:
// supabase functions deploy proxy-api
