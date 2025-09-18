import React, { useState, useEffect, useCallback } from 'react';
import { View, Alert, Text, StyleSheet,StatusBar, ImageBackground, TextInput, TouchableOpacity, Modal, Button, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, FlatList, ToastAndroid, Platform} from 'react-native';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dropdown } from 'react-native-element-dropdown';
import { Fontisto, FontAwesome, Ionicons } from '@expo/vector-icons';
import styles from '../Styles/ViaticosStyles';

// Helper para obtener una clave única de mes y año (ej: "Septiembre-2024")
const getMonthYearKey = (date) => {
  const monthName = date.toLocaleString("es", { month: "long" });
  const year = date.getFullYear();
  return `${monthName.charAt(0).toUpperCase() + monthName.slice(1)}-${year}`;
};

export default function ViaticosScreen({ navigation }) {

  const [markedDates, setMarkedDates] = useState({});
  const [suma, setSuma] = useState({});
  const [currentMonthKey, setCurrentMonthKey] = useState(getMonthYearKey(new Date()));
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleDateString('es', { month: 'long' }));
  const [aep, setAep] = useState('');
  const [cor, setCor] = useState('');
  const [mdz, setMdz] = useState('');
  const [ush, setUsh] = useState('');
  const [fte, setFte] = useState('');
  const [esm, setEsm] = useState('');
  const [totalPostas, setTotalPostas] = useState(0)
  const [viaticos, setViaticos] = useState(0)
  const [dropDownVisible, setDropDownVisible] = useState(false)
  const [hideArrows, setHideArrows] = useState(false);
  const [sweep, setSweep] = useState(true)

  const [selectedValues, setSelectedValues] = useState([]);
  const [postas] = useState([
    'COR', 'MDZ', 'USH', 'FTE', 'ESM'
  ].flatMap(code => [
    { label: `${code} x1`, value: `${code}_1` },
    { label: `${code} x2`, value: `${code}_2` },
    { label: `${code} x3`, value: `${code}_3` },
    { label: `${code} x4`, value: `${code}_4` },
    { label: '----------------', value: `${code}_d1`, disable: true }, // Separador
  ]));

  const [filteredValues, setFilteredValues] = useState([]);

useEffect(() => {
  loadPersistedData();
  
  const currentDate = new Date();
  const currentDay = currentDate.toLocaleDateString('es', { day: '2-digit' });
  
  if (Platform.OS === 'android') {
    ToastAndroid.show('Cargando datos...', ToastAndroid.LONG);
  }

  if(currentDay === '01'){
    setHideArrows(true);
    setSweep(false)
  } else {
    setHideArrows(false);
    setSweep(true)
  }
}, []);

