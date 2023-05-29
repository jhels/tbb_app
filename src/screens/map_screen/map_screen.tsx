import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  ReactElement,
} from 'react';
import {View, Animated, Dimensions} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MapParamList} from '../../scripts/screen_params';
import {useFocusEffect} from '@react-navigation/native';

import {styles} from './map_styles';

import {ICardProps} from '../../scripts/interfaces';

import MapIcon from '../../components/map_icon/map_icon';
import Card from '../../components/card/card';

import {useAppSelector, useAppDispatch} from '../../scripts/redux_hooks';
import {selectDarkMode} from '../../slices/colorSlice';
import {selectIsLoggedIn} from '../../slices/accountSlice';
import {
  selectReadings,
  fetchAllReadings,
  emptySyncedReadings,
} from '../../slices/readingsSlice';
import {TReading} from '../../scripts/types';

type Props = NativeStackScreenProps<MapParamList, 'MapScreen'>;

export default function MapScreen({navigation}: Props): ReactElement<Props> {
  const dispatch = useAppDispatch();

  const isDarkMode = useAppSelector(selectDarkMode);

  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const readings = useAppSelector(selectReadings);

  const [activeMarkers, setActiveMarkers] = useState<boolean[]>([]);
  const [activeCard, setActiveCard] = useState<boolean>(false);
  const [cardData, setCardData] = useState<ICardProps>({
    isIcon: false,
    highLight: false,
    title: '',
    subtitle1: '',
    subtitle2: '',
    onPress: () =>
      navigation.navigate('ViewReadingScreen', {validNavigation: true}),
  });

  useFocusEffect(
    useCallback(() => {
      if (isLoggedIn) {
        console.log('Getting Markers...');
        if (!readings.length) {
          dispatch(fetchAllReadings());
        }
      } else {
        dispatch(emptySyncedReadings());
      }
    }, [dispatch, isLoggedIn, readings.length]),
  );

  useEffect(() => {
    if (readings) {
      setActiveMarkers(readings.map(() => false));
    } else {
      setActiveMarkers([]);
    }
  }, [readings]);

  const screenWidth = Dimensions.get('window').width;
  const cardAnimation = useRef(new Animated.Value(screenWidth)).current;

  useEffect(() => {
    Animated.timing(cardAnimation, {
      toValue: activeCard ? 0 : screenWidth,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [activeCard, cardAnimation, screenWidth]);

  const handleMarkerPress = (index: number) => {
    const newActiveMarkers = activeMarkers.map((marker, i) => {
      if (i === index) {
        const tempCardData: ICardProps = {
          isIcon: false,
          highLight: readings[i].isSafe,
          title: `Reading ${readings[i].id}`,
          subtitle1: `${readings[i].location.latitude}, ${readings[i].location.longitude}`,
          subtitle2: `Date: ${readings[i].datetime.date}`,
          onPress: () =>
            navigation.navigate('ViewReadingScreen', {
              validNavigation: true,
              readingId: readings[i].id,
            }),
        };
        setActiveCard(!marker);
        setCardData(tempCardData);
        return !marker;
      } else {
        return false;
      }
    });
    setActiveMarkers(newActiveMarkers);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={{width: '100%', height: '100%'}}
        provider={PROVIDER_GOOGLE}
        showsUserLocation
        zoomControlEnabled={false}
        toolbarEnabled={false}
        userInterfaceStyle={isDarkMode ? 'dark' : 'light'}
        showsMyLocationButton={false}
        showsBuildings={false}
        showsTraffic={false}
        showsIndoors={false}
        initialRegion={{
          latitude: 51.38,
          longitude: -2.33,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>
        {readings.map((reading: TReading, index: number) => {
          if (reading.location) {
            if (reading.location.latitude && reading.location.longitude) {
              return (
                <MapIcon
                  key={index}
                  index={index}
                  onActive={handleMarkerPress}
                  active={activeMarkers[index]}
                  {...reading.location}
                  isSafe={reading.isSafe}
                />
              );
            }
          }
        })}
      </MapView>
      <Animated.View
        style={[
          styles.cardContainer,
          {
            transform: [
              {
                translateX: cardAnimation,
              },
            ],
          },
        ]}>
        <Card {...cardData} />
      </Animated.View>
    </View>
  );
}
