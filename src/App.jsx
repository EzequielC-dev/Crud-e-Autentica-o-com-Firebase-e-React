import { useState, useEffect, useReducer } from "react";
import { db, auth } from "./services/firebase/firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
 } from "firebase/auth"
import { 
  doc, 
  setDoc,
  collection,
  addDoc,
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  onSnapshot,
} from "firebase/firestore"
import firebase from "firebase/compat/app";

function App() {
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [idPost, setIdPost] = useState("");

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [user, setUser] = useState("");
  const [userDetail, setUserDetail] = useState("");

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

  useEffect(() => {
    async function checkLogin() {
        onAuthStateChanged(auth, (user) => {
          if(user) {
            //se tem usuário logado ele entra aqui
            setUser(true);
            setUserDetail({
              uid: user.uid,
              email: user.email,
            })
          } else {
            //não existe nenhum usuário logado
            setUser(false);
            setUserDetail({});
          }
        })
    }
    checkLogin();
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

  async function novoUsuario() {
    await createUserWithEmailAndPassword(auth, email, senha)
    .then(() => {
      alert("Cadastro feito com sucesso");
      setEmail("");
      setSenha("");
    })
    .catch((erro) => {
      if(erro.code === "auth/weak-password") {
        alert("Senha muito fraca")
      } else if(erro.code === "auth/email-already-in-use") {
        alert("Esse email já existe!")
      }
    })
  }

  async function logarUsuario() {
    await signInWithEmailAndPassword(auth, email, senha)
    .then((value) => {
      // Value = detalhes do usuário que foi logado
      alert("Logado com sucesso");

      setUserDetail({
        uid: value.user.uid,
        email: value.user.email,
      })
      setUser(true);

      setEmail("");
      setSenha("");
    })
    .catch((erro) => {
      console.log(erro);
    })
  }

  async function fazerLogout() {
    await signOut(auth)
    setUser(false)
    setUserDetail({})
  }

  return (
    <>
      <div className="flex justify-center">

        <div className="flex flex-col justify-start">
          <h1>Usuários</h1>

          { user && (
            <div>
              <strong>Seja bem-vindo, você está logado!</strong>
              <span>ID: {userDetail.uid} - Email: {userDetail.email}</span>
              <button onClick={fazerLogout}>Sair da conta</button>
              <br />
            </div>
          )}

          <label>Email</label>
          <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Digite seu email"/>

          <label>Senha</label>
          <input type="text" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Digite sua senha"/>

          <button onClick={novoUsuario}>Cadastrar</button>
          <button onClick={logarUsuario}>Fazer Login</button>
        </div>

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
