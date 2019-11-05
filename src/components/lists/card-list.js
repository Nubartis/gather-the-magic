import React, { Component } from 'react';
import axios from 'axios';
import { View, FlatList, StyleSheet, Text, ActivityIndicator, TouchableHighlight, Platform, Dimensions } from 'react-native';
import { ListItem, Overlay, Icon, SearchBar, Button, Image } from 'react-native-elements'
import CardListItem from './card-list-item.js'
import manaIcons from '../../data/mana-icons.js';
import designTokens from '../../data/design-tokens.js'

export default class CardList extends Component {
  
  state = {
    isOverlayVisible: false,
    overlayImageUrl: ''
  }

  /**
  * Displays the Overlay by setting this.state.isOverlayVisible to true
  *
  * @public
  */
  handleOverlayShow = (imageUrl) => {
    this.setState({isOverlayVisible: true, overlayImageUrl: imageUrl})
  }

  /**
  * Hides the Overlay by setting this.state.isOverlayVisible to false
  *
  * @public
  */
  handleOverlayHide = () => {
    this.setState({isOverlayVisible: false, overlayImageUrl: ''})
  }

  /**
  * Renders a <CardListItem /> based on card data
  *
  * @param {Object} item data object of a card
  * @public
  */
  renderItem = ({ item }) => {
    return (
      <CardListItem
        handleOverlayShow={this.handleOverlayShow}
        itemData={item}
        />
    )
  }

  /**
  * Renders the list footer with <ActivityIndicator /> for incremental API calls
  *
  * @public
  */
  renderListFooter = () => {
      return (
          <View style={{padding: 8}}>
              <ActivityIndicator size="small" color="#0000ff" />
          </View>
      );
  };

  render() {
    const { cards, isLoading, isLoadingMore, fetchMoreData, shouldFetchMore } = this.props;
    const { isOverlayVisible, overlayImageUrl } = this.state;

    return (
      <View style={styles.mainContainer}>
        {
          isLoading
          ?
            <ActivityIndicator style={styles.ActivityIndicator} size="large" color="#0000ff" />
          :
          <View style={{flex: 1}}>
            <FlatList
              data={cards}
              renderItem={this.renderItem}
              keyExtractor={item => item.id}
              onEndReached={() => {(!isLoadingMore && shouldFetchMore) && fetchMoreData()}}
              onEndReachedThreshold={0.5}
              refreshing={isLoadingMore}
              ListFooterComponent={(cards.length > 0 && shouldFetchMore) && this.renderListFooter}
              ListEmptyComponent={
                <View style={{marginTop: 16, alignItems: 'center'}}>
                  <Icon type='font-awesome' name='folder-open' size={designTokens.baseSpacer * 5}/>
                  <Text style={{marginTop: 8}}>No results found</Text>
                </View>}
            />
            <Overlay
              isVisible={isOverlayVisible}
              fullScreen={true}
              animationType='slide'
              overlayStyle={styles.overlay}
              onRequestClose={this.handleOverlayHide}
              >
              <View>
                <TouchableHighlight style={styles.overlayHeader} onPress={ () => {this.handleOverlayHide()} }>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Icon
                      containerStyle={{alignItems: 'flex-start'}}
                      name='arrow-back'
                      type='material'
                      color='#fff'
                      size={32}
                    />
                    <Text style={styles.overlayHeaderLabel}>CARD PREVIEW</Text>
                  </View>
                </TouchableHighlight>
                <View style={styles.overlayContent}>
                  <Image resizeMode={'contain'} style={styles.overlayImage} source={{ uri: overlayImageUrl }} PlaceholderContent={<ActivityIndicator style={styles.ActivityIndicator}/>} />
                </View>
              </View>
            </Overlay>
          </View>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1
  },
  listItemtitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listItemSubtitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    color: '#979797'
  },
  manaIconText: {
    width: 15,
    height: 15,
    borderRadius: 20,
    backgroundColor: '#CBC2BE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 2
  },
  manaIconImg: {
    width: 15,
    height: 15,
    marginLeft: 2
  },
  ActivityIndicator: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
  },
  overlay: {
    padding:0
  },
  overlayHeader: {
    padding: designTokens.baseSpacer,
    paddingTop: Platform.OS === 'ios' ? designTokens.baseSpacer * 3 : designTokens.baseSpacer,
    backgroundColor: designTokens.colors.main
  },
  overlayHeaderLabel: {
    color: '#FFF',
    marginLeft: designTokens.baseSpacer * 2,
  },
  overlayContent: {
    padding: designTokens.baseSpacer,
    paddingBottom: designTokens.baseSpacer * 2,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  overlayImage: {
    height: Dimensions.get('window').height - 70,
    // maxHeight: 700
    width: 320,
  },
  title: {
    fontSize: 32,
  },
});
