$(document).ready(function(){
	//Inicia o banco de dados assim que a página é carregada
	initDBEngine();
	openDB();
    if (localStorage.getItem("isSignedIn") === null) {
        localStorage.setItem('isSignedIn', false);
    }

    if(localStorage.getItem("isSignedIn") == 'true') {
        console.log("entrei");
        let html ="";
        html += ` <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Bem vindo <span class="text-white">`+localStorage.getItem("nomeLogado")+`</span></a>
                    <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                      <a id="btnLogout" class="dropdown-item" href="#">Sair</a>
                </li>`;

        $(".remove-if-logged").remove();
        $(".lista-navbar").append(html);
    }
    
	//Adiciona Listeners

	// Intercepta o click do botão Logar
    $("#btnLogin").click(function () {
        let campoEmail = $("#inputEmail").val();
        let campoSenha = $("#inputSenha").val();
        let usuarioLogin = { email: campoEmail, senha: campoSenha };

        logar(usuarioLogin, function (usuario) {
        	console.log(usuario);
        	if(usuario != null){
        		localStorage.setItem('isSignedIn', true);
                localStorage.setItem('nomeLogado', usuario.nome)
                window.location = '../index.html'
        	}
        });
    });

    $("#btnLogout").click(function () {
        localStorage.setItem('isSignedIn', false);
        localStorage.removeItem('nomeLogado');
        window.location.reload();
    });   

    $("#btnCadastro").click(function () {
        if (!$('#form-cadastro')[0].checkValidity()) {
            alert("Preencha o formulário corretamente.");
            return;
        }
        let campoNome = $("#inputNome").val();
        let campoEmail = $("#inputEmail").val();
        let campoSenha = $("#inputSenha").val();
        
        contaUsuarios(function(qtdUsuarios){
            if(qtdUsuarios == 0){
                let usuario = { nome: campoNome, email: campoEmail, senha: campoSenha, tipoUsuario: 'adm'  };
                insertUsuario(usuario);
                window.location = 'login.html'
            } else if (qtdUsuarios > 0) {
                let usuario = { nome: campoNome, email: campoEmail, senha: campoSenha, tipoUsuario: 'comum'  };
                insertUsuario(usuario);
                window.location = 'login.html'
            } else {
                alert("Ocorreu um erro ao inserir o usuário!");
            }
        });
    });

});


