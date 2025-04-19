
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface LeaguepediaParams {
  tables?: string;
  fields?: string;
  where?: string;
  limit?: number;
}

export const useLeaguepedia = (params: LeaguepediaParams) => {
  return useQuery({
    queryKey: ['leaguepedia', params],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('leaguepedia', {
        body: {
          params: {
            tables: params.tables,
            fields: params.fields,
            where: params.where,
            limit: params.limit || 10
          }
        }
      });

      if (error) throw error;
      return data;
    }
  });
};
