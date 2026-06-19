export interface Aula {
  id: string;
  classes_date: string; 
  course: string;
  horario: string;
  local: string;
}

const mockClasses: Aula[] = [
     {
      id: "1",
      classes_date: "2026-06-27",
      course: "Cultivo de Milho",
      horario: "15:00",
      local: "Escola",
    },
    {
      id: "2",
      classes_date: "2026-07-01",
      course: "Cultivo de Mandioca",
      horario: "10:00",
      local: "Escola",
    },
];

const ClassesService = {
  async fetchClasses(): Promise<Aula[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockClasses);
      }, 500);
    });
  },

  async getStoredClasses(): Promise<Aula[]> {
    return mockClasses;
  },

  subscribeToNetworkChanges(onReconnect: (aulas: Aula[]) => void) {
    const unsubscribe = () => {};
    onReconnect(mockClasses);
    return unsubscribe;
  }
};

export default ClassesService;
