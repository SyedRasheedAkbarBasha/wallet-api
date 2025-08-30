import { View, ActivityIndicator } from "react-native";
import { styles } from "../assets/style/home.styles";
import { COLORS } from "../constants/color";

const PageLoader = () => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );
};
export default PageLoader;