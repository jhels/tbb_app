import React, {useContext, useCallback, ReactElement} from 'react';
import {View, Text, ScrollView} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {NewsParamList} from '../../scripts/screen_params';

import {styles} from './view_news_styles';
import {styles as globalStyles} from '../../../App_styles';

import {ColorContext} from '../../context/color_context';

import TopNav from '../../components/top_nav/top_nav';
import NewsSvg from '../../svgs/news.svg';

import {useAppSelector} from '../../scripts/redux_hooks';
import {
  selectContainerContrast,
  selectPageContrast,
  selectTextContrast,
} from '../../slices/colorSlice';
import {selectNewsById} from '../../slices/newsSlice';
import {TNews} from '../../scripts/types';

type Props = NativeStackScreenProps<NewsParamList, 'ViewNewsScreen'>;

export default function ViewNewsScreen({
  navigation,
  route,
}: any): ReactElement<Props> {
  // Get the contrast settings from the redux store
  const containerContrast = useAppSelector(selectContainerContrast);
  const pageContrast = useAppSelector(selectPageContrast);
  const textContrast = useAppSelector(selectTextContrast);
  const {color} = useContext(ColorContext);

  useFocusEffect(
    useCallback(() => {
      if (!route.params.validNavigation) {
        navigation.popToTop();
      }
      route.params.validNavigation = false;
    }, [navigation, route.params]),
  );

  const news = useAppSelector(state =>
    selectNewsById(state, {id: route.params.newsId}),
  );

  const [article, setArticle] = React.useState<TNews>({
    id: '',
    title: '',
    author: '',
    description: '',
    datetime: {
      date: '',
      time: '',
    },
    contents: [],
  });

  React.useEffect(() => {
    if (news) {
      setArticle(news);
    }
  }, [news]);

  return (
    <View style={[styles.container, pageContrast]}>
      <TopNav handlePress={() => navigation.goBack()} />
      <ScrollView
        style={styles.body}
        contentContainerStyle={{
          paddingBottom: 200,
        }}>
        <Text style={[styles.title, textContrast]}>{article.title}</Text>
        <View
          style={[
            globalStyles.tile,
            styles.subtitleContainer,
            containerContrast,
          ]}>
          <Text style={styles.subtitle}>{article.author}</Text>
          <Text style={styles.subtitle}>{article.datetime.date}</Text>
        </View>
        <View style={styles.svgContainer}>
          <NewsSvg
            height="100%"
            width="100%"
            color={color}
            style={styles.svg}
          />
        </View>
        <View style={styles.content}>
          {article.contents.map((section: any, sectionIndex: number) => {
            return (
              <View
                key={sectionIndex}
                style={[
                  globalStyles.tile,
                  styles.paragraphsContainer,
                  containerContrast,
                ]}>
                <Text style={[styles.heading, textContrast]}>
                  {section.heading}
                </Text>
                {section.paragraphs.map(
                  (paragraph: any, paragraphIndex: number) => {
                    return (
                      <Text
                        key={paragraphIndex}
                        style={[styles.text, textContrast]}>
                        {paragraph}
                      </Text>
                    );
                  },
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
