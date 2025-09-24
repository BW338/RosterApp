import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1c1c1e', // Un fondo oscuro y neutro
  },
  content: {
    alignItems: 'center',
    padding: 20,
  },
logo: {
  width: 120,
  height: 120,
  marginBottom: 40,
  borderRadius: 16,
  resizeMode: "contain",
  borderWidth: 1.5,
  borderColor: "rgba(255,255,255,0.8)", // o un color que combine con tu tema
},


  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#AEAEB2',
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
  },
});