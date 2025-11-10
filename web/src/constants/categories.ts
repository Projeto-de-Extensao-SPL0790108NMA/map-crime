export const CATEGORIES = [
  { id: 'theft', name: 'Furto' },
  { id: 'assault', name: 'Assalto' },
  { id: 'vandalism', name: 'Vandalismo' },
  { id: 'drug_activity', name: 'Atividade com Drogas' },
  { id: 'traffic_violation', name: 'Infração de Trânsito' },
  { id: 'domestic_violence', name: 'Violência Doméstica' },
  { id: 'burglary', name: 'Arrombamento' },
  { id: 'robbery', name: 'Roubo' },
  { id: 'homicide', name: 'Homicídio' },
  { id: 'cybercrime', name: 'Cibercrime' },
  { id: 'fraud', name: 'Fraude' },
  { id: 'other', name: 'Outro' },
] as const;

export const CATEGORIES_MAP = CATEGORIES.reduce(
  (map, category) => {
    map[category.id] = category.name;
    return map;
  },
  {} as Record<string, string>,
);
