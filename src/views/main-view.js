import React, { Component } from 'react';
import axios from 'axios';
import _ from 'lodash';
import { View, Text, StyleSheet, SafeAreaView, Image, AsyncStorage } from 'react-native';
import { SearchBar, Header, Icon } from 'react-native-elements'
import CardList from '../components/lists/card-list.js';
import FilterSelect from '../components/filters/filter-select.js';

import {apiBaseUrl, defaultApiParams} from '../config/mtg-api-config.js';

import designTokens from '../data/design-tokens.js';
import baseColors from '../data/base-colors.js';

/**
 * Main GTM View
 * Responsible for storing all the filtering criteria and
 * use it to fetch data from the API
 */
export default class MainView extends Component {
  state = { 
    cards: [],                          //Array of cards used to render <CardList />
    activeFilters: [],                  //Array of filtering criteria to build api calls. Also used to give <FilterSelect /> a set of options
    filterIntersection: false,          //If true, our filtering criteria will be joint by a comma ',', wich means an intersection; instead of a vertical '|', a union.
    isLoading : true,                   //If true, it will show <ActivityIndicator /> and hide the <CardList /> when waiting for a request response
    isLoadingMore : false,              //Used to render <ActivityIndicator /> at <CardList /> footer when waiting for incremental requests to resolve
    hasError: false,                    //If true, an error icon and text will show
    searchQuery: '',                    //String used to filter results by name
    nextPageToFetch: 1,                 //Integer value user for paginated requests
    shouldFetchMore: true               //If true, <CardList /> will attempt to fetch the next page of content from the API
  }

  async componentDidMount() {
    await AsyncStorage.clear();
    this.setState({isLoading: true}, this.fetchData);
  }

 /**
 * Return request parameters in json or string formats.
 *
 * @param {Integer} page used to get paginated results
 * @param {String} outputFormat used to specify which format we want the parameters in. Can be 'json' or 'string'.
 * @public
 */
  getRequestParams = (page = 1, outputFormat = 'json') => {
      const { searchQuery, activeFilters, filterIntersection } = this.state;
      const joinModeSeparator = filterIntersection ? ',' : '|';

      // NOTE: ?contains=imageUrl is broken and returns cards without imageUrl attribute
      // Since all cards in gatherer have use multiverseID we will use that as a 'contains' value instead
      if(outputFormat === 'json') {
        return ({
          ...defaultApiParams,
          page,
          name: searchQuery,
          colors: activeFilters.join(joinModeSeparator)
        })
      } else if(outputFormat === 'string') {
        return `?page=${page}&pageSize=30&contains=multiverseId${searchQuery && '&name=' + searchQuery}${activeFilters.length > 0 ? '&colors=' + activeFilters.join(joinModeSeparator) : ''}`
      }
  }

  /**
  * Returns true if the values passed do not match the current state
  *
  * @param {String} requestSearchQuery string to test against this.state.searchQuery
  * @param {Array} requestActiveFilters string to test against this.state.activeFilters
  * @param {Boolean} requestFilterIntersection boolean to test against this.state.filterIntersection
  * @public
  */
  isDeprectedRequest = (requestSearchQuery, requestActiveFilters, requestFilterIntersection) => {
    const { searchQuery, activeFilters, filterIntersection } = this.state;
    return requestSearchQuery !== searchQuery || (requestActiveFilters.join("") !== activeFilters.join("")) || requestFilterIntersection !== filterIntersection;
  }

  /**
  * Gets the data from the API. Can be used to make incremental requests.
  * In order to create a smooth user experience, it stores all requests results to AsyncStorage.
  * If the same request is made before an app refresh it will use the data stored instead of
  * making a new request.
  *
  * @param {Boolean} isIncremental if true, will attempt to request data from the next page
  * @public
  */
  fetchData = async (isIncremental = false) => {
    const { searchQuery, activeFilters, filterIntersection, nextPageToFetch } = this.state;
    const page = isIncremental ? nextPageToFetch + 1 : 1;
    const requestParams = this.getRequestParams(page, 'json');
    const requestQueryString = this.getRequestParams(page, 'string');

    const cardStorage = await AsyncStorage.getItem(apiBaseUrl + requestQueryString);
    let hasError = false;
    let data = {};

    if(cardStorage) {
      data = await JSON.parse(cardStorage);
    } else {
      try {
        data = await axios.get(apiBaseUrl, {params: requestParams});
        await AsyncStorage.setItem(apiBaseUrl + requestQueryString, JSON.stringify(data));
      } catch(e) {
        hasError = true;
      }
    }
    if (!this.isDeprectedRequest(searchQuery, activeFilters, filterIntersection)) {
      const cards = data.data.cards;
      const shouldFetchMore = cards.length < data.headers['total-count'];
      this.setState({
        shouldFetchMore,
        hasError,
        isLoading: false,
        isLoadingMore: false,
        nextPageToFetch: 1,
        nextPageToFetch: page,
        cards: isIncremental ? [...this.state.cards, ...cards] : cards
      })
    }
  }

