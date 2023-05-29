import React, {useCallback, ReactElement, useContext, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AccountParamList} from '../../scripts/screen_params';

import {auth} from '../../scripts/firebase';
import {useAuthState} from 'react-firebase-hooks/auth';

import {styles} from './signup_styles';
import {styles as globalStyles} from '../../../App_styles';

import {TTextInputStyle} from '../../scripts/types';

import {ColorContext} from '../../context/color_context';

import {useAppSelector, useAppDispatch} from '../../scripts/redux_hooks';
import {
  selectContainerContrast,
  selectPageContrast,
  selectTextContrast,
} from '../../slices/colorSlice';
import {registerWithEmailAndPassword} from '../../slices/accountSlice';

import Button from '../../components/button/button';
import TopNav from '../../components/top_nav/top_nav';

type Props = NativeStackScreenProps<AccountParamList, 'SignupScreen'>;

export default function SignupScreen({
  navigation,
  route,
}: any): ReactElement<Props> {
  const pageContrast = useAppSelector(selectPageContrast);
  const containerContrast = useAppSelector(selectContainerContrast);
  const textContrast = useAppSelector(selectTextContrast);

  const dispatch = useAppDispatch();

  const {color, lightColor} = useContext(ColorContext);

  useFocusEffect(
    useCallback(() => {
      if (!route.params.validNavigation) {
        navigation.popToTop();
      }
      route.params.validNavigation = false;
    }, [navigation, route.params]),
  );

  const [name, setName] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [confirmPassword, setConfirmPassword] = React.useState<string>('');
  const [user, loading, _] = useAuthState(auth);

  const register = () => {
    if (password === confirmPassword && name && email && password) {
      dispatch(registerWithEmailAndPassword({email, password}));
    }
  };

  useEffect(() => {
    if (loading) {
      return;
    }
    if (user) {
      navigation.popToTop();
    }
  }, [user, loading, navigation]);

  const [isKeyboardVisible, setKeyboardVisible] =
    React.useState<boolean>(false);
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const focusedStyle = {
    borderColor: color,
    borderWidth: 2,
  };

  const unfocusedStyle = {
    borderColor: lightColor,
    borderWidth: 1,
  };

  const [textInputStyles, setTextInputStyles] = React.useState<
    TTextInputStyle[]
  >([unfocusedStyle, unfocusedStyle]);

  const handleFocus = (index: number) => {
    const newFocusedStyles = textInputStyles.map((style, i) => {
      if (i === index) {
        return focusedStyle;
      } else {
        return unfocusedStyle;
      }
    });

    setTextInputStyles(newFocusedStyles);
    setKeyboardVisible(true);
  };

  return (
    <View style={[styles.container, pageContrast]}>
      <TopNav handlePress={() => navigation.goBack()} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.body}>
          <Text style={[styles.title, textContrast]}>Sign Up</Text>
          <View
            style={[
              globalStyles.tile,
              styles.infoContainer,
              containerContrast,
              {display: isKeyboardVisible ? 'none' : 'flex'},
            ]}>
            <Text style={[styles.infoText, textContrast]}>
              Culpa aliquip aliqua deserunt duis mollit.
            </Text>
          </View>
          <View
            style={[
              globalStyles.tile,
              styles.form,
              containerContrast,
              isKeyboardVisible ? {} : {height: 'auto'},
            ]}>
            <View style={styles.textContainer}>
              <Text style={[styles.label, textContrast]}>Name:</Text>
              <TextInput
                style={[
                  styles.input,
                  textInputStyles[0],
                  containerContrast,
                  textContrast,
                ]}
                cursorColor={color}
                onFocus={() => handleFocus(0)}
                onChange={event => setName(event.nativeEvent.text)}
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={[styles.label, textContrast]}>Email:</Text>
              <TextInput
                style={[
                  styles.input,
                  textInputStyles[0],
                  containerContrast,
                  textContrast,
                ]}
                cursorColor={color}
                onFocus={() => handleFocus(0)}
                onChange={event => setEmail(event.nativeEvent.text)}
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={[styles.label, textContrast]}>Password:</Text>
              <TextInput
                style={[
                  styles.input,
                  textInputStyles[0],
                  containerContrast,
                  textContrast,
                ]}
                cursorColor={color}
                onFocus={() => handleFocus(0)}
                secureTextEntry={true}
                onChange={event => setPassword(event.nativeEvent.text)}
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={[styles.label, textContrast]}>
                Confirm Password:
              </Text>
              <TextInput
                style={[
                  styles.input,
                  textInputStyles[0],
                  containerContrast,
                  textContrast,
                ]}
                cursorColor={color}
                onFocus={() => handleFocus(0)}
                secureTextEntry={true}
                onChange={event => setConfirmPassword(event.nativeEvent.text)}
              />
            </View>
            <View style={styles.buttonContainer}>
              <Button onPress={register}>
                <Text style={styles.buttonText}>Sign Up</Text>
              </Button>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </View>
  );
}