useEffect(() => {
  const newFilteredValues = selectedValues.filter((item) => item.month === currentMonthKey);
  setFilteredValues(newFilteredValues);
}, [currentMonthKey, selectedValues]);

  useEffect(() => {
    saveDataToStorage();
  }, [markedDates, suma, aep, cor, mdz, ush, fte, esm, totalPostas]);

  const input = (fieldName, newValor) => {
    if(fieldName === 'aep') setAep(newValor);
    if(fieldName === 'cor') setCor(newValor);
    if(fieldName === 'ush') setUsh(newValor);
    if(fieldName === 'fte') setFte(newValor);
    if(fieldName === 'mdz') setMdz(newValor);
    if(fieldName === 'esm') setEsm(newValor);
  };

  const loadPersistedData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('calendarData');
      if (storedData) {
        const { markedDates: storedMarkedDates, suma: storedSuma, aep: storedAep, cor:storedCor, ush:storedUsh, mdz:storedMdz, fte:storedFte, esm: storedEsm, totalPostas: storedTotalPostas } = JSON.parse(storedData);
        setMarkedDates(storedMarkedDates || {});
        setSuma(storedSuma || {});
        setAep(storedAep || '');
        setCor(storedCor || '');
        setUsh(storedUsh || '');
        setMdz(storedMdz || '');
        setFte(storedFte || '');
        setEsm(storedEsm || '');
        setTotalPostas(storedTotalPostas || 0);
      }
      const storedSelectedValues = await AsyncStorage.getItem('selectedValues');
      if (storedSelectedValues) {
        setSelectedValues(JSON.parse(storedSelectedValues));
      }
    } catch (error) {
      console.log('Error al cargar los datos:', error);
    }
  };

  const saveDataToStorage = async () => {
    try {
      const dataToStore = JSON.stringify({ markedDates, suma, aep, cor, ush, mdz, fte, esm, totalPostas });
      await AsyncStorage.setItem('calendarData', dataToStore);
    } catch (error) {
      console.log('Error al guardar los datos:', error);
    }
  };
 
  const airportValues = { AEP: aep, COR: cor, MDZ: mdz, USH: ush, FTE: fte, ESM: esm };

  const handleDropdownChange = (item) => {
    if (item.value === 'postas' || item.disable) return;

    const airportCode = item.label.substring(0, 3);
    const multiplier = parseInt(item.label.substring(5), 10);
    const airportValue = parseInt(airportValues[airportCode] || '0', 10);

    if (airportValue === 0) {
      setModalVisible(true);
      ToastAndroid.show(`No hay valor cargado para ${airportCode}`, ToastAndroid.SHORT);
      return;
    }

    const postaTotal = airportValue * multiplier;
    const updatedTotalPostas = { ...totalPostas };
    updatedTotalPostas[currentMonthKey] = (updatedTotalPostas[currentMonthKey] || 0) + postaTotal;
    setTotalPostas(updatedTotalPostas);

    const newItem = { ...item, month: currentMonthKey, id: `${Date.now()}-${Math.random()}` };
    const updatedSelectedValues = [...selectedValues, newItem];
    setSelectedValues(updatedSelectedValues);
    saveSelectedValues(updatedSelectedValues);
  };
  
  const handleDeleteItem = (itemToDelete) => {
    const { label, month, id } = itemToDelete;
    const airportCode = label.substring(0, 3);
    const multiplier = parseInt(label.substring(5), 10);
    const airportValue = parseInt(airportValues[airportCode] || '0', 10);

    if (airportValue > 0) {
      const postaTotal = airportValue * multiplier;
      const updatedTotalPostas = { ...totalPostas };
      updatedTotalPostas[month] = (updatedTotalPostas[month] || 0) - postaTotal;
      setTotalPostas(updatedTotalPostas);
    }

    const updatedSelectedValues = selectedValues.filter(item => item.id !== id);
    setSelectedValues(updatedSelectedValues);
    saveSelectedValues(updatedSelectedValues);
  };

  const saveSelectedValues = async (values) => {
    try {
      const valuesToStore = JSON.stringify(values);
      await AsyncStorage.setItem('selectedValues', valuesToStore);
    } catch (error) {
      console.log('Error al guardar los valores seleccionados:', error);
    }
  };

 const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemLeftContainer}>
        <Ionicons name="business-outline" size={20} color="#AECBFA" />
        <Text style={styles.itemText}>{item.label}</Text>
      </View>
      <TouchableOpacity onPress={() => handleDeleteItem(item)}>
        <FontAwesome name="trash-o" size={22} color="#FF453A" />
      </TouchableOpacity>
    </View>
  );

  const handleDayPress = (day) => {
    const selectedDate = day.dateString;
    const updatedMarkedDates = { ...markedDates };
    const updatedSuma = { ...suma };

    if (updatedMarkedDates[selectedDate]) {
      // Si el día ya está marcado, lo desmarcamos y restamos 1
      delete updatedMarkedDates[selectedDate];
      updatedSuma[currentMonthKey] = (updatedSuma[currentMonthKey] || 0) - 1;
    } else {
      // Si no está marcado, lo marcamos con un solo viático
      updatedSuma[currentMonthKey] = (updatedSuma[currentMonthKey] || 0) + 1;
      updatedMarkedDates[selectedDate] = {
        selected: true,
        customStyles: {
          container: { backgroundColor: '#000' }, // Un solo color para día con viático
          text: { color: 'white', fontWeight: 'bold' },
        },
      };
    }

    if (updatedSuma[currentMonthKey] < 0) updatedSuma[currentMonthKey] = 0;
    setMarkedDates(updatedMarkedDates);
    setSuma(updatedSuma);
  };

  const handleMonthChange = (newMonth) => {
    const selectedDate = new Date(newMonth.timestamp);
    setCurrentMonthKey(getMonthYearKey(selectedDate));
  };
  
  useEffect(() => {
    const sumaNum = parseInt(suma[currentMonthKey] * aep || 0);
    const totalPostasNum = parseInt(totalPostas[currentMonthKey] || 0);
    const sumatoria = sumaNum + totalPostasNum
    setViaticos(sumatoria)
    if (totalPostasNum < 0) setTotalPostas(0);
  }, [currentMonthKey, suma, totalPostas, aep]); 
  
  const AbrirModal = useCallback(() => {
    setModalVisible(true);
  }, []);

  const Reset = useCallback(() => {
    const [displayMonth, displayYear] = currentMonthKey.split('-');
    Alert.alert(
      `¿Deseas resetear todos los valores de ${displayMonth} ${displayYear}?`,
      'Esta acción restablecerá todos los valores para este mes.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Resetear',
          onPress: () => {
            const [monthNameToReset, yearToResetStr] = currentMonthKey.split('-');
            const yearToReset = parseInt(yearToResetStr, 10);
            const monthIndexToReset = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'].indexOf(monthNameToReset);

            const updatedMarkedDates = { ...markedDates };
            for (const dateKey in updatedMarkedDates) {
              const dateFromKey = new Date(dateKey);
              // Comparamos el mes y el año para asegurarnos de borrar solo el mes actual
              if (dateFromKey.getFullYear() === yearToReset && dateFromKey.getMonth() === monthIndexToReset) {
                delete updatedMarkedDates[dateKey];
              }
            }
            setMarkedDates(updatedMarkedDates);
            setSuma({ ...suma, [currentMonthKey]: 0 });
            setTotalPostas({ ...totalPostas, [currentMonthKey]: 0 });
            const updatedSelectedValues = selectedValues.filter((item) => item.month !== currentMonthKey);
            setSelectedValues(updatedSelectedValues);
            saveSelectedValues(updatedSelectedValues);
          },
        },
      ]
    );
  }, [currentMonthKey, markedDates, suma, totalPostas, selectedValues]);

