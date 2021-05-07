import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather'

export default function TaskList({data, deleteItem}) {
 return (
   <View style={styles.container}>
       <TouchableOpacity style={{marginRight: 10}} onPress={() => deleteItem(data.key)}>
           <Icon name="trash" color="#FFF" size={20} />
       </TouchableOpacity>

       <View style={{paddingRight: 15}}>
           <Text style={{paddingRight: 10, color: '#fff'}}>{data.nome}</Text>
       </View>
   </View>
   
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#121212',
        alignItems: 'center',
        marginBottom: 10,
        padding: 10,
        borderRadius: 5
    }
})