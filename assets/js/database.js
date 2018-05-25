// variáveis que armazenam a conexão ao banco de dados
var db_app;
// Constantes para nomes do banco de dados e ObjectStores
const CONST_DB_APP = "alveus-tech.br.db_app";
const CONST_OS_USUARIO = "alveus_tech";

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
	//bre o banco caso exista, caso não exista cria um novo
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
        // store.createIndex('email', 'email', { unique: true });
        store.createIndex('senha', 'senha', { unique: false });

        // Carrega dados ficticios
        loadDadosUsuarios(store);
    };
}


function logar(usuario, callback) {
	let usuarioEncontrado = false;
	let store = getObjectStore(CONST_OS_USUARIO, 'readonly');
    let req = store.get(usuario.email);

    req.onsuccess = function (event) {
    	console.log(req);
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


function loadDadosUsuarios(store) {
    // Isso é o que os dados de nossos clientes será.
    const dadosUsuarios = [
        { email: "gabriel.haddad15@gmail.com", nome: "Gabriel haddad", senha: "teste" },
        { email: "TESTE.TESTE@gmail.com", nome: "TESTE TESTE", senha: "TESTE" }
    ];

    let req;
    dadosUsuarios.forEach((element, index) => { req = store.add(element) });
    req.onsuccess = function (evt) { };
    req.onerror = function () { };
}