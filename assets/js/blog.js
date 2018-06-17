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
          <div class="row">
            <div class="col-md-12">
              <label for="comentario">Deixe um comentário!/label>
              <textarea class="form-control" id="comentario" rows = 2></textarea>
            </div>
          </div>
          <button id="btnPostarComentario" class="btn-lg btn-dark">Comentar</button>
          `;
    $("#blog-content").append(html);
}