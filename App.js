import React, {useState, useEffect, useRef} from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, FlatList, Keyboard } from 'react-native';
import TaskList from './src/TaskList'
import database from '@react-native-firebase/database'
import Icon from 'react-native-vector-icons/Feather'

export default function App() {

  const [newTask, setNewTask] = useState('')
  const [tasks, setTasks] = useState([])
  const inputRef = useRef(null)
  const [key, setKey] = useState('')

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

      if(key !== '') {
        await database().ref('tarefas').child(key).update({
          nome: newTask
        })
        Keyboard.dismiss()
        setNewTask('')
        setKey('')
        return
      }

      let tarefas = await database().ref('tarefas');
      let chave = tarefas.push().key

      tarefas.child(chave).set({
        nome: newTask
      })
      Keyboard.dismiss()
      setNewTask('')
    }
  }

  async function handleDelete(key) {
    await database().ref('tarefas').child(key).remove()
  }

  function handleEdit(data) {
    setNewTask(data.nome)
    setKey(data.key)
    inputRef.current.focus() //Referenciar o TextInput (59)
  }

 return (
   <View style={styles.container}>

     {key.length > 0 && (
       <View style={{flexDirection: 'row'}}>
       <TouchableOpacity>
         <Icon name="x-circle" size={20} color="#ff0000" />
       </TouchableOpacity>
       <Text style={{marginLeft: 5, marginBottom: 8, color: "#ff0000"}}
       >Você está editando uma tarefa!</Text>
     </View>
     )}

     


     <View style={styles.containerTask}>
       <TextInput
       style={styles.input}
       placeholder="Adicione uma tarefa"
       underlineColorAndroid="transparent"
       onChangeText={(text) => setNewTask(text)}
       value={newTask}
       ref={inputRef}
       />
       <TouchableOpacity style={styles.buttonAdd} onPress={handleAdd}>
         <Text style={styles.buttonText}>+</Text>
       </TouchableOpacity>
     </View>

     <FlatList 
     data={tasks}
     keyExtractor={item => item.key}
     renderItem={({item}) => (
       <TaskList data={item} deleteItem={handleDelete} editItem={handleEdit} />
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