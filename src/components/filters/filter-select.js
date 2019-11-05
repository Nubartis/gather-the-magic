  import React, { Component } from 'react';
  import { View, TouchableHighlight, StyleSheet } from 'react-native';
  import { Overlay, Icon, Button, ButtonGroup, ListItem, Text } from 'react-native-elements'
  import designTokens from '../../data/design-tokens.js'

  export default class FilterSelect extends Component {

    state = {
      updatedFilters: [],
      joinMode: 0,
      isOverlayVisible: false
    }

    /**
    * Displays the Overlay by setting this.state.isOverlayVisible to true
    * Resets this.state.updatedFilters to the default value (passed as param)
    *
    * @public
    */
    handleOverlayShow = () => {
      const activeFilters  = this.props.activeFilters.slice(0);
      this.setState({isOverlayVisible: true, updatedFilters: activeFilters});
    }

    /**
    * Hides the Overlay by setting this.state.isOverlayVisible to false
    * Resets this.state.updatedFilters to the default value (passed as param)
    *
    * @public
    */
    handleOverlayHide = () => {
      const activeFilters  = this.props.activeFilters.slice(0);
      this.setState({isOverlayVisible: false});
    }

    /**
    * Adds or removes an item from this.state.activeFilters depending on
    * wether this item was or not already in this array
    *
    * @param {String} filter The value of the filter to toggle inside this.state.activeFilters
    * @public
    */
    toggleFilter = (filter) => {
      const { updatedFilters } = this.state;
      const filterIndex = updatedFilters.indexOf(filter);

      if(filterIndex === -1){
        updatedFilters.push(filter)
      } else {
        updatedFilters.splice(filterIndex, 1)
      }

      this.setState({updatedFilters: updatedFilters})
    }

    /**
    * Updates this.state.joinMode to the value set on the <ButtonGroup />
    *
    * @param {Integer} joinMode passed from selectedIndex in the <ButtonGroup />
    * @public
    */
    updateJoinMode = (joinMode) => {
      this.setState({joinMode})
    }

    /**
    * Action to be called when the user clicks on the CTA.
    * Used to submit the filtering criteria to its parent.
    *
    * @public
    */
    handleSubmit = () => {
      const { updatedFilters, joinMode } = this.state;
      this.setState({isOverlayVisible: false}, () => {this.props.handleSubmit(updatedFilters.sort(), joinMode)})
    }

    render() {
      const { containerStyle, touchableStyle, filters, activeFilters } = this.props;
      const { updatedFilters, isOverlayVisible, joinMode } = this.state;

      return (
        <View style={containerStyle}>
          <TouchableHighlight
            style={touchableStyle}
            onPress={this.handleOverlayShow}
            underlayColor={designTokens.colors.main}
            >
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon name='filter' type="font-awesome"/>
            </View>
          </TouchableHighlight>
          <Overlay
            isVisible={isOverlayVisible}
            animationType='slide'
            onBackdropPress={this.handleOverlayHide}
            onRequestClose={this.handleOverlayHide}
            >
            <View style={styles.overlayMainContent}>
            <View>
              <View style={styles.overlayHeader}>
                <Text style={styles.overlayTitle}>Select filters:</Text>
                <TouchableHighlight onPress={this.handleOverlayHide}>
                  <Icon name='close' size={designTokens.baseSpacer * 4}/>
                </TouchableHighlight>
              </View>
              <View style={styles.filterList}>
                {
                  Object.keys(filters).map((filter, index) => {
                    return <ListItem
                      key={index}
                      title={filter}
                      leftAvatar={filters[filter].icon && { source: filters[filter].icon }}
                      switch={{
                        value: updatedFilters.indexOf(filter) !== -1,
                        onChange: () => { this.toggleFilter(filter) }
                      }}
                      bottomDivider
                    />
                  })
                }
                </View>
                <View style={styles.joinModeSelector}>
                  <ButtonGroup
                      onPress={this.updateJoinMode}
                      selectedIndex={joinMode}
                      buttons={['OR', 'AND']}
                    />
                </View>
              </View>
              <View>
                <Button
                  containerStyle={{marginTop: 16}}
                  title="Apply filter"
                  onPress={this.handleSubmit}
                  />
              </View>
            </View>
          </Overlay>
        </View>
      )
    }
  }

  const styles = StyleSheet.create({
    overlayMainContent: {
      flex: 1,
      justifyContent: 'space-between'
    },
    filterList: {
      marginTop: designTokens.baseSpacer * 2
    },
    joinModeSelector: {
      marginTop: designTokens.baseSpacer * 2
    },
    overlayHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    overlayTitle: {
      fontSize: designTokens.baseSpacer * 2
    }
  });
