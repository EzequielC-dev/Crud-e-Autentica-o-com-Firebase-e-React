import { useState, useEffect } from "react";
import { db } from "./services/firebase/firebase";
import { 
  doc, 
  setDoc,
  collection,
  addDoc,
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  onSnapshot } from "firebase/firestore"

function App() {
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [idPost, setIdPost] = useState("");

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function loadPosts() {
      const unsub = onSnapshot(collection(db, "posts"), (snapshot) => {
        let listPost = [];

        snapshot.forEach((doc) => {
          listPost.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor,
          })
        })
        setPosts(listPost) 
      })
    }
    loadPosts();
  }, [])

  async function handleAdd() {
    // importamos o doc pra podermos acessar a referência
    // await setDoc(doc(db, 'posts', '2432'), {
    //   titulo: titulo,
    //   autor: autor,
    // })
    // .then(() => {
    //   alert("Cadastro feito com sucesso")
    //   setAutor('')
    //   setTitulo('')
    // })
    // .catch((erro) => {
    //   console.log(erro)
    // })

    //no setDoc você especifica o elemento que você quer criar, o addDoc seria um auto-ID de forma nativa

    await addDoc(collection(db, "posts"), {
      titulo: titulo,
      autor: autor,
    })
    .then(() => {
      alert("Cadastro feito com sucesso");
      setAutor('');
      setTitulo('');
    })
    .catch((erro) => {
      console.log(erro);
    })
  }

  async function buscarPost() {
    // const postRef = doc(db, "posts", "Xp930NtwwNzGjGlkxXZC")
    // await getDoc(postRef)
    // .then((receberDado) => {
    //   setAutor(receberDado.data().autor)
    //   setTitulo(receberDado.data().titulo)
    // })
    // .catch((erro) => {
    //   console.log(erro)
    // })

    const postsRef = collection(db, "posts")
    await getDocs(postsRef)
    .then((snapshot) => {
      let lista = [];
      snapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          titulo: doc.data().titulo,
          autor: doc.data().autor,
        });
      })
      setPosts(lista);

    })
    .catch((erro) => {
      console.log(erro);
    })
  }

  async function editarPost() {
    const docRef = doc(db, "posts", idPost)
    await updateDoc(docRef, {
      titulo: titulo,
      autor: autor,
    })
    .then(() => {
      alert("Post atualizado")
      setIdPost('')
      setTitulo('')
      setAutor('')
    })
    .catch((erro) => {
      console.log(erro);
    })
  }

  async function excluirPost(id) {
    const docRef = doc(db, "posts", id) 
    await deleteDoc(docRef)
    .then(() => {
      alert("Post deletado com sucesso")
    })
    .catch((erro) => {
      console.log(erro)
    })
  }

  return (
    <>
      <div className="flex justify-center">
        <div className="w-[600px] flex flex-col border-solid border-2 border-black">

          <label>ID do Post:</label>
          <input 
          placeholder="Digite o ID do post"
          value={idPost}
          type="text"
          onChange={(e) => {
            setTitulo(e.target.value);
          }} 
          /> <br />
 
          <label>Titulo:</label>
          <textarea value={titulo} onChange={(e) => {
            setTitulo(e.target.value)}} type="text" placeholder="digite o título" className="border-solid border-2 border-black"></textarea>

          <label>Autor:</label>
          <input type="text" value={autor} onChange={(e) => {
            setAutor(e.target.value)}} placeholder="autor do post" className="border-solid border-2 border-black" />

          <button onClick={handleAdd}>Cadastrar</button>
          <button onClick={buscarPost}>Buscar Post</button>

          <button onClick={editarPost}>Atualizar Post</button>

          <ul>
            {posts.map((post) => {
              return (
                <li key={post.id} className="mb-3">
                  <span>Titulo: {post.titulo}</span> <br />
                  <span>Autor: {post.autor}</span> <br />
                  <span className="font-bold">ID: {post.id}</span> 
                  <button onClick={() => excluirPost(post.id)}>Excluir o Post</button>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </>
  );
}

export default App;
