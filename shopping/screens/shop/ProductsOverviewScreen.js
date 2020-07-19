import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, Button, Platform, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';
import ProductItem from '../../components/shop/ProductItem';
import * as cartActions from '../../store/actions/cart';
import Colors from '../../constants/Colors';

// for showing results fetched from API call
import * as productsAction from '../../store/actions/products';

const ProductsOverviewScreen = props => {

  // For loading spinner
  const [isLoading, setIsLoading] = useState(false);

  // For refreshing
  const [isRefreshing, setIsRefreshing] = useState(false);

  // For handling error during HTTP request
  const [error, setError] = useState();

  const products = useSelector(state => state.products.availableProducts);
  const dispatch = useDispatch();

  // Load the product by sending HTTP request
  const loadProducts = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try{
      await dispatch(productsAction.fetchProducts());
    } catch (err) {
      setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch]);

  // Setting up the listener for drawer navitation
  // This will help to re-render the page on navigation
  // Show the product fetched from the server (from action)
  useEffect(() => {
    const willFocus = props.navigation.addListener('willFocus', loadProducts);

    //clean up
    return () => {
      willFocus.remove();
    };
  }, [loadProducts]);

  // Loading for the 1st time
  // Show the product fetched from the server (from action)
  useEffect(() => {
    setIsLoading(true);
    loadProducts().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadProducts]);

  const selectItemHandler = (id, title) => {
    props.navigation.navigate('ProductDetail', {
      productId: id,
      productTitle: title
    });
  };

  // Check for error
  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An error occured!!</Text>
        <Button title="Try Again" onPress={loadProducts} color={Colors.primary} ></Button>
      </View>
    );
  }

  // Loading spinner
  if (isLoading){
    return (
      <View style={styles.centered}>
        <ActivityIndicator size='large' color={Colors.primary} />
      </View>
    );
  }

  // If no data is returned by the spinner
  if (!isLoading && products.length === 0){
    return (
      <View style={styles.centered}>
        <Text>No products found</Text>
      </View>
    );
  }


  return (
    <FlatList
      onRefresh={loadProducts}
      refreshing={isRefreshing}
      data={products}
      keyExtractor={item => item.id}
      renderItem={itemData => (
        <ProductItem
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          onSelect={() => {
            selectItemHandler(itemData.item.id, itemData.item.title);
          }}
        >
          <Button
            color={Colors.primary}
            title="View Details"
            onPress={() => {
              selectItemHandler(itemData.item.id, itemData.item.title);
            }}
          />
          <Button
            color={Colors.primary}
            title="To Cart"
            onPress={() => {
              dispatch(cartActions.addToCart(itemData.item));
            }}
          />
        </ProductItem>
      )}
    />
  );
};

ProductsOverviewScreen.navigationOptions = navData => {
  return {
    headerTitle: 'All Products',
    headerLeft: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
    headerRight: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Cart"
          iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
          onPress={() => {
            navData.navigation.navigate('Cart');
          }}
        />
      </HeaderButtons>
    )
  };
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'

  }
});

export default ProductsOverviewScreen;
