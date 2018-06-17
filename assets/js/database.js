// variáveis que armazenam a conexão ao banco de dados
var db_app;
// Constantes para nomes do banco de dados e ObjectStores
const CONST_DB_APP = "alveus-tech.br.db_app";
const CONST_OS_USUARIO = "alveus_tech";
const CONST_OS_POSTS = "posts_alveus_tech";
const CONST_OS_COMENTARIOS = "comentarios_alveus_tech";

function initDBEngine() {
    // Na linha abaixo, você deve incluir os prefixos do navegador que você vai testar.
    window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    // Não use "let indexedDB = ..." se você não está numa function.
    // Posteriormente, você pode precisar de referências de algum objeto window.IDB*:
    window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
    window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
    // (Mozilla nunca usou prefixo nesses objetos, então não precisamos window.mozIDB*)

    if (!window.indexedDB) {
        window.alert("Seu navegador não suporta uma versão estável do IndexedDB. Alguns recursos não estarão disponíveis.");
    }
}


function getObjectStore(store_name, mode) {
    let tx = db_app.transaction(store_name, mode);
    return tx.objectStore(store_name);
}

function openDB() {
	//Função para abrir o banco de dados
	//Abre o banco caso exista, caso não exista cria um novo
    request = indexedDB.open(CONST_DB_APP);

    request.onerror = function (event) {
        alert("Você não habilitou minha web app para usar IndexedDB?!");
    };
    request.onsuccess = function (event) {
        db_app = request.result;
    };
    request.onupgradeneeded = function (event) {
        let store = event.currentTarget.result.createObjectStore(
            CONST_OS_USUARIO, { keyPath: 'email'});

        store.createIndex('nome', 'nome', { unique: true });
        store.createIndex('senha', 'senha', { unique: false });
        store.createIndex('tipoUsuario', 'tipoUsuario', { unique: false });

        let store2 = event.currentTarget.result.createObjectStore(
            CONST_OS_POSTS, {keyPath: 'id', autoIncrement: true });

        store2.createIndex('titulo', 'titulo', { unique: true });
        store2.createIndex('subtitulo', 'subtitulo', { unique: false });
        store2.createIndex('corpo', 'corpo', { unique: false });
        store2.createIndex('img', 'img', { unique: false });
        store2.createIndex('ativo', 'ativo', { unique: false });

        let store3 = event.currentTarget.result.createObjectStore(
            CONST_OS_COMENTARIOS, {keyPath: 'id', autoIncrement: true });

        store3.createIndex('conteudo', 'conteudo', { unique: false });
        store3.createIndex('autor', 'autor', { unique: false });
        store3.createIndex('data', 'data', { unique: false });
        store3.createIndex('dataSistema', 'dataSistema', { unique: false });
        store3.createIndex('postRelacionado', 'postRelacionado', { unique: false });
        
        // Carrega dados ficticios
        //loadDadosUsuarios(store);
    };
}


function logar(usuario, callback) {
	let usuarioEncontrado = false;
	let store = getObjectStore(CONST_OS_USUARIO, 'readonly');
    let req = store.get(usuario.email);

    req.onsuccess = function (event) {
    	if(req.result == null) {
    	    alert("Login inválido! Usuário não encontrado!");
    	} else if(req.result.senha == usuario.senha){
	    	let record = req.result;
	        callback (record);    		
    	} else if (req.result.senha != usuario.senha){
    		alert("Senha inválida!");
    	}

    };

    req.onerror = function (event) {
        alert("Login inválido! Usuário não encontrado!");
    };
}


function insertUsuario(usuario) {
    let store = getObjectStore(CONST_OS_USUARIO, 'readwrite');
    let req = store.add(usuario);

    req.onsuccess = function (evt) {
        console.log("Usuário inserido com sucesso.");
        alert("Usuário inserido com sucesso");
    };

    req.onerror = function () {
        console.error("Erro ao adicionar usuario: ", this.error);
        alert("Erro ao adicionar usuario: " + this.error);
    };
}

