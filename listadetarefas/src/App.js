import './App.css';

import {useEffect, useState} from "react"
import {BsTrash, BsBookmarkCheck, BsBookmarkCheckFill} from "react-icons/bs"


const API = "http://localhost:5000"


function App() {
  const [title, setTitle] = useState("")
  const [time, setTime] = useState('')
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(false)

  //loads de todos  before on page loading
  useEffect(() => {
   
    const loadData = async () => {
      
      setLoading(true)

      const res = await fetch(`${API}/todos`)
      .then((res) => res.json())
      .then((data) => data)
      .catch((res) => console.log(res))


      setLoading(false)

      setTodos(res)


    }
    loadData()

  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const  todo = {
      id : Math.random(),
      title : title,
      time : time,
      done: false

    }

    //envio para api
    await fetch(`${API}/todos`,{
      method: 'POST',
      body: JSON.stringify(todo),
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    setTodos((prevState) => [...prevState, todo])

    setTitle("")
    setTime('')
  }

  const handleEdit = async (todo) => {

    todo.done = !todo.done

    const data = await fetch(`${API}/todos/${todo.id}`,{
      method: 'PUT',
      body: JSON.stringify(todo),
      headers: {
        "Content-Type":"Application/json",
      }
    })

    setTodos((prevState) => prevState.map((t) => (t.id === data.id ? (t = data) : t)))
    
  }


  if(loading){
    return <p>Carregando...</p>
  }

  const handleDelite = async (id) => {
    
      await fetch(`${API}/todos/${id}`,{
        method: 'DELETE',
      })

      setTodos((prevState) => prevState.filter((todo) => todo.id !== id))


  }

  const handleTitle = ({target}) => {
      setTitle(target.value)
      
  }

  const handleTime = ({target}) => {
    setTime(target.value)
  }

  return (
    <div className="App">
      <header className="todo_header">
          <h1>React Todo</h1>    
      </header>
      <section className='form_todo'>
          {todos.length === 0 ?(<h2>Insira uma tarefa</h2>) : ( <h2>Insira a sua Proxima tarefa:</h2> )}
          <form onSubmit={handleSubmit}>
            <div className='form_control'>
                <label htmlFor='title'>O que voçê vai fazer?</label>
                <input 
                  type='text' 
                  name='title' 
                  id='title' 
                  placeholder='Título'
                  onChange={handleTitle} 
                  value = {title || ""}
                  required
                  />
            </div>
            <div className='form_control'>
                <label htmlFor='time'>Duração:</label>
                <input 
                  type='text' 
                  name='time' 
                  id='title' 
                  placeholder='Tempo estimado (em horas)'
                  onChange={handleTime} 
                  value = {time || ""}
                  required
                  />
            </div>
            <button type={'submit'}>Criar tarefa</button>
          </form>  
          
      </section>
      <section className='lista_tudo'>
          <h2>Lista de tarefas:</h2>
          {todos.length === 0 && <p>Não há tarefas</p>}
          {todos.map((todo, index) => (
            <div className='todo' key={todo.id}>
              <h3 className={todo.done? "todo_done" : ""}>{todo.title}</h3>
              <p>Duração: {todo.time}</p>
              <div className='ections'>
                <span onClick={() => handleEdit(todo)}>{!todo.done? <BsBookmarkCheck/> : <BsBookmarkCheckFill/>}</span>
                <BsTrash onClick={() => handleDelite(todo.id)}/>
              </div>
            </div>
          ))}
      </section>
    </div>
  );
}

export default App;
