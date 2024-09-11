import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import SearchableDropdown from 'react-native-searchable-dropdown';

const App = () => {
  const [amount, setAmount] = useState('');
  const [inputAmount, setInputAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState({ id: 'USD', name: 'USD' });
  const [toCurrency, setToCurrency] = useState({ id: 'EUR', name: 'EUR' });
  const [currencies, setCurrencies] = useState([]);
  const [convertedAmount, setConvertedAmount] = useState(null);

  useEffect(() => {
    fetch('https://v6.exchangerate-api.com/v6/82c8821c42847a8de13b23c8/latest/USD')
      .then((response) => response.json())
      .then((data) => {
        const currencyList = Object.keys(data.conversion_rates).map(currency => ({ id: currency, name: currency }));
        setCurrencies(currencyList);
      })
      .catch((error) => {
        console.error('Error fetching currency data: ', error);
      });
  }, []);

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleConvert = () => {
    if (!amount) {
      setConvertedAmount(null);
      return;
    }
    fetch(`https://v6.exchangerate-api.com/v6/82c8821c42847a8de13b23c8/latest/${fromCurrency.id}`)
      .then((response) => response.json())
      .then((data) => {
        const exchangeRates = data.conversion_rates;
        const conversionRate = exchangeRates[toCurrency.id];

        if (conversionRate) {
          const result = parseFloat(amount) * conversionRate;
          setConvertedAmount(result.toFixed(2));
        } else { 
          setConvertedAmount('Invalid Currency');
        }
      })
      .catch((error) => {
        console.error('Error converting currency: ', error);
      });
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
      }}>
      <View
        style={{
          width: '90%',
          height: '80%',
          elevation: 100,
          backgroundColor: 'white',
          borderRadius:10,
        }}>
        <Text
          style={{
            fontSize: 28,
            fontWeight: 'bold',
            color: 'blue',
            alignSelf: 'center',
            marginTop: 40,
          }}>
          Currency Converter
        </Text>
        <TextInput
          style={{
            width: '80%',
            height: 40,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 5,
            paddingHorizontal: 10,
            marginBottom: 30,
            alignSelf: 'center',
            marginTop: 20,
            color:'black'
          }}
          value={amount}
          onChangeText={(text) => setAmount(text)}
          keyboardType="numeric"
          placeholder="Enter amount"
          placeholderTextColor="grey"
        />
        <View
          style={{
            flexDirection: 'row',
            width: '90%',
            marginBottom: 10,
            marginLeft: 25
          }}>
          <Text
            style={{
              fontSize: 19,
              marginTop: 10,
              color: 'black'
            }}>From Currency:</Text>
          <SearchableDropdown
            onTextChange={(text) => console.log(text)}
            onItemSelect={(item) => setFromCurrency(item)}
            containerStyle={{ padding: 5 }}
            textInputStyle={{
              color: 'black',
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 5,
              padding: 12,
              maxHeight: 40,
              width: 130,
            }}
            placeholderTextColor="black"
            itemStyle={{
              padding: 10,
              marginTop: 2,
              backgroundColor: '#ddd',
              borderColor: '#bbb',
              borderWidth: 1,
            }}
            itemTextStyle={{ color: 'black' }}
            itemsContainerStyle={{ maxHeight: 150, width: 130, textAlign: 'center' }}
            items={currencies}
            defaultIndex={currencies.findIndex(item => item.id === fromCurrency.id)}
            placeholder={fromCurrency.name}
            resetValue={false}
            underlineColorAndroid="transparent"
          />
        </View>
        <TouchableOpacity
          style={{
            marginBottom: 10,
            borderRadius: 20,
          }} onPress={swapCurrencies}>
          <Text style={{
            fontSize: 35,
            color: 'blue',
            alignSelf: 'center'
          }}>&#8646;</Text>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
            width: '90%',
            marginBottom: 10,
            marginLeft: 25,
          }}>
          <Text
            style={{
              fontSize: 20,
              marginTop: 10,
              color: 'black'
            }}>
            To Currency:
          </Text>
          <SearchableDropdown
            onTextChange={(text) => console.log(text)}
            onItemSelect={(item) => setToCurrency(item)}
            containerStyle={{ padding: 5 }}
            textInputStyle={{
              color: 'black',
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 5,
              padding: 12,
              maxHeight: 40,
              width: 140
            }}
            placeholderTextColor="black"
            itemStyle={{
              padding: 10,
              marginTop: 2,
              backgroundColor: '#ddd',
              borderColor: '#bbb',
              borderWidth: 1,
              maxHeight: 40, width: 150
            }}
            itemTextStyle={{ color: 'black' }}
            itemsContainerStyle={{ maxHeight: 150, width: 140 }}
            items={currencies}
            defaultIndex={currencies.findIndex(item => item.id === toCurrency.id)}
            placeholder={toCurrency.name}
            resetValue={false}
            underlineColorAndroid="transparent"
          />
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: 'blue',
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 5,
            marginBottom: 20,
            width: '88%',
            marginTop: 30,
            alignSelf: 'center',
          }} onPress={handleConvert}>
          <Text
            style={{
              color: '#fff',
              fontSize: 16,
              alignSelf: 'center'
            }}>
            Convert
          </Text>
        </TouchableOpacity>
        {convertedAmount !== null && (
          <Text
            style={{
              fontSize: 25,
              color: 'blue',
              alignSelf: 'center',
              marginTop: 19,
            }}>
            {amount} {fromCurrency.name} is {convertedAmount} {toCurrency.name}
          </Text>
        )}
      </View>
    </View>
  );
};

export default App;
