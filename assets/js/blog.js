$(document).ready(function(){
	$(document).on('click', '#blog-post', function(e){
		let post = this;
		let idPost = post.childNodes[1].childNodes[3].firstChild.childNodes[1].firstChild.nodeValue;
    getPost(idPost, function(post){
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

        data = horas + ':' + min + ':' + sec + ' ' + mm + '/' + dd + '/' + yyyy;

        let comentario = {conteudo: campoComentario, data: data, autor: autor.nome, dataSistema: dataSistema, postRelacionado: post.id};
        console.log(comentario);
        comentar(comentario);

        $("#comentario").val() = '';
      }

    });

}