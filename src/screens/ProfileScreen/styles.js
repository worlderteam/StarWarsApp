import { StyleSheet } from "react-native";
import colorScheme from "../../../assets/themes/colorScheme";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorScheme.$white,
    padding: 20,
    justifyContent: 'center',
  },
  profileTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colorScheme.$darkGray,
  },
  profileDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colorScheme.$lightGray,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colorScheme.$darkGray,
  },
  detailText: {
    fontSize: 16,
    color: colorScheme.$darkGray,
  },
  logoutButton: {
    marginTop: 30,
    backgroundColor: colorScheme.$red,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    fontSize: 18,
    color: colorScheme.$white,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: colorScheme.$darkGray,
  },
  imageContainer: {
    marginBottom: 40,
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  toggleLanguageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    height: 30,
    width: 30,
    backgroundColor: colorScheme.$blueColor,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleLanguageText: {
    color: colorScheme.$white,
    fontSize: 12,
    fontWeight: 'bold',
  },
})

export default styles