$(document).ready(function(){
	$(document).on('click', '#blog-post', function(e){
		let post = this;
		let idPost = post.childNodes[1].childNodes[3].firstChild.childNodes[1].firstChild.nodeValue;
    getPost(idPost, function(post){
      console.log(post);
			exibirPost(post);
		});

	});
});

function exibirPost(post){
	$("#blog-content").html('');
	let html = '';
	html += `<div class="back-button">
            <a id="back" href="blog.html" class="btn btn-dark">← Voltar para o blog</a>
          </div>
          <div class="row">
            <div class="manchete col-sm-12">
              <h1>`+post.titulo+`</h1>
              <p>`+post.subtitulo+`</p>
            </div>          
          </div>
          <div class="row">
            <div class="corpo col-sm-12">
              <p>`+post.corpo+`</p>
            </div>
          </div>
          <div class="row">
          	<div class="col-sm-3">
              <img class="img-fluid img-noticia allign-center" src="`+post.img+`">
            </div>
          </div>
          <div class="row post-comentario">
            <div class="col-md-12">
              <label for="comentario">Deixe um comentário!</label>
              <textarea class="form-control" id="comentario" rows = 2></textarea>
            </div>
          </div>
          <button id="btnPostarComentario" class="btn-lg btn-dark">Comentar</button>
          <hr>
          <div id="area-comentarios"></div>
          `;
    $("#blog-content").append(html);

    $('#blog-content').on('click', '#btnPostarComentario', function(){
      let campoComentario = $("#comentario").val();

      if (campoComentario != null && campoComentario != '' && typeof(campoComentario) != undefined) {
        let data = new Date();
        let dd = data.getDate();
        let mm = data.getMonth()+1; //Janeiro é 0!
        let yyyy = data.getFullYear();
        let horas = data.getHours();
        let min = data.getMinutes()+1; //Janeiro é 0!
        let sec = data.getSeconds();
        let autor = getUsuarioLogado();
        let dataSistema = Date.now();

        if(dd<10) {
            dd = '0'+dd;
        } 

        if(mm<10) {
            mm = '0'+mm;
        } 

        if(horas<10) {
            horas = '0'+horas;
        } 

        if(min<10) {
            min = '0'+min;
        } 

        if(sec<10) {
            sec = '0'+sec;
        } 

        data = horas + ':' + min + ':' + sec + ' de ' + dd + '/' + mm + '/' + yyyy;

        let comentario = {conteudo: campoComentario, data: data, autor: autor.nome, dataSistema: dataSistema, postRelacionado: post.id};
        console.log(comentario);
        comentar(comentario);

        $('#comentario').val('');
        setTimeout(listaComentarios(post), 200);
      }
    }); //Fim click botão de comentar

    setTimeout(listaComentarios(post), 200);

    
}

function listaComentarios(post){
  $("#area-comentarios").html('');
  var listaDeComentarios = new Array();

  getComentarios(function(comentario){
    if(comentario.postRelacionado == post.id){
      listaDeComentarios.push(comentario);
    }

    listaDeComentarios.sort(compare);
    exibirComentarios(listaDeComentarios);
  });
}

function compare(a,b) {
  if (a.dataSistema > b.dataSistema)
    return -1;
  if (a.dataSistema < b.dataSistema)
    return 1;
  return 0;
}

function exibirComentarios(listaDeComentarios) {
  $("#area-comentarios").html('');
  console.log(listaDeComentarios);
  for (let i = 0; i < listaDeComentarios.length; i++) {
    let html = '';
    html += `<section class="container noticia">
                <div class="col-md-12 card">
                  <div class="row">
                    <div class="col-md-4 col-4"><p class="text-dark font-weight-bold">`+listaDeComentarios[i].autor+`</p></div>
                    <div class="col-md-8 col-8 justify-content-end">
                        <p class="text-grey text-right">`+listaDeComentarios[i].data+`</p>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-10 news-text">
                        <br><p class="resumo">`+listaDeComentarios[i].conteudo+`</p>
                    </div>
                    <div class="col-md-2">
                      <br><p class="text-dark">Curtir    <img src="../assets/img/thumbs-up-icon.png" class="like-icon"></p>
                    </div>
                  </div>
                </div>
              </section>`;
    $("#area-comentarios").append(html);
    
  }

}