  /**
  * Updates this.state.searchQuery using a value pased by the <SearchBar />
  * Calls this.fetchData afterwards. This call is debounced in order to avoid unnecesary calls for each letter typed
  *
  * @param {String} searchQuery
  * @public
  */
  updateSearch = searchQuery => {
    this.setState({ searchQuery, isLoading: true, cards: [] }, _.debounce(this.fetchData, 1000));
  };

  /**
  * Updates this.state.activeFilters using a value pased by the <FilterSelect />
  * Calls this.fetchData afterwards.
  *
  * @param {Array} filters
  * @param {Integer} joinMode has to be an integer because it comes from the selectedIndex of <ButtonGroup />
  * @public
  */
  applyFilters = (filters, joinMode) => {
    const filterIntersection = joinMode == 1;
    this.setState({activeFilters: filters, filterIntersection, isLoading: true}, this.fetchData);
  }

  render() {
    const { activeFilters, searchQuery, cards, isLoading, isLoadingMore, filterIntersection, shouldFetchMore, hasError } = this.state;
    return (
      <View style={styles.mainContainer}>
        <Header
          containerStyle={styles.mainHeader}
          centerComponent={{ text: 'GATHER THE MAGIC', style: { color: '#fff' } }}
        />
        <View style={styles.filterOptionsContainer}>
            <SearchBar
              containerStyle={{flex: 1}}
              lightTheme={true}
              placeholder="Search by name"
              onChangeText={this.updateSearch}
              onClear={this.fetchData}
              value={searchQuery}
            />
            <FilterSelect
              filters={baseColors}
              activeFilters={activeFilters}
              handleSubmit={this.applyFilters}
              containerStyle={styles.filterSelector}
              touchableStyle={styles.filterSelectorTouchable}
            />
        </View>
        {
          activeFilters.length > 0 &&
          <View style={styles.activeFilters}>
            <Text>Active filters:</Text>
            <View style={styles.activeFiltersList}>
              {
                activeFilters.map((filter, index) => {
                  const hasPlusSeparator = filterIntersection && index > 0;
                  return (
                    <View key={index} style={styles.activeFiltersItem}>
                      {
                        hasPlusSeparator && <Text style={styles.activeFiltersIconSeparator}>+</Text>
                      }
                      <Image style={styles.activeFiltersIcon} source={ baseColors[filter].icon }  />
                    </View>
                  )
                })
              }
            </View>
          </View>
        }

        {
          !hasError ?
            <CardList
              style={styles.cardList}
              cards={cards}
              isLoading={isLoading}
              isLoadingMore={isLoadingMore}
              shouldFetchMore={shouldFetchMore}
              fetchMoreData={() => this.fetchData(true)}
            />
            :
            <View style={styles.feedbackContainer}>
              <Icon style={styles.feedbackIcon} name='error' color={designTokens.colors.warning} size={designTokens.baseSpacer * 5}/>
              <Text style={styles.feedbackText}>There was an error handling your request</Text>
            </View>


        }


      </View>
    )
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1
  },
  mainHeader: {
    backgroundColor: designTokens.colors.main
  },
  filterOptionsContainer: {
    flexDirection: 'row'
  },
  filterSelector: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: designTokens.colors.gray0
  },
  filterSelectorTouchable: {
    paddingLeft: designTokens.baseSpacer,
    paddingRight: designTokens.baseSpacer * 2,
  },
  activeFilters: {
    padding: designTokens.baseSpacer,
    flexDirection: 'row',
    alignItems: 'center'
  },
  activeFiltersList: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  activeFiltersIcon: {
    width: designTokens.baseSpacer * 2,
    height: designTokens.baseSpacer * 2,
  },
  activeFiltersItem: {
    marginLeft: designTokens.baseSpacer / 2,
    flexDirection: 'row',
    alignItems: 'center'
  },
  activeFiltersIconSeparator: {
    marginRight: designTokens.baseSpacer / 2
  },
  cardList: {
    backgroundColor: 'blue'
  },
  feedbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  feedbackIcon: {
    marginTop: designTokens.baseSpacer
  },
  feedbackText: {
    padding: designTokens.baseSpacer * 2
  }
});
