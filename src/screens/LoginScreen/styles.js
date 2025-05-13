import { StyleSheet } from "react-native";
import colorScheme from "../../../assets/themes/colorScheme";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorScheme.$whiteCream,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 30,
    color: colorScheme.$blackBg,
  },
  inputContainer: {
    backgroundColor: colorScheme.$white,
    borderRadius: 10,
    padding: 20,
    width: '100%',
    shadowColor: colorScheme.$blackBg,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  input: {
    color: colorScheme.$blackBg,
    borderWidth: 1,
    borderColor: colorScheme.$gray,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: colorScheme.$blueColor,
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  loginButtonText: {
    color: colorScheme.$white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  forgotPasswordText: {
    color: colorScheme.$blueColor,
    textAlign: 'center',
    marginBottom: 15,
  },
  divider: {
    height: 1,
    backgroundColor: colorScheme.$gray,
    marginVertical: 15,
  },
  noAccountText: {
    textAlign: 'center',
    marginBottom: 15,
    color: colorScheme.$gray,
  },
  registerButton: {
    backgroundColor: colorScheme.$green,
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  registerButtonText: {
    color: colorScheme.$white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  toggleLanguageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    height: 30,
    width: 30,
    backgroundColor: colorScheme.$blueColor,
    borderRadius: 15,
    justifyContent:'center',
    alignItems: 'center',
  },
  toggleLanguageText: {
    color: colorScheme.$white,
    fontSize: 12,
    fontWeight: 'bold',
  },
})

export default styles