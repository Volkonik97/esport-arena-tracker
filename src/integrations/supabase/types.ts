export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      assets: {
        Row: {
          created_at: string | null
          entity_type: string
          id: string
          logo_url: string
          name: string
        }
        Insert: {
          created_at?: string | null
          entity_type: string
          id?: string
          logo_url: string
          name: string
        }
        Update: {
          created_at?: string | null
          entity_type?: string
          id?: string
          logo_url?: string
          name?: string
        }
        Relationships: []
      }
      data_updates: {
        Row: {
          id: number
          updated_at: string
        }
        Insert: {
          id?: number
          updated_at?: string
        }
        Update: {
          id?: number
          updated_at?: string
        }
        Relationships: []
      }
      matches: {
        Row: {
          date: string | null
          firstbaron_team_id: string | null
          firstblood_team_id: string | null
          firstdragon_team_id: string | null
          firsttower_team_id: string | null
          game_number: number | null
          gameid: string
          gamelength: number | null
          patch: string | null
          playoffs: boolean | null
          split: string | null
          team1_id: string | null
          team1_name: string | null
          team2_id: string | null
          team2_name: string | null
          total_assists: number | null
          total_deaths: number | null
          total_kills: number | null
          total_towers: number | null
          tournament: string | null
          winner_team_id: string | null
          winner_team_name: string | null
          year: number | null
        }
        Insert: {
          date?: string | null
          firstbaron_team_id?: string | null
          firstblood_team_id?: string | null
          firstdragon_team_id?: string | null
          firsttower_team_id?: string | null
          game_number?: number | null
          gameid: string
          gamelength?: number | null
          patch?: string | null
          playoffs?: boolean | null
          split?: string | null
          team1_id?: string | null
          team1_name?: string | null
          team2_id?: string | null
          team2_name?: string | null
          total_assists?: number | null
          total_deaths?: number | null
          total_kills?: number | null
          total_towers?: number | null
          tournament?: string | null
          winner_team_id?: string | null
          winner_team_name?: string | null
          year?: number | null
        }
        Update: {
          date?: string | null
          firstbaron_team_id?: string | null
          firstblood_team_id?: string | null
          firstdragon_team_id?: string | null
          firsttower_team_id?: string | null
          game_number?: number | null
          gameid?: string
          gamelength?: number | null
          patch?: string | null
          playoffs?: boolean | null
          split?: string | null
          team1_id?: string | null
          team1_name?: string | null
          team2_id?: string | null
          team2_name?: string | null
          total_assists?: number | null
          total_deaths?: number | null
          total_kills?: number | null
          total_towers?: number | null
          tournament?: string | null
          winner_team_id?: string | null
          winner_team_name?: string | null
          year?: number | null
        }
        Relationships: []
      }
      player_match_stats: {
        Row: {
          assists: number | null
          assistsat10: number | null
          assistsat15: number | null
          assistsat20: number | null
          assistsat25: number | null
          champion: string | null
          controlwardsbought: number | null
          cs: number | null
          csat10: number | null
          csat15: number | null
          csat20: number | null
          csat25: number | null
          csdiffat10: number | null
          csdiffat15: number | null
          csdiffat20: number | null
          csdiffat25: number | null
          cspm: number | null
          damagemitigatedperminute: number | null
          damageshare: number | null
          damagetakenperminute: number | null
          damagetochampions: number | null
          deaths: number | null
          deathsat10: number | null
          deathsat15: number | null
          deathsat20: number | null
          deathsat25: number | null
          doublekills: number | null
          dpm: number | null
          "earned gpm": number | null
          earnedgold: number | null
          earnedgoldshare: number | null
          firstbloodassist: number | null
          firstbloodkill: number | null
          firstbloodvictim: number | null
          gold: number | null
          goldat10: number | null
          goldat15: number | null
          goldat20: number | null
          goldat25: number | null
          golddiffat10: number | null
          golddiffat15: number | null
          golddiffat20: number | null
          golddiffat25: number | null
          goldspent: number | null
          id: number
          kills: number | null
          killsat10: number | null
          killsat15: number | null
          killsat20: number | null
          killsat25: number | null
          match_id: string | null
          minionkills: number | null
          monsterkills: number | null
          participantid: number | null
          pentakills: number | null
          player_id: string | null
          position: string | null
          quadrakills: number | null
          side: string | null
          team_id: string | null
          triplekills: number | null
          visionscore: number | null
          vspm: number | null
          wardskilled: number | null
          wardsplaced: number | null
          wcpm: number | null
          wpm: number | null
          xpat10: number | null
          xpat15: number | null
          xpat20: number | null
          xpat25: number | null
          xpdiffat10: number | null
          xpdiffat15: number | null
          xpdiffat20: number | null
          xpdiffat25: number | null
        }
        Insert: {
          assists?: number | null
          assistsat10?: number | null
          assistsat15?: number | null
          assistsat20?: number | null
          assistsat25?: number | null
          champion?: string | null
          controlwardsbought?: number | null
          cs?: number | null
          csat10?: number | null
          csat15?: number | null
          csat20?: number | null
          csat25?: number | null
          csdiffat10?: number | null
          csdiffat15?: number | null
          csdiffat20?: number | null
          csdiffat25?: number | null
          cspm?: number | null
          damagemitigatedperminute?: number | null
          damageshare?: number | null
          damagetakenperminute?: number | null
          damagetochampions?: number | null
          deaths?: number | null
          deathsat10?: number | null
          deathsat15?: number | null
          deathsat20?: number | null
          deathsat25?: number | null
          doublekills?: number | null
          dpm?: number | null
          "earned gpm"?: number | null
          earnedgold?: number | null
          earnedgoldshare?: number | null
          firstbloodassist?: number | null
          firstbloodkill?: number | null
          firstbloodvictim?: number | null
          gold?: number | null
          goldat10?: number | null
          goldat15?: number | null
          goldat20?: number | null
          goldat25?: number | null
          golddiffat10?: number | null
          golddiffat15?: number | null
          golddiffat20?: number | null
          golddiffat25?: number | null
          goldspent?: number | null
          id?: number
          kills?: number | null
          killsat10?: number | null
          killsat15?: number | null
          killsat20?: number | null
          killsat25?: number | null
          match_id?: string | null
          minionkills?: number | null
          monsterkills?: number | null
          participantid?: number | null
          pentakills?: number | null
          player_id?: string | null
          position?: string | null
          quadrakills?: number | null
          side?: string | null
          team_id?: string | null
          triplekills?: number | null
          visionscore?: number | null
          vspm?: number | null
          wardskilled?: number | null
          wardsplaced?: number | null
          wcpm?: number | null
          wpm?: number | null
          xpat10?: number | null
          xpat15?: number | null
          xpat20?: number | null
          xpat25?: number | null
          xpdiffat10?: number | null
          xpdiffat15?: number | null
          xpdiffat20?: number | null
          xpdiffat25?: number | null
        }
        Update: {
          assists?: number | null
          assistsat10?: number | null
          assistsat15?: number | null
          assistsat20?: number | null
          assistsat25?: number | null
          champion?: string | null
          controlwardsbought?: number | null
          cs?: number | null
          csat10?: number | null
          csat15?: number | null
          csat20?: number | null
          csat25?: number | null
          csdiffat10?: number | null
          csdiffat15?: number | null
          csdiffat20?: number | null
          csdiffat25?: number | null
          cspm?: number | null
          damagemitigatedperminute?: number | null
          damageshare?: number | null
          damagetakenperminute?: number | null
          damagetochampions?: number | null
          deaths?: number | null
          deathsat10?: number | null
          deathsat15?: number | null
          deathsat20?: number | null
          deathsat25?: number | null
          doublekills?: number | null
          dpm?: number | null
          "earned gpm"?: number | null
          earnedgold?: number | null
          earnedgoldshare?: number | null
          firstbloodassist?: number | null
          firstbloodkill?: number | null
          firstbloodvictim?: number | null
          gold?: number | null
          goldat10?: number | null
          goldat15?: number | null
          goldat20?: number | null
          goldat25?: number | null
          golddiffat10?: number | null
          golddiffat15?: number | null
          golddiffat20?: number | null
          golddiffat25?: number | null
          goldspent?: number | null
          id?: number
          kills?: number | null
          killsat10?: number | null
          killsat15?: number | null
          killsat20?: number | null
          killsat25?: number | null
          match_id?: string | null
          minionkills?: number | null
          monsterkills?: number | null
          participantid?: number | null
          pentakills?: number | null
          player_id?: string | null
          position?: string | null
          quadrakills?: number | null
          side?: string | null
          team_id?: string | null
          triplekills?: number | null
          visionscore?: number | null
          vspm?: number | null
          wardskilled?: number | null
          wardsplaced?: number | null
          wcpm?: number | null
          wpm?: number | null
          xpat10?: number | null
          xpat15?: number | null
          xpat20?: number | null
          xpat25?: number | null
          xpdiffat10?: number | null
          xpdiffat15?: number | null
          xpdiffat20?: number | null
          xpdiffat25?: number | null
        }
        Relationships: []
      }
      players: {
        Row: {
          avg_assists: number | null
          avg_csdiffat10: number | null
          avg_csdiffat15: number | null
          avg_csdiffat20: number | null
          avg_csdiffat25: number | null
          avg_deaths: number | null
          avg_double_kills: number | null
          avg_firstblood_assist: number | null
          avg_firstblood_kill: number | null
          avg_firstblood_victim: number | null
          avg_golddiffat10: number | null
          avg_golddiffat15: number | null
          avg_golddiffat20: number | null
          avg_golddiffat25: number | null
          avg_kills: number | null
          avg_penta_kills: number | null
          avg_quadra_kills: number | null
          avg_triple_kills: number | null
          avg_xpdiffat10: number | null
          avg_xpdiffat15: number | null
          avg_xpdiffat20: number | null
          avg_xpdiffat25: number | null
          champion_pool: number | null
          control_wards_bought: number | null
          cspm: number | null
          damage_share: number | null
          dpm: number | null
          earned_gold_share: number | null
          earned_gpm: number | null
          image: string | null
          kda: number | null
          playerid: string
          playername: string | null
          position: string | null
          teamid: string | null
          total_cs: number | null
          totalgold: number | null
          vspm: number | null
          wcpm: number | null
        }
        Insert: {
          avg_assists?: number | null
          avg_csdiffat10?: number | null
          avg_csdiffat15?: number | null
          avg_csdiffat20?: number | null
          avg_csdiffat25?: number | null
          avg_deaths?: number | null
          avg_double_kills?: number | null
          avg_firstblood_assist?: number | null
          avg_firstblood_kill?: number | null
          avg_firstblood_victim?: number | null
          avg_golddiffat10?: number | null
          avg_golddiffat15?: number | null
          avg_golddiffat20?: number | null
          avg_golddiffat25?: number | null
          avg_kills?: number | null
          avg_penta_kills?: number | null
          avg_quadra_kills?: number | null
          avg_triple_kills?: number | null
          avg_xpdiffat10?: number | null
          avg_xpdiffat15?: number | null
          avg_xpdiffat20?: number | null
          avg_xpdiffat25?: number | null
          champion_pool?: number | null
          control_wards_bought?: number | null
          cspm?: number | null
          damage_share?: number | null
          dpm?: number | null
          earned_gold_share?: number | null
          earned_gpm?: number | null
          image?: string | null
          kda?: number | null
          playerid: string
          playername?: string | null
          position?: string | null
          teamid?: string | null
          total_cs?: number | null
          totalgold?: number | null
          vspm?: number | null
          wcpm?: number | null
        }
        Update: {
          avg_assists?: number | null
          avg_csdiffat10?: number | null
          avg_csdiffat15?: number | null
          avg_csdiffat20?: number | null
          avg_csdiffat25?: number | null
          avg_deaths?: number | null
          avg_double_kills?: number | null
          avg_firstblood_assist?: number | null
          avg_firstblood_kill?: number | null
          avg_firstblood_victim?: number | null
          avg_golddiffat10?: number | null
          avg_golddiffat15?: number | null
          avg_golddiffat20?: number | null
          avg_golddiffat25?: number | null
          avg_kills?: number | null
          avg_penta_kills?: number | null
          avg_quadra_kills?: number | null
          avg_triple_kills?: number | null
          avg_xpdiffat10?: number | null
          avg_xpdiffat15?: number | null
          avg_xpdiffat20?: number | null
          avg_xpdiffat25?: number | null
          champion_pool?: number | null
          control_wards_bought?: number | null
          cspm?: number | null
          damage_share?: number | null
          dpm?: number | null
          earned_gold_share?: number | null
          earned_gpm?: number | null
          image?: string | null
          kda?: number | null
          playerid?: string
          playername?: string | null
          position?: string | null
          teamid?: string | null
          total_cs?: number | null
          totalgold?: number | null
          vspm?: number | null
          wcpm?: number | null
        }
        Relationships: []
      }
      raw_oracle_matches: {
        Row: {
          assists: number | null
          assistsat10: number | null
          assistsat15: number | null
          assistsat20: number | null
          assistsat25: number | null
          ban1: string | null
          ban2: string | null
          ban3: string | null
          ban4: string | null
          ban5: string | null
          barons: number | null
          champion: string | null
          chemtechs: number | null
          ckpm: number | null
          clouds: number | null
          controlwardsbought: number | null
          csat10: number | null
          csat15: number | null
          csat20: number | null
          csat25: number | null
          csdiffat10: number | null
          csdiffat15: number | null
          csdiffat20: number | null
          csdiffat25: number | null
          cspm: number | null
          damagemitigatedperminute: number | null
          damageshare: number | null
          damagetakenperminute: number | null
          damagetochampions: number | null
          datacompleteness: string | null
          date: string | null
          deaths: number | null
          deathsat10: number | null
          deathsat15: number | null
          deathsat20: number | null
          deathsat25: number | null
          doublekills: number | null
          dpm: number | null
          dragons: number | null
          "dragons (type unknown)": number | null
          "earned gpm": number | null
          earnedgold: number | null
          earnedgoldshare: number | null
          elders: number | null
          elementaldrakes: number | null
          firstbaron: number | null
          firstblood: number | null
          firstbloodassist: number | null
          firstbloodkill: number | null
          firstbloodvictim: number | null
          firstdragon: number | null
          firstherald: number | null
          firstmidtower: number | null
          firsttothreetowers: number | null
          firsttower: number | null
          game: number | null
          gameid: string | null
          gamelength: number | null
          goldat10: number | null
          goldat15: number | null
          goldat20: number | null
          goldat25: number | null
          golddiffat10: number | null
          golddiffat15: number | null
          golddiffat20: number | null
          golddiffat25: number | null
          goldspent: number | null
          gpr: number | null
          gspd: number | null
          heralds: number | null
          hextechs: number | null
          infernals: number | null
          inhibitors: number | null
          kills: number | null
          killsat10: number | null
          killsat15: number | null
          killsat20: number | null
          killsat25: number | null
          league: string | null
          minionkills: number | null
          monsterkills: number | null
          monsterkillsenemyjungle: number | null
          monsterkillsownjungle: number | null
          mountains: number | null
          oceans: number | null
          opp_assistsat10: number | null
          opp_assistsat15: number | null
          opp_assistsat20: number | null
          opp_assistsat25: number | null
          opp_barons: number | null
          opp_csat10: number | null
          opp_csat15: number | null
          opp_csat20: number | null
          opp_csat25: number | null
          opp_deathsat10: number | null
          opp_deathsat15: number | null
          opp_deathsat20: number | null
          opp_deathsat25: number | null
          opp_dragons: number | null
          opp_elders: number | null
          opp_elementaldrakes: number | null
          opp_goldat10: number | null
          opp_goldat15: number | null
          opp_goldat20: number | null
          opp_goldat25: number | null
          opp_heralds: number | null
          opp_inhibitors: number | null
          opp_killsat10: number | null
          opp_killsat15: number | null
          opp_killsat20: number | null
          opp_killsat25: number | null
          opp_towers: number | null
          opp_turretplates: number | null
          opp_void_grubs: number | null
          opp_xpat10: number | null
          opp_xpat15: number | null
          opp_xpat20: number | null
          opp_xpat25: number | null
          participantid: number | null
          patch: number | null
          pentakills: number | null
          pick1: string | null
          pick2: string | null
          pick3: string | null
          pick4: string | null
          pick5: string | null
          playerid: string | null
          playername: string | null
          playoffs: number | null
          position: string | null
          quadrakills: number | null
          result: number | null
          side: string | null
          split: string | null
          "team kpm": number | null
          teamdeaths: number | null
          teamid: string | null
          teamkills: number | null
          teamname: string | null
          "total cs": number | null
          totalgold: number | null
          towers: number | null
          triplekills: number | null
          turretplates: number | null
          url: string | null
          visionscore: number | null
          void_grubs: number | null
          vspm: number | null
          wardskilled: number | null
          wardsplaced: number | null
          wcpm: number | null
          wpm: number | null
          xpat10: number | null
          xpat15: number | null
          xpat20: number | null
          xpat25: number | null
          xpdiffat10: number | null
          xpdiffat15: number | null
          xpdiffat20: number | null
          xpdiffat25: number | null
          year: number | null
        }
        Insert: {
          assists?: number | null
          assistsat10?: number | null
          assistsat15?: number | null
          assistsat20?: number | null
          assistsat25?: number | null
          ban1?: string | null
          ban2?: string | null
          ban3?: string | null
          ban4?: string | null
          ban5?: string | null
          barons?: number | null
          champion?: string | null
          chemtechs?: number | null
          ckpm?: number | null
          clouds?: number | null
          controlwardsbought?: number | null
          csat10?: number | null
          csat15?: number | null
          csat20?: number | null
          csat25?: number | null
          csdiffat10?: number | null
          csdiffat15?: number | null
          csdiffat20?: number | null
          csdiffat25?: number | null
          cspm?: number | null
          damagemitigatedperminute?: number | null
          damageshare?: number | null
          damagetakenperminute?: number | null
          damagetochampions?: number | null
          datacompleteness?: string | null
          date?: string | null
          deaths?: number | null
          deathsat10?: number | null
          deathsat15?: number | null
          deathsat20?: number | null
          deathsat25?: number | null
          doublekills?: number | null
          dpm?: number | null
          dragons?: number | null
          "dragons (type unknown)"?: number | null
          "earned gpm"?: number | null
          earnedgold?: number | null
          earnedgoldshare?: number | null
          elders?: number | null
          elementaldrakes?: number | null
          firstbaron?: number | null
          firstblood?: number | null
          firstbloodassist?: number | null
          firstbloodkill?: number | null
          firstbloodvictim?: number | null
          firstdragon?: number | null
          firstherald?: number | null
          firstmidtower?: number | null
          firsttothreetowers?: number | null
          firsttower?: number | null
          game?: number | null
          gameid?: string | null
          gamelength?: number | null
          goldat10?: number | null
          goldat15?: number | null
          goldat20?: number | null
          goldat25?: number | null
          golddiffat10?: number | null
          golddiffat15?: number | null
          golddiffat20?: number | null
          golddiffat25?: number | null
          goldspent?: number | null
          gpr?: number | null
          gspd?: number | null
          heralds?: number | null
          hextechs?: number | null
          infernals?: number | null
          inhibitors?: number | null
          kills?: number | null
          killsat10?: number | null
          killsat15?: number | null
          killsat20?: number | null
          killsat25?: number | null
          league?: string | null
          minionkills?: number | null
          monsterkills?: number | null
          monsterkillsenemyjungle?: number | null
          monsterkillsownjungle?: number | null
          mountains?: number | null
          oceans?: number | null
          opp_assistsat10?: number | null
          opp_assistsat15?: number | null
          opp_assistsat20?: number | null
          opp_assistsat25?: number | null
          opp_barons?: number | null
          opp_csat10?: number | null
          opp_csat15?: number | null
          opp_csat20?: number | null
          opp_csat25?: number | null
          opp_deathsat10?: number | null
          opp_deathsat15?: number | null
          opp_deathsat20?: number | null
          opp_deathsat25?: number | null
          opp_dragons?: number | null
          opp_elders?: number | null
          opp_elementaldrakes?: number | null
          opp_goldat10?: number | null
          opp_goldat15?: number | null
          opp_goldat20?: number | null
          opp_goldat25?: number | null
          opp_heralds?: number | null
          opp_inhibitors?: number | null
          opp_killsat10?: number | null
          opp_killsat15?: number | null
          opp_killsat20?: number | null
          opp_killsat25?: number | null
          opp_towers?: number | null
          opp_turretplates?: number | null
          opp_void_grubs?: number | null
          opp_xpat10?: number | null
          opp_xpat15?: number | null
          opp_xpat20?: number | null
          opp_xpat25?: number | null
          participantid?: number | null
          patch?: number | null
          pentakills?: number | null
          pick1?: string | null
          pick2?: string | null
          pick3?: string | null
          pick4?: string | null
          pick5?: string | null
          playerid?: string | null
          playername?: string | null
          playoffs?: number | null
          position?: string | null
          quadrakills?: number | null
          result?: number | null
          side?: string | null
          split?: string | null
          "team kpm"?: number | null
          teamdeaths?: number | null
          teamid?: string | null
          teamkills?: number | null
          teamname?: string | null
          "total cs"?: number | null
          totalgold?: number | null
          towers?: number | null
          triplekills?: number | null
          turretplates?: number | null
          url?: string | null
          visionscore?: number | null
          void_grubs?: number | null
          vspm?: number | null
          wardskilled?: number | null
          wardsplaced?: number | null
          wcpm?: number | null
          wpm?: number | null
          xpat10?: number | null
          xpat15?: number | null
          xpat20?: number | null
          xpat25?: number | null
          xpdiffat10?: number | null
          xpdiffat15?: number | null
          xpdiffat20?: number | null
          xpdiffat25?: number | null
          year?: number | null
        }
        Update: {
          assists?: number | null
          assistsat10?: number | null
          assistsat15?: number | null
          assistsat20?: number | null
          assistsat25?: number | null
          ban1?: string | null
          ban2?: string | null
          ban3?: string | null
          ban4?: string | null
          ban5?: string | null
          barons?: number | null
          champion?: string | null
          chemtechs?: number | null
          ckpm?: number | null
          clouds?: number | null
          controlwardsbought?: number | null
          csat10?: number | null
          csat15?: number | null
          csat20?: number | null
          csat25?: number | null
          csdiffat10?: number | null
          csdiffat15?: number | null
          csdiffat20?: number | null
          csdiffat25?: number | null
          cspm?: number | null
          damagemitigatedperminute?: number | null
          damageshare?: number | null
          damagetakenperminute?: number | null
          damagetochampions?: number | null
          datacompleteness?: string | null
          date?: string | null
          deaths?: number | null
          deathsat10?: number | null
          deathsat15?: number | null
          deathsat20?: number | null
          deathsat25?: number | null
          doublekills?: number | null
          dpm?: number | null
          dragons?: number | null
          "dragons (type unknown)"?: number | null
          "earned gpm"?: number | null
          earnedgold?: number | null
          earnedgoldshare?: number | null
          elders?: number | null
          elementaldrakes?: number | null
          firstbaron?: number | null
          firstblood?: number | null
          firstbloodassist?: number | null
          firstbloodkill?: number | null
          firstbloodvictim?: number | null
          firstdragon?: number | null
          firstherald?: number | null
          firstmidtower?: number | null
          firsttothreetowers?: number | null
          firsttower?: number | null
          game?: number | null
          gameid?: string | null
          gamelength?: number | null
          goldat10?: number | null
          goldat15?: number | null
          goldat20?: number | null
          goldat25?: number | null
          golddiffat10?: number | null
          golddiffat15?: number | null
          golddiffat20?: number | null
          golddiffat25?: number | null
          goldspent?: number | null
          gpr?: number | null
          gspd?: number | null
          heralds?: number | null
          hextechs?: number | null
          infernals?: number | null
          inhibitors?: number | null
          kills?: number | null
          killsat10?: number | null
          killsat15?: number | null
          killsat20?: number | null
          killsat25?: number | null
          league?: string | null
          minionkills?: number | null
          monsterkills?: number | null
          monsterkillsenemyjungle?: number | null
          monsterkillsownjungle?: number | null
          mountains?: number | null
          oceans?: number | null
          opp_assistsat10?: number | null
          opp_assistsat15?: number | null
          opp_assistsat20?: number | null
          opp_assistsat25?: number | null
          opp_barons?: number | null
          opp_csat10?: number | null
          opp_csat15?: number | null
          opp_csat20?: number | null
          opp_csat25?: number | null
          opp_deathsat10?: number | null
          opp_deathsat15?: number | null
          opp_deathsat20?: number | null
          opp_deathsat25?: number | null
          opp_dragons?: number | null
          opp_elders?: number | null
          opp_elementaldrakes?: number | null
          opp_goldat10?: number | null
          opp_goldat15?: number | null
          opp_goldat20?: number | null
          opp_goldat25?: number | null
          opp_heralds?: number | null
          opp_inhibitors?: number | null
          opp_killsat10?: number | null
          opp_killsat15?: number | null
          opp_killsat20?: number | null
          opp_killsat25?: number | null
          opp_towers?: number | null
          opp_turretplates?: number | null
          opp_void_grubs?: number | null
          opp_xpat10?: number | null
          opp_xpat15?: number | null
          opp_xpat20?: number | null
          opp_xpat25?: number | null
          participantid?: number | null
          patch?: number | null
          pentakills?: number | null
          pick1?: string | null
          pick2?: string | null
          pick3?: string | null
          pick4?: string | null
          pick5?: string | null
          playerid?: string | null
          playername?: string | null
          playoffs?: number | null
          position?: string | null
          quadrakills?: number | null
          result?: number | null
          side?: string | null
          split?: string | null
          "team kpm"?: number | null
          teamdeaths?: number | null
          teamid?: string | null
          teamkills?: number | null
          teamname?: string | null
          "total cs"?: number | null
          totalgold?: number | null
          towers?: number | null
          triplekills?: number | null
          turretplates?: number | null
          url?: string | null
          visionscore?: number | null
          void_grubs?: number | null
          vspm?: number | null
          wardskilled?: number | null
          wardsplaced?: number | null
          wcpm?: number | null
          wpm?: number | null
          xpat10?: number | null
          xpat15?: number | null
          xpat20?: number | null
          xpat25?: number | null
          xpdiffat10?: number | null
          xpdiffat15?: number | null
          xpdiffat20?: number | null
          xpdiffat25?: number | null
          year?: number | null
        }
        Relationships: []
      }
      team_match_stats: {
        Row: {
          ban1: string | null
          ban2: string | null
          ban3: string | null
          ban4: string | null
          ban5: string | null
          barons: number | null
          chemtechs: number | null
          clouds: number | null
          csdiffat10: number | null
          csdiffat15: number | null
          csdiffat20: number | null
          csdiffat25: number | null
          dragons: number | null
          "dragons (type unknown)": number | null
          elders: number | null
          firstbaron: boolean | null
          firstblood: boolean | null
          firstdragon: boolean | null
          firstherald: boolean | null
          golddiffat10: number | null
          golddiffat15: number | null
          golddiffat20: number | null
          golddiffat25: number | null
          hextechs: number | null
          id: number
          infernals: number | null
          inhibitors: number | null
          match_id: string | null
          mountains: number | null
          oceans: number | null
          pick1: string | null
          pick2: string | null
          pick3: string | null
          pick4: string | null
          pick5: string | null
          side: string | null
          team_id: string | null
          teamassists: number | null
          teamdeaths: number | null
          teamkills: number | null
          towers: number | null
          turretplates: number | null
          void_grubs: number | null
          xpdiffat10: number | null
          xpdiffat15: number | null
          xpdiffat20: number | null
          xpdiffat25: number | null
        }
        Insert: {
          ban1?: string | null
          ban2?: string | null
          ban3?: string | null
          ban4?: string | null
          ban5?: string | null
          barons?: number | null
          chemtechs?: number | null
          clouds?: number | null
          csdiffat10?: number | null
          csdiffat15?: number | null
          csdiffat20?: number | null
          csdiffat25?: number | null
          dragons?: number | null
          "dragons (type unknown)"?: number | null
          elders?: number | null
          firstbaron?: boolean | null
          firstblood?: boolean | null
          firstdragon?: boolean | null
          firstherald?: boolean | null
          golddiffat10?: number | null
          golddiffat15?: number | null
          golddiffat20?: number | null
          golddiffat25?: number | null
          hextechs?: number | null
          id?: number
          infernals?: number | null
          inhibitors?: number | null
          match_id?: string | null
          mountains?: number | null
          oceans?: number | null
          pick1?: string | null
          pick2?: string | null
          pick3?: string | null
          pick4?: string | null
          pick5?: string | null
          side?: string | null
          team_id?: string | null
          teamassists?: number | null
          teamdeaths?: number | null
          teamkills?: number | null
          towers?: number | null
          turretplates?: number | null
          void_grubs?: number | null
          xpdiffat10?: number | null
          xpdiffat15?: number | null
          xpdiffat20?: number | null
          xpdiffat25?: number | null
        }
        Update: {
          ban1?: string | null
          ban2?: string | null
          ban3?: string | null
          ban4?: string | null
          ban5?: string | null
          barons?: number | null
          chemtechs?: number | null
          clouds?: number | null
          csdiffat10?: number | null
          csdiffat15?: number | null
          csdiffat20?: number | null
          csdiffat25?: number | null
          dragons?: number | null
          "dragons (type unknown)"?: number | null
          elders?: number | null
          firstbaron?: boolean | null
          firstblood?: boolean | null
          firstdragon?: boolean | null
          firstherald?: boolean | null
          golddiffat10?: number | null
          golddiffat15?: number | null
          golddiffat20?: number | null
          golddiffat25?: number | null
          hextechs?: number | null
          id?: number
          infernals?: number | null
          inhibitors?: number | null
          match_id?: string | null
          mountains?: number | null
          oceans?: number | null
          pick1?: string | null
          pick2?: string | null
          pick3?: string | null
          pick4?: string | null
          pick5?: string | null
          side?: string | null
          team_id?: string | null
          teamassists?: number | null
          teamdeaths?: number | null
          teamkills?: number | null
          towers?: number | null
          turretplates?: number | null
          void_grubs?: number | null
          xpdiffat10?: number | null
          xpdiffat15?: number | null
          xpdiffat20?: number | null
          xpdiffat25?: number | null
        }
        Relationships: []
      }
      teams: {
        Row: {
          avg_csdiffat10: number | null
          avg_csdiffat15: number | null
          avg_csdiffat20: number | null
          avg_csdiffat25: number | null
          avg_dragons: number | null
          avg_dragons_against: number | null
          avg_gamelength: number | null
          avg_golddiffat10: number | null
          avg_golddiffat15: number | null
          avg_golddiffat20: number | null
          avg_golddiffat25: number | null
          avg_heralds: number | null
          avg_kill_diff: number | null
          avg_kills: number | null
          avg_towers: number | null
          avg_towers_against: number | null
          avg_void_grubs: number | null
          avg_xpdiffat10: number | null
          avg_xpdiffat15: number | null
          avg_xpdiffat20: number | null
          avg_xpdiffat25: number | null
          firstblood_blue_pct: number | null
          firstblood_pct: number | null
          firstblood_red_pct: number | null
          firstdragon_pct: number | null
          logo: string | null
          region: string | null
          teamid: string
          teamname: string | null
          total_chemtechs: number | null
          total_clouds: number | null
          total_hextechs: number | null
          total_infernals: number | null
          total_mountains: number | null
          total_oceans: number | null
          winrate: number | null
          winrate_blue: number | null
          winrate_red: number | null
        }
        Insert: {
          avg_csdiffat10?: number | null
          avg_csdiffat15?: number | null
          avg_csdiffat20?: number | null
          avg_csdiffat25?: number | null
          avg_dragons?: number | null
          avg_dragons_against?: number | null
          avg_gamelength?: number | null
          avg_golddiffat10?: number | null
          avg_golddiffat15?: number | null
          avg_golddiffat20?: number | null
          avg_golddiffat25?: number | null
          avg_heralds?: number | null
          avg_kill_diff?: number | null
          avg_kills?: number | null
          avg_towers?: number | null
          avg_towers_against?: number | null
          avg_void_grubs?: number | null
          avg_xpdiffat10?: number | null
          avg_xpdiffat15?: number | null
          avg_xpdiffat20?: number | null
          avg_xpdiffat25?: number | null
          firstblood_blue_pct?: number | null
          firstblood_pct?: number | null
          firstblood_red_pct?: number | null
          firstdragon_pct?: number | null
          logo?: string | null
          region?: string | null
          teamid: string
          teamname?: string | null
          total_chemtechs?: number | null
          total_clouds?: number | null
          total_hextechs?: number | null
          total_infernals?: number | null
          total_mountains?: number | null
          total_oceans?: number | null
          winrate?: number | null
          winrate_blue?: number | null
          winrate_red?: number | null
        }
        Update: {
          avg_csdiffat10?: number | null
          avg_csdiffat15?: number | null
          avg_csdiffat20?: number | null
          avg_csdiffat25?: number | null
          avg_dragons?: number | null
          avg_dragons_against?: number | null
          avg_gamelength?: number | null
          avg_golddiffat10?: number | null
          avg_golddiffat15?: number | null
          avg_golddiffat20?: number | null
          avg_golddiffat25?: number | null
          avg_heralds?: number | null
          avg_kill_diff?: number | null
          avg_kills?: number | null
          avg_towers?: number | null
          avg_towers_against?: number | null
          avg_void_grubs?: number | null
          avg_xpdiffat10?: number | null
          avg_xpdiffat15?: number | null
          avg_xpdiffat20?: number | null
          avg_xpdiffat25?: number | null
          firstblood_blue_pct?: number | null
          firstblood_pct?: number | null
          firstblood_red_pct?: number | null
          firstdragon_pct?: number | null
          logo?: string | null
          region?: string | null
          teamid?: string
          teamname?: string | null
          total_chemtechs?: number | null
          total_clouds?: number | null
          total_hextechs?: number | null
          total_infernals?: number | null
          total_mountains?: number | null
          total_oceans?: number | null
          winrate?: number | null
          winrate_blue?: number | null
          winrate_red?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      match_detail_view: {
        Row: {
          baron_diff: number | null
          dragon_diff: number | null
          duration_category: string | null
          firstbaron_team_id: string | null
          firstblood_team_id: string | null
          firstdragon_team_id: string | null
          firsttower_team_id: string | null
          game_number: number | null
          gameid: string | null
          gamelength: number | null
          gamelength_minutes: number | null
          gold_diff: number | null
          kda_loser: number | null
          kda_winner: number | null
          kill_diff: number | null
          loser_team_id: string | null
          loser_team_name: string | null
          patch: string | null
          playoffs: boolean | null
          split: string | null
          team1_id: string | null
          team1_name: string | null
          team2_id: string | null
          team2_name: string | null
          total_assists: number | null
          total_deaths: number | null
          total_kills: number | null
          total_towers: number | null
          tournament: string | null
          winner_team_id: string | null
          winner_team_name: string | null
          year: number | null
        }
        Relationships: []
      }
      player_score_z_view: {
        Row: {
          avg_match_in_league: number | null
          league: string | null
          match_count_in_league: number | null
          playerid: string | null
          playername: string | null
          position: string | null
          score_friendly_100: number | null
          score_friendly_adjusted: number | null
          teamid: string | null
          z_total: number | null
        }
        Relationships: []
      }
      player_stats: {
        Row: {
          csdiffat15: number | null
          cspm: number | null
          damageshare: number | null
          dpm: number | null
          earnedgoldshare: number | null
          golddiffat15: number | null
          kda: number | null
          league: string | null
          match_count: number | null
          playerid: string | null
          playername: string | null
          position: string | null
          teamid: string | null
          vspm: number | null
          wcpm: number | null
          xpdiffat15: number | null
        }
        Relationships: []
      }
      player_stats_means: {
        Row: {
          cs15_bot_mean: number | null
          cs15_bot_std: number | null
          cs15_jng_mean: number | null
          cs15_jng_std: number | null
          cs15_mid_mean: number | null
          cs15_mid_std: number | null
          cs15_top_mean: number | null
          cs15_top_std: number | null
          cspm_bot_mean: number | null
          cspm_bot_std: number | null
          cspm_jng_mean: number | null
          cspm_jng_std: number | null
          cspm_mid_mean: number | null
          cspm_mid_std: number | null
          cspm_top_mean: number | null
          cspm_top_std: number | null
          dpm_bot_mean: number | null
          dpm_bot_std: number | null
          dpm_jng_mean: number | null
          dpm_jng_std: number | null
          dpm_mid_mean: number | null
          dpm_mid_std: number | null
          dpm_sup_mean: number | null
          dpm_sup_std: number | null
          dpm_top_mean: number | null
          dpm_top_std: number | null
          ds_bot_mean: number | null
          ds_bot_std: number | null
          ds_jng_mean: number | null
          ds_jng_std: number | null
          ds_mid_mean: number | null
          ds_mid_std: number | null
          ds_sup_mean: number | null
          ds_sup_std: number | null
          ds_top_mean: number | null
          ds_top_std: number | null
          gd15_bot_mean: number | null
          gd15_bot_std: number | null
          gd15_jng_mean: number | null
          gd15_jng_std: number | null
          gd15_mid_mean: number | null
          gd15_mid_std: number | null
          gd15_sup_mean: number | null
          gd15_sup_std: number | null
          gd15_top_mean: number | null
          gd15_top_std: number | null
          gs_bot_mean: number | null
          gs_bot_std: number | null
          gs_jng_mean: number | null
          gs_jng_std: number | null
          gs_mid_mean: number | null
          gs_mid_std: number | null
          gs_sup_mean: number | null
          gs_sup_std: number | null
          gs_top_mean: number | null
          gs_top_std: number | null
          kda_bot_mean: number | null
          kda_bot_std: number | null
          kda_jng_mean: number | null
          kda_jng_std: number | null
          kda_mid_mean: number | null
          kda_mid_std: number | null
          kda_sup_mean: number | null
          kda_sup_std: number | null
          kda_top_mean: number | null
          kda_top_std: number | null
          vspm_jng_mean: number | null
          vspm_jng_std: number | null
          vspm_mid_mean: number | null
          vspm_mid_std: number | null
          vspm_sup_mean: number | null
          vspm_sup_std: number | null
          vspm_top_mean: number | null
          vspm_top_std: number | null
          wcpm_jng_mean: number | null
          wcpm_jng_std: number | null
          wcpm_sup_mean: number | null
          wcpm_sup_std: number | null
          xp15_bot_mean: number | null
          xp15_bot_std: number | null
          xp15_jng_mean: number | null
          xp15_jng_std: number | null
          xp15_mid_mean: number | null
          xp15_mid_std: number | null
          xp15_sup_mean: number | null
          xp15_sup_std: number | null
          xp15_top_mean: number | null
          xp15_top_std: number | null
        }
        Relationships: []
      }
      player_summary_view: {
        Row: {
          aggression_score: number | null
          avg_assists: number | null
          avg_csdiffat10: number | null
          avg_deaths: number | null
          avg_golddiffat10: number | null
          avg_kills: number | null
          avg_xpdiffat10: number | null
          cspm: number | null
          damage_share: number | null
          dmg_per_gold: number | null
          dpm: number | null
          earlygame_score: number | null
          efficiency_score: number | null
          gold_share_percent: number | null
          gpm: number | null
          kda: number | null
          kill_participation_pct: number | null
          playerid: string | null
          playername: string | null
          position: string | null
          teamid: string | null
          vspm: number | null
          wcpm: number | null
        }
        Relationships: []
      }
      team_summary_view: {
        Row: {
          aggression_score: number | null
          avg_csdiffat10: number | null
          avg_dragons: number | null
          avg_dragons_against: number | null
          avg_gamelength: number | null
          avg_golddiffat10: number | null
          avg_heralds: number | null
          avg_kill_diff: number | null
          avg_kills: number | null
          avg_towers: number | null
          avg_towers_against: number | null
          avg_void_grubs: number | null
          avg_xpdiffat10: number | null
          dragon_diff: number | null
          earlygame_score: number | null
          firstblood_pct: number | null
          firstdragon_pct: number | null
          objectives_score: number | null
          region: string | null
          teamid: string | null
          teamname: string | null
          tower_diff: number | null
          winrate_blue_percent: number | null
          winrate_percent: number | null
          winrate_red_percent: number | null
        }
        Insert: {
          aggression_score?: never
          avg_csdiffat10?: number | null
          avg_dragons?: number | null
          avg_dragons_against?: number | null
          avg_gamelength?: number | null
          avg_golddiffat10?: number | null
          avg_heralds?: number | null
          avg_kill_diff?: number | null
          avg_kills?: number | null
          avg_towers?: number | null
          avg_towers_against?: number | null
          avg_void_grubs?: number | null
          avg_xpdiffat10?: number | null
          dragon_diff?: never
          earlygame_score?: never
          firstblood_pct?: number | null
          firstdragon_pct?: number | null
          objectives_score?: never
          region?: string | null
          teamid?: string | null
          teamname?: string | null
          tower_diff?: never
          winrate_blue_percent?: never
          winrate_percent?: never
          winrate_red_percent?: never
        }
        Update: {
          aggression_score?: never
          avg_csdiffat10?: number | null
          avg_dragons?: number | null
          avg_dragons_against?: number | null
          avg_gamelength?: number | null
          avg_golddiffat10?: number | null
          avg_heralds?: number | null
          avg_kill_diff?: number | null
          avg_kills?: number | null
          avg_towers?: number | null
          avg_towers_against?: number | null
          avg_void_grubs?: number | null
          avg_xpdiffat10?: number | null
          dragon_diff?: never
          earlygame_score?: never
          firstblood_pct?: number | null
          firstdragon_pct?: number | null
          objectives_score?: never
          region?: string | null
          teamid?: string | null
          teamname?: string | null
          tower_diff?: never
          winrate_blue_percent?: never
          winrate_percent?: never
          winrate_red_percent?: never
        }
        Relationships: []
      }
    }
    Functions: {
      check_table_exists: {
        Args: { table_name: string }
        Returns: boolean
      }
      compute_friendly_score: {
        Args: {
          role: string
          in_cspm: number
          in_dpm: number
          in_vspm: number
          in_wcpm: number
          in_damageshare: number
          in_earnedgoldshare: number
          in_golddiffat15: number
          in_xpdiffat15: number
          in_csdiffat15: number
          in_kda: number
        }
        Returns: number
      }
      compute_soft_penalty: {
        Args:
          | { p_league: string; p_match_count: number }
          | { p_playerid: string; p_league: string }
        Returns: number
      }
      compute_soft_weight: {
        Args: { player_id: string; league_name: string }
        Returns: number
      }
      create_function: {
        Args: { function_name: string; function_body: string }
        Returns: undefined
      }
      league_coefficient: {
        Args: { p_league: string }
        Returns: number
      }
      regenerate_all_tables: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      z: {
        Args: { x: number; mean: number; std: number }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
