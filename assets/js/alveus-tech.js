$(document).ready(function(){
	//Inicia o banco de dados assim que a página é carregada
	initDBEngine();
	openDB();
	console.log("C ta logado ? " + isLogged);
	//Adiciona Listeners

	// Intercepta o click do botão Logar
            $("#btnLogin").click(function () {
                let campoNome = $("#inputNome").val();
                let campoEmail = $("#inputEmail").val();
                let campoSenha = $("#inputSenha").val();
                let usuarioLogin = { nome: "Gabriel haddad", email: "gabriel.haddad15@gmail.com", senha: "teste" };

                logar(usuarioLogin, function (usuario) {
                	console.log(usuario);
                	if(usuario != null){
                		var isLogged = true;
                	}
                });
                // $("#form-login")[0].reset();
                
            });

});

