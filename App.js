import React, {useState, useEffect} from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, FlatList, Keyboard } from 'react-native';
import TaskList from './src/TaskList'
import database from '@react-native-firebase/database'

export default function App() {

  const [newTask, setNewTask] = useState('')
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    async function loadTasks() {
      await database().ref('tarefas').on('value', (snapshop) => {
        setTasks([]);
        snapshop.forEach((childItem) => {
          let data = {
            key: childItem.key,
            nome: childItem.val().nome
          }
          setTasks(oldArray => [...oldArray, data])
        })
      })
    }
    loadTasks()
  }, [])

  async function handleAdd() {
    if(newTask !== '') {
      let tarefas = await database().ref('tarefas');
      let chave = tarefas.push().key

      tarefas.child(chave).set({
        nome: newTask
      })
      alert('Tarefa adicionada!')
      Keyboard.dismiss()
      setNewTask('')
      

    }
  }

  async function handleDelete(key) {
    await database().ref('tarefas').child(key).remove()
  }

 return (
   <View style={styles.container}>
     <View style={styles.containerTask}>
       <TextInput
       style={styles.input}
       placeholder="Adicione uma tarefa"
       underlineColorAndroid="transparent"
       onChangeText={(text) => setNewTask(text)}
       value={newTask}
       />
       <TouchableOpacity style={styles.buttonAdd} onPress={handleAdd}>
         <Text style={styles.buttonText}>+</Text>
       </TouchableOpacity>
     </View>

     <FlatList 
     data={tasks}
     keyExtractor={item => item.key}
     renderItem={({item}) => (
       <TaskList data={item} deleteItem={handleDelete} />
     )}
     />
   </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 25,
    marginLeft: 10,
    marginRight: 10
  },
  containerTask: {
    flexDirection: 'row'
  },
  input: {
    flex: 1,
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#121212',
    height: 40
  },
  buttonAdd: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    backgroundColor: '#121212',
    paddingLeft: 14,
    paddingRight: 14,
    marginLeft: 5
  },
  buttonText: {
    fontSize: 25,
    color: "#FFF"
  }
  
})