// En tu componente, asegúrate de importar los estilos

useEffect(() => {
  navigation.setOptions({
    headerRight: () => (
      <View style={styles.headerRightContainer}>
        {/* Botón Valores */}
        <TouchableOpacity 
          onPress={AbrirModal} 
          style={[styles.headerButton, styles.valoresButton]}
        >
          <Ionicons name="cash-outline" size={18} color="#15803d" />
          <Text style={[styles.headerButtonText, styles.valoresText]}>
            Valores
          </Text>
        </TouchableOpacity>

        {/* Botón Reset */}
        <TouchableOpacity 
          onPress={Reset} 
          style={[styles.headerButton, styles.resetButton]}
        >
          <Ionicons name="refresh-outline" size={18} color="#dc2626" />
          <Text style={[styles.headerButtonText, styles.resetText]}>
            Reset
          </Text>
        </TouchableOpacity>
      </View>
    ),
    headerTitle: 'Viáticos',
    headerShown: true,
    headerTitleAlign: 'left',
    headerStyle: styles.header,
    headerTitleStyle: styles.headerTitle,
  });
}, [navigation, AbrirModal, Reset]);

  return (
    <>  
      <StatusBar backgroundColor='#BEC4FE' barStyle="dark-content" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ImageBackground source={require('../assets/bgViaticos.jpg')} style={styles.fondoViaticos}>
         
          <View style={styles.calendarWrapper}>
            <Calendar
              hideExtraDays={true}
              enableSwipeMonths={sweep}
              hideArrows={hideArrows}
              style={styles.calendarStyle}
              theme={styles.calendarTheme}
              markedDates={markedDates}
              markingType={'custom'}
              onDayPress={handleDayPress}
              onMonthChange={handleMonthChange}
              renderDay={(day, item) => {
                const customContainerStyle = item?.customStyles?.container || {};
                const customTextStyle = item?.customStyles?.text || {};
                return (
                  <View style={[styles.almanaque, customContainerStyle]}>
                    <Text style={[styles.dayText, customTextStyle]}>{day.day}</Text>
                  </View>
                );
              }}
            />
          </View>
          <View style={{flexDirection: 'row', alignItems:'center', justifyContent:'center' }}>
            <Modal visible={modalVisible} animationType='slide' transparent={true} >
              <KeyboardAvoidingView
                style={{ flex: 1, justifyContent: 'flex-end', opacity: 0.94 }}
                behavior={Platform.OS === 'ios' ? 'padding' : null}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 30}
              >
                <View style={{flex:1, justifyContent:'flex-end' , opacity:0.94}}> 
                  <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Valores de Viáticos</Text>
                    <View style={styles.modalInputContainer}>
                        <View style={styles.modalInputRow}>
                          <Text style={styles.escalas}>AEP $ </Text>
                          <TextInput style={styles.valorEscalas$} keyboardType='number-pad' value={aep ? aep.toString() : ''} onChangeText={(newValor) => input('aep', newValor)} placeholder="$$$$$" clearTextOnFocus={true} />
                        </View>
                         <View style={styles.modalInputRow}>
                          <Text style={styles.escalas}>ESM $ </Text>
                          <TextInput style={styles.valorEscalas$} keyboardType='number-pad' value={esm ? esm.toString() : ''} onChangeText={(newValor) => input('esm', newValor)} placeholder="$$$$$" clearTextOnFocus={true} />
                        </View>
                        <View style={styles.modalInputRow}>
                          <Text style={styles.escalas}>COR $ </Text>
                          <TextInput style={styles.valorEscalas$} keyboardType='number-pad' value={cor ? cor.toString() : ''} onChangeText={(newValor) => input('cor', newValor)} placeholder="$$$$$" clearTextOnFocus={true} />
                        </View>
                        <View style={styles.modalInputRow}>
                          <Text style={styles.escalas}>USH $ </Text>
                          <TextInput style={styles.valorEscalas$} keyboardType='number-pad' value={ush ? ush.toString() : ''} onChangeText={(newValor) => input('ush', newValor)} placeholder="$$$$$" clearTextOnFocus={true} />
                        </View>
                        <View style={styles.modalInputRow}>
                          <Text style={styles.escalas}>MDZ $ </Text>
                          <TextInput style={styles.valorEscalas$} keyboardType='number-pad' value={mdz ? mdz.toString() : ''} onChangeText={(newValor) => input('mdz', newValor)} placeholder="$$$$$" clearTextOnFocus={true} />
                        </View>
                        <View style={styles.modalInputRow}>
                          <Text style={styles.escalas}>FTE $ </Text>
                          <TextInput style={styles.valorEscalas$} keyboardType='number-pad' value={fte ? fte.toString() : ''} onChangeText={(newValor) => input('fte', newValor)} placeholder="$$$$$" clearTextOnFocus={true} />
                        </View>
                       
                    </View>
                    <TouchableOpacity style={styles.CerrarModal}>    
                      <Button title= 'Aceptar' onPress={()=> setModalVisible(false)} />
                    </TouchableOpacity>
                  </View>
                </View>
              </KeyboardAvoidingView>
            </Modal>

            <View style={styles.bottomContainer}>
              <View style={styles.summaryBoxLeft}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Bandejas AEP ({suma[currentMonthKey] || 0})</Text>
                  <Text style={styles.summaryValue}>${(suma[currentMonthKey] || 0) * (aep || 0)}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Postas</Text>
                  <Text style={styles.summaryValue}>${totalPostas[currentMonthKey] || 0}</Text>
                </View>

                <View style={styles.totalViaticosContainer}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalValue}>${viaticos || 0}</Text>
                </View>
              </View>                
              <View style={styles.postasContainer}>
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  containerStyle={styles.dropdownContainer}
                  itemContainerStyle={styles.dropdownItemContainer}
                  itemTextStyle={styles.itemTextStyle}
                  iconStyle={styles.iconStyle}
                  data={postas}
                  search
                  labelField="label"
                  valueField="value"
                  placeholder="Seleccionar Posta"
                  searchPlaceholder="Buscar..."
                  onChange={(item) => handleDropdownChange(item)}
                  renderLeftIcon={() => (
                    <Fontisto name="hotel" size={20} color="#AECBFA" style={{marginRight: 12}} />
                  )}
                />
                <FlatList
                  data={filteredValues}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={renderItem}
                  scrollEnabled={true}
                  style={styles.FlatList }
                />
              </View>        
            </View>
           
          </View>
        </ImageBackground>
      </TouchableWithoutFeedback>
    </>
  );
};
