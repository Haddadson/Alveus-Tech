$(document).ready(function(){
	//Inicia o banco de dados assim que a página é carregada
	initDBEngine();
	openDB();
    if (localStorage.getItem("isSignedIn") === null) {
        localStorage.setItem('isSignedIn', false);
    }

    if(localStorage.getItem("isSignedIn") == 'true') {
        let html ="";
        html += ` <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Bem vindo <span class="text-white">`+localStorage.getItem("nomeLogado")+`</span></a>
                    <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                      <a id="btnLogout" class="dropdown-item" href="#">Sair</a>
                </li>`;

        $(".remove-if-logged").remove();
        $(".lista-navbar").append(html);
    }

    if(localStorage.getItem("isSignedIn") == 'true' && localStorage.getItem("tipoUsuario") == 'adm') {
        let html = '';
        html += `<a id="admBlog" class="dropdown-item" href="admBlog.html">Administração do Blog</a>`;
        $("#blog-menu-dropdown").append(html);
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
                localStorage.setItem('nomeLogado', usuario.nome);
                localStorage.setItem('tipoUsuario', usuario.tipoUsuario);
                localStorage.setItem('emailLogado', usuario.email);
                window.location = '../index.html';
        	}
        });
    });

    $("#btnLogout").click(function () {
        localStorage.setItem('isSignedIn', false);
        localStorage.removeItem('nomeLogado');
        localStorage.removeItem('tipoUsuario');
        localStorage.removeItem('emailLogado');
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
                //window.location = 'login.html'
            } else if (qtdUsuarios > 0) {
                let usuario = { nome: campoNome, email: campoEmail, senha: campoSenha, tipoUsuario: 'comum'  };
                insertUsuario(usuario);
               // window.location = 'login.html'
            } else {
                alert("Ocorreu um erro ao inserir o usuário!");
            }
        });
    });
    $("#btnPostar").click(function () {
        if (!$('#form-postagem')[0].checkValidity()) {
            alert("Preencha o formulário corretamente.");
            return;
        }
        let campoTitulo = $("#inputTitulo").val();
        let campoSubtitulo = $("#inputSubTitulo").val();
        let campoCorpo = $("#inputCorpo").val();
              
        let post = { titulo: campoTitulo, subtitulo: campoSubtitulo, corpo: campoCorpo, ativo: true }
        insertPost(post);
        
        $("#form-postagem")[0].reset();
        setTimeout(exibeTodosPosts, 200);   
 
    });

    $("#btnDesativar").click(function () {
        let campoId = $("#inputId").val();
        if (campoId == "") {
            alert("Informe o ID do post a ser alterado.");
            return;
        }
        let campoTitulo = $("#inputTitulo").val();
        let campoSubtitulo = $("#inputSubTitulo").val();
        let campoCorpo = $("#inputCorpo").val();
        let campoAtivo = true;
        let post = { titulo: campoTitulo, subtitulo: campoSubtitulo, corpo: campoCorpo, ativo: campoAtivo };

        desativarPost(campoId, post);
        $("#form-postagem")[0].reset();
        setTimeout(exibeTodosPosts, 200);
    });

    // Intercepta o click do botão Excluir
    $("#btnDelete").click(function () {
        let campoId = $("#inputId").val();
        if (campoId == "") {
            alert("Informe o ID do post a ser excluído.");
            return;
        }
        deletePost(campoId);
        $("#form-postagem")[0].reset();
        setTimeout(exibeTodosPosts, 200);
    });

    $('#inputFoto').change(function(evt){
        handleFileSelect(evt);
    });

    setTimeout(exibeTodosPosts, 200);
    setTimeout(exibePostsAtivos, 200);
    
});

function getUsuarioLogado(){
    let usuario = {
        nome: localStorage.getItem("nomeLogado"),
        tipo: localStorage.getItem("tipoUsuario"),
        email: localStorage.getItem("emailLogado")
    };
    return usuario;
}

function exibeTodosPosts() {
    $("#todos-posts").html('');

    getAllPosts(function (post) {
        let html = "";
        let ativo = "";
        if(post.ativo){
            ativo = "Sim";
        } else {
            ativo = "Não";
        }
        html += ` <section class="container noticia">
                    <div class="col-md-12 card">
                  <div class="row">
                    <div class="col-md-2"><p>Id:`+post.id+`</p></div>
                    <div class="col-md-8 news-text">
                        <h3>`+post.titulo+`</h3>
                        <p class="resumo">`+post.subtitulo+`</p>
                        <p class="leia-mais">Clique para ler mais</p>
                    </div>
                    <div class="col-md-2>
                        <p class="text-dark">Ativo: `+ativo+`</p>
                    </div>
                  </div>
                </div>
                </section>`;
        $("#todos-posts").append(html);
    });
}

function exibePostsAtivos() {
    $('#news').html('');
    getAllPosts(function (post) {
        let html = "";
        if(post.ativo){
            html += ` <section class="container noticia">
                        <div id="blog-post" class="col-md-12 card">
                          <div class="row">
                          <div class="text-center col-md-1"><p>Id: <span class = 'text-dark'>`+post.id+`</span></p></div>
                            <div class="col-md-11 news-text">
                              <a href="#">
                                <h3>`+post.titulo+`</h3>
                                <p class="resumo">`+post.subtitulo+`</p>
                                <p class="leia-mais">Clique para ler mais</p>
                              </a>
                            </div>
                          </div>
                        </div>
                       </section>`;
        }
        $("#news").append(html);
    });    
}


function handleFileSelect(evt) {
  $("#list").html('');
  var files = evt.target.files; // FileList object

  // Loop through the FileList and render image files as thumbnails.
  for (var i = 0, f; f = files[i]; i++) {

    // Only process image files.
    if (!f.type.match('image.*')) {
      continue;
    }

    var reader = new FileReader();

    // Closure to capture the file information.
    reader.onload = (function(theFile) {
      return function(e) {
        // Render thumbnail.
        var span = document.createElement('span');
        span.innerHTML = ['<img class="thumb" src="', e.target.result,
                          '" title="', escape(theFile.name), '"/>'].join('');
        document.getElementById('list').insertBefore(span, null);
      };
    })(f);

    // Read in the image file as a data URL.
    //reader.readAsDataURL(f);
    reader.readAsDataURL(f);
  }
}

// function carregarArquivo(){
//     var file = $('#inputFoto')[0].files[0];
//     var fileReader = new FileReader();
//     fileReader.onloadend = function (e) {
//         var arrayBuffer = e.target.result;
//         blobUtil.arrayBufferToBlob(arrayBuffer, blob).then(function (blob) {
//           console.log('here is a blob', blob);
//           console.log('its size is', blob.size);
//           console.log('its type is', blob.type);
//         }).catch(console.log.bind(console));
//       };
//     fileReader.readAsArrayBuffer(file);
// }