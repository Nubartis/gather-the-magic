import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { ListItem } from 'react-native-elements';
import baseColors from '../../data/base-colors.js';
import manaIcons from '../../data/mana-icons.js';
import designTokens from '../../data/design-tokens.js'

export default class CardListItem extends React.PureComponent {

  /**
  * Converts a card 'manaCost' attribute into a horisontal list of spheres that resemble Magic The Gathering mana cost style.
  *
  * @param {String} manaCost The string value of a card 'manaCost' attribute. (ej: {3}{B}{U})
  * @public
  */
  renderManaCost = (manaCost) => {
    const iterableManaCost = manaCost.substring(1, manaCost.length -1 ).split("}{");

    return iterableManaCost.map((item, index) => {
      const manaCostName = item.replace(/(\/)*/g, ''); //Hybrid and pyrexian mana costs come as compounds: {X/Y}

      if (manaCostName.length > 0 && !isNaN(manaCostName) || manaCostName === 'X') {
        //Variable colorless mana cost
        return <View key={index} style={styles.manaIconText}><Text style={{fontSize: 10}}>{item}</Text></View>
      } else {
        return <Image key={index} style={styles.manaIconImg} source={ manaIcons[manaCostName].icon }  />
      }
    })
  }

  /**
  * Converts a card 'colors' attribute into a horizontal list of colored shperes
  *
  * @param {Array} colors
  * @public
  */
  renderColorList = (colors) => {
    return (
      <View style={styles.colorList}>
        {
          colors.map((color, index) => {
             return <View key={index} style={{...styles.colorListItem, backgroundColor: baseColors[color.toLowerCase()].value}} />
          })
        }
      </View>
    )
  }

  render() {
    const { itemData, handleOverlayShow } = this.props;
    const isCreature = itemData.types.indexOf("Creature") > -1

    return (
      <View>
        <ListItem
          title={
            <View style={styles.cardlistItemTitle}>
              <View>
                <Text>{ itemData.name }</Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                { itemData.manaCost && this.renderManaCost(itemData.manaCost) }
              </View>
            </View>
          }
          subtitle={
            <View style={styles.cardListItemSubtitle}>
              <View>
                <Text style={styles.typeIndicator}>{ itemData.type }</Text>
              </View>
              <View style={styles.powerThougnhessIndicator}>
                <Text>{isCreature && `${itemData.power} / ${itemData.toughness}`}</Text>
              </View>
              <View style={styles.colorListContainer}>
                {itemData.colors.length > 0 && this.renderColorList(itemData.colors)}
              </View>
            </View>
          }
          leftAvatar={
            {
              source: { uri: itemData.imageUrl },
              rounded: false,
              width: 70,
              height: 100,
              resizeMode: 'cover'
            }
          }
          onPress={ () => {handleOverlayShow(itemData.imageUrl)} }
          bottomDivider
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  cardlistItemTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardListItemSubtitle: {
    marginTop: designTokens.baseSpacer / 2,
    color: '#979797'
  },
  manaIconText: {
    width: 15,
    height: 15,
    borderRadius: 20,
    backgroundColor: '#CBC2BE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: designTokens.baseSpacer / 4
  },
  manaIconImg: {
    width: 15,
    height: 15,
    marginLeft: designTokens.baseSpacer / 4
  },
  colorListContainer: {
    marginTop: designTokens.baseSpacer
  },
  colorList: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  typeIndicator: {
    color: designTokens.colors.gray1
  },
  powerThougnhessIndicator: {
    flexDirection: 'row',
     alignItems: 'center',
     color: '#979797'
   },
  colorListItem: {
    width: 15,
    height: 15,
    borderRadius: 15,
    marginRight: designTokens.baseSpacer / 4
  }
});
