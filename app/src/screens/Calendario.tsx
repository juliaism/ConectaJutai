import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import ClassesService from '../service/classesService';

LocaleConfig.locales['pt-br'] = {
  monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
  monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
  dayNames: ['Domingo','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado'],
  dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'],
  today: 'Hoje'
};
LocaleConfig.defaultLocale = 'pt-br';

interface Aula {
  id: string;
  classes_date: string; 
  course: string;
  horario: string;
  local: string;
}

interface MarkedDates {
  [key: string]: {
    marked: boolean;
    dotColor: string;
    selectedColor: string;
    selected?: boolean;
  };
}

export default function CalendarioScreen(){
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<string>("");

  async function fetchAulas() {
    try {
      setLoading(true);
      const data = await ClassesService.fetchClasses();
      setAulas(data);
      formatCalendario(data);
    } catch (error) {
      console.log("Erro ao buscar aulas: ", error);
    } finally {
      setLoading(false);
    }
  }

  function formatCalendario(listaAulas: Aula[]){
    const marcacoes = listaAulas.reduce((acc, aula) => {
      acc[aula.classes_date] = {
        marked: true,
        dotColor: '#333',
        selectedColor: '#27AE60',
      };
      return acc;
    }, {} as MarkedDates);

    setMarkedDates(marcacoes);
  }

  useEffect(() => {
    fetchAulas();

    const unsubscribe = ClassesService.subscribeToNetworkChanges((aulasAtualizadas) => {
      setAulas(aulasAtualizadas);
      formatCalendario(aulasAtualizadas);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if(loading){
    return(
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#27AE60" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    )
  }

  const aulasDoDia = aulas.filter(aula => aula.classes_date === selectedDate);

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Calendário</Text>
      <Calendar
        markedDates={{
          ...markedDates,
          ...(selectedDate ? { [selectedDate]: { selected: true, marked: true, dotColor: '#FFFF', selectedColor: '#27AE60' } } : {})
        }}
        theme={{
          dotColor: '#27AE60',
          arrowColor: '#27AE60',
        }}
        onDayPress={(day) => {
          setSelectedDate(day.dateString);
        }}
        enableSwipeMonths={true}
        hideArrows={false}
        onMonthChange={(month) => {
          console.log("Mês trocado:", month);
        }}
      />

      {selectedDate && (
        <View style={styles.listContainer}>
          <Text style={styles.calendarDescription}>Aulas em {selectedDate}:</Text>
          {aulasDoDia.length > 0 ? (
            <FlatList
              data={aulasDoDia}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <Text style={styles.course}>{item.course}</Text>
                  <Text style={styles.horario}>Horário: {item.horario}</Text>
                   <Text style={styles.local}>Local: {item.local}</Text>
                </View>
              )}
            />
          ) : (
            <Text style={styles.noClass}>Nenhuma aula neste dia.</Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7F6',
    padding: 20
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFF',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#27AE60',
    marginBottom: 20,
    marginTop: 40,
    textAlign: 'center',
  },
  calendarDescription: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#27AE60',
    marginBottom: 10,
    marginTop: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#27AE60',
    fontSize: 16,
  },
  listContainer: {
    marginTop: 20,
  },
  card: {
    backgroundColor: '#FFFF',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  course: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  horario: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
   local: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  noClass: {
    fontSize: 14,
    color: '#999',
    marginTop: 10,
  }
});