function contaUsuarios(callback) {
    let store = getObjectStore(CONST_OS_USUARIO, 'readonly');
    let req = store.count();
    req.onsuccess = function (event) {
        callback(event.target.result);
    };
    req.onerror = function (event) {
        alert("Erro ao obter usuarios:" + event.target.errorCode);
    };
}


function loadDadosUsuarios(store) {
    // Isso é o que os dados de nossos clientes será.
    const dadosUsuarios = [
        { email: "gabriel.haddad15@gmail.com", nome: "Gabriel haddad", senha: "teste", tipoUsuario: 'adm' },
        { email: "TESTE.TESTE@gmail.com", nome: "TESTE TESTE", senha: "TESTE", tipoUsuario: 'comum' }
    ];

    let req;
    dadosUsuarios.forEach((element, index) => { req = store.add(element) });
    req.onsuccess = function (evt) { };
    req.onerror = function () { };
}

function insertPost(post){
    let store = getObjectStore(CONST_OS_POSTS, 'readwrite');
    let req;
    req = store.add(post);

    req.onsuccess = function (evt) {
        console.log("Postado com sucesso.");
        alert("Postado com sucesso");
    };

    req.onerror = function () {
        console.error("Erro ao postar", this.error);
        alert("Ocorreu um erro ao postar: " + this.error);
    };
}

function getAllPosts(callback) {
    let store = getObjectStore(CONST_OS_POSTS, 'readonly');
    let req = store.openCursor();
    req.onsuccess = function (event) {
        let cursor = event.target.result;

        if (cursor) {
            req = store.get(cursor.key);
            req.onsuccess = function (event) {
                let value = event.target.result;
                callback(value);
            }
            cursor.continue();
        }
    };
    req.onerror = function (event) {
        alert11("Erro ao obter posts:", event.target.errorCode);
    };
}

function deletePost(id) {
    let store = getObjectStore(CONST_OS_POSTS, 'readwrite');
    if (typeof id == "string") { id = parseInt(id); }
    let req = store.delete(id);
    req.onsuccess = function (event) {
        alert("Post removido com sucesso");
    };
    req.onerror = function (event) {
        alert("Post não encontrado ou erro ao remover:", event.target.errorCode);
    };
}

function desativarPost(id, post) {
    let store = getObjectStore(CONST_OS_POSTS, 'readwrite');
    if (typeof id == "string") { id = parseInt(id); }
    let req = store.get(id);
    req.onsuccess = function (event) {
        let record = req.result;
        alert('antes ' + record.ativo);
        if(record.ativo){
            record.ativo = false;
        } else {
            record.ativo = true;
        }

        alert('dps ' + record.ativo);
        let reqUpdate = store.put(record);
        reqUpdate.onsuccess = function () {
            alert("Post alterado com sucesso");
        }
        reqUpdate.onerror = function (event) {
            alert("Erro ao alterar contato:", event.target.errorCode);
        };
    };
    req.onerror = function (event) {
        alert("Post não encontrado ou erro ao alterar:", event.target.errorCode);
    };
}

function getPost(id, callback) {
    let store = getObjectStore(CONST_OS_POSTS, 'readwrite');
    if (typeof id == "string") { id = parseInt(id); }
    let req = store.get(id);

    req.onsuccess = function (event) {
        let record = req.result;
        callback (record);
    };
    req.onerror = function (event) {
        alert("Post não encontrado:", event.target.errorCode);
    };
}

function comentar(comentario){
    let store = getObjectStore(CONST_OS_COMENTARIOS, 'readwrite');
    let req;
    req = store.add(comentario);

    req.onsuccess = function (evt) {
        console.log("Postado com sucesso.");
        alert("Postado com sucesso");
    };

    req.onerror = function () {
        console.error("Erro ao postar", this.error);
        alert("Ocorreu um erro ao postar: " + this.error);
    };
}
