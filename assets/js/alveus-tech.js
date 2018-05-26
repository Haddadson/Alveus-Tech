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
        html += `<li class="nav-item">
                     <a id="btnLogout" class="nav-link">Sair</a>
                 </li> `;

        $(".remove-if-logged").remove();
        $(".lista-navbar").append(html);
    }
    
	//Adiciona Listeners

	// Intercepta o click do botão Logar
    $("#btnLogin").click(function () {
        let campoEmail = $("#inputEmail").val();
        let campoSenha = $("#inputSenha").val();
        console.log(campoSenha);
        let usuarioLogin = { email: campoEmail, senha: campoSenha };

        logar(usuarioLogin, function (usuario) {
        	console.log(usuario);
        	if(usuario != null){
        		localStorage.setItem('isSignedIn', true);
                window.location = '../index.html'
        	}
        });
    });

    $("#btnLogout").click(function () {
        localStorage.setItem('isSignedIn', false);
        window.location.reload();
    });   
});

