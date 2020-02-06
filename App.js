import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import BottomNavigatorScreen from './src/components/BottomNavigator';
import PesanOjekScreen from './src/screens/PesanOjekScreen';
import PesanMakananScreen from './src/screens/PesanMakananScreen';
import AkunSettingsScreen from './src/screens/AkunSettingsScreen';
import OrderOjekScreen from './src/screens/OrderOjekScreen';
import ChatScreen from './src/screens/ChatScreen';
import MenuResto from './src/screens/MenuResto';

const MainNavigator = createStackNavigator({
  Home: {screen: HomeScreen},
  Login: {screen: LoginScreen},
  Signup: {screen: SignupScreen},
  Bottom: {screen: BottomNavigatorScreen},
  PesanOjek: {screen: PesanOjekScreen},
  PesanMakanan: {screen: PesanMakananScreen},
  AkunSettings: {screen: AkunSettingsScreen},
  OrderOjek: {screen: OrderOjekScreen},
  Chat: {screen: ChatScreen},
  MenuResto: {screen: MenuResto}

},
{headerMode: 'none',});

const App = createAppContainer(MainNavigator);

export default App;
