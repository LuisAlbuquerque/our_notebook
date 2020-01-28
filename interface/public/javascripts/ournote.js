//const api_link = 'http://localhost:4877/root'
const interface_link = 'http://localhost:5877/root';
const api_link = 'http://localhost:4877/root';

const add_favourite = (path) => {
    axios.post('http://localhost:5877/add_favourite?path=' + path)
        .then(dados => alert("Grupo adicionado aos favoritos"))
        .catch(err => alert("Erro ao adicionar aos favoritos"))
}

const add_comment = (path,id) => {
    console.log("aqui")
    console.log(path)
    console.log(id)
    axios.get(interface_link + path + "?json=true")
        .then(dados =>{
            comments = '<ul>'
            for(card in dados.data.page)
                if(dados.data.page[card]._id == id){ 
                    for( c in dados.data.page[card].comment)
                        comments += '<li>' + dados.data.page[card].comment[c] + '</li>'
                }
            comments += '</ul>'
            console.dir(dados.data)
            var comments = $(comments)

            var form = $('<form class="w3-container" action="' 
                            + interface_link + path +"?update=comment&id="+id +
                            '" method="post" width="100">' +
                            //TODO remove type have a cascade
                            '<textarea  rows = "3" cols="40"  name="comment" placeholder="Comentario" style="font-size: 30px"/>' +
                            '<input type="submit" value="Adicionar"/>' +
                            '</form>'
                        )
            $('#display').empty()
            $('#display').append(comments,form) 
            $('#display').modal()
        })
        .catch(err => console.log(err))
}

const add = (path,type) => {
    var form = $('<form class="w3-container" action="' 
                    + interface_link + path +"?type="+type +
                    '" method="post" width="100">' +
                    //TODO remove type have a cascade
                    '<textarea  rows = "5" cols="40"  name="text" placeholder="Texto" style="font-size: 30px"/>' +
                    '<input id="tags" type="text" name="tags" placeholder="tag1;tag2..." style="font-size: 30px"/>' +
                    '<input type="submit" value="Criar"/>' +
                    '</form>'
                )
    $('#display').empty()
    $('#display').append(form) 
    $('#display').modal()
}

const add_event = (path) => {
    var form = $('<form class="w3-container" action="' 
                    + interface_link + path +"?type=event" +
                    '" method="post" width="100">' +
                    //TODO remove type have a cascade
                    '<input id="text" type="text" name="text" placeholder="Titulo do evento" style="font-size: 30px"/>' +
                    '<input id="data" type="date" name="data" placeholder="data" style="font-size: 30px"/>' +
                    '<input id="tags" type="text" name="tags" placeholder="tag1;tag2..." style="font-size: 30px"/>' +
                    '<input type="submit" value="Criar"/>' +
                    '</form>'
                )
    $('#display').empty()
    $('#display').append(form) 
    $('#display').modal()
}

const add_perm = (path) => {
    var form = $('<form class="w3-container" action="' 
                    + interface_link + path +"?update=add" +
                    '" method="post" width="100">' +
                    //TODO remove type have a cascade
                    '<label>Adicionar permissões de leitura </label><br/>' +
                    '<input id="text" type="text" name="read_perm" placeholder="mail1;mail2;..." style="font-size: 30px"/><br/>' +
                    '<label>Adicionar permissões de escrita</label><br/>' +
                    '<input id="text" type="text" name="write_perm" placeholder="mail1;mail2;..." style="font-size: 30px"/>' +

                    '<input type="submit" value="Criar"/>' +
                    '</form>'
                )
    $('#display').empty()
    $('#display').append(form) 
    $('#display').modal()
}

const remove_perm = (path) => {
    var form = $('<form class="w3-container" action="' 
                    + interface_link + path +"?update=remove" +
                    '" method="post" width="100">' +
                    //TODO remove type have a cascade
                    '<label>Adicionar permissões de leitura </label><br/>' +
                    '<input id="text" type="text" name="read_perm" placeholder="mail1;mail2;..." style="font-size: 30px"/><br/>' +
                    '<label>Adicionar permissões de escrita</label><br/>' +
                    '<input id="text" type="text" name="write_perm" placeholder="mail1;mail2;..." style="font-size: 30px"/>' +

                    '<input type="submit" value="Criar"/>' +
                    '</form>'
                )
    $('#display').empty()
    $('#display').append(form) 
    $('#display').modal()
}


var add_to_list = () => {
    document.getElementById("ul").innerHTML += '<input id="text" type="text" name="text" placeholder="Texto" style="font-size: 30px"/>'
}
const addList = (path,type) => {

    var add = $('<button onclick="(add_to_list())" > + </button>');
    var form = $('<form class="w3-container" action="'
                    + interface_link + path +"?type=list" +
                    '" method="post" width="100">' +
                    //TODO remove type have a cascade
                    '<input id="text" type="text" name="text" placeholder="Texto" style="font-size: 30px"/>' +
                    '<div id="ul"></div>' +
                    '<input id="tags" type="text" name="tags" placeholder="tag1;tag2..." style="font-size: 30px"/>' +
                    '<input type="submit" value="Criar"/>' +
                    '</form>'
                );
    $('#display').empty()
    $('#display').append(form,add)
    $('#display').modal()

}

const addFile = (path) => {
    var form = $('<form class="w3-container" action="' 
                    + interface_link + path +"?type=file"+ 
                    '" method="post" enctype="multipart/form-data">' +
                    //TODO remove type have a cascade
                    '<input type="file" name="file" />' +
                    '<input id="tags" type="text" name="tags" placeholder="tag1;tag2..." style="font-size: 30px"/>' +
                    '<input type="submit" value="Criar"/>' +
                    '</form>'
                )
    $('#display').empty()
    $('#display').append(form) 
    $('#display').modal()
}

const add_note = (path) => {

    var title = $('<div><h1 class="modaltext">Adicionar uma nota</h1></div>')
    var options = $('<div class="modaloptions">'+
                        '<table>' +
                        '<tr>' +
                            '<td>' +
                                '<a onClick="add(\''+path+'\',\'p\')"> <img width="60px" src="https://image.flaticon.com/icons/svg/847/847497.svg"/> </a>'+
                            '<td>' +
                                '<a onClick="add(\''+path+'\',\'p\')" style="color:black"> Paragrafo <a>' +
                        '<tr>' +
                            '<td>' +
                                '<a onClick="add(\''+path+'\',\'h1\')"> <img width= "60px" src="https://image.flaticon.com/icons/svg/587/587367.svg"/> </a>'+
                            '<td>' +
                                '<a onClick="add(\''+path+'\',\'h1\')" style="color:black"> Titulo <a>' +
                        '<tr>' +
                            '<td>' +
                                '<a onClick="add(\''+path+'\',\'h2\')"> <img width= "40px" src="https://image.flaticon.com/icons/svg/587/587367.svg"/> </a>'+
                            '<td>' +
                                '<a onClick="add(\''+path+'\',\'h2\')" style="color:black"> Subtitulo <a>' +
                        '<tr>' +
                            '<td>' +
                                '<a onClick="add(\''+path+'\',\'h3\')"> <img width= "20px" src="https://image.flaticon.com/icons/svg/587/587367.svg"/> </a>'+
                            '<td>' +
                                '<a onClick="add(\''+path+'\',\'h3\')" style="color:black, font-size:10px"> Subsubtitulo <a>' +
                        '<tr>' +
                            '<td>' +
                                '<a onClick="addList(\''+path+'\')"> <img width="60px" src="https://image.flaticon.com/icons/svg/847/847476.svg" </a>'+
                            '<td>' +
                                '<a onClick="addList(\''+path+'\')" style="color:black"> Lista <a>' +
                        '<tr>' +
                            '<td>' +
                                '<a onClick="addFile(\''+path+'\')"> <img width="60px" src="https://image.flaticon.com/icons/svg/25/25635.svg"/> </a>'+
                            '<td>' +
                                '<a onClick="addFile(\''+path+'\')" style="color:black"> Ficheiro <a>' +
                        '</table>' +
                    
                  '</div>')
    $('#display').empty()
    $('#display').append(title, options)
    $('#display').modal()
}

const add_card = (path) => {
    var form = $('<form class="w3-container" action="' 
                    + interface_link + path + 
                    '" method="post" width="100">' +
                    //TODO remove type have a cascade
                    '<input type="text" name="type" placeholder="Type"/>' +
                    '<textarea  rows = "30" cols="40"  name="text" placeholder="Texto"/>' +

                    '<input type="submit" value="Criar"/>' +
                    '</form>'
                )
    var coisas = $('<div><p>Coisas</p></div>')
    $('#display').empty()
    $('#display').append(form, coisas)
    $('#display').modal()
}

const add_group = (path) => {
    var form = $('<form class="w3-container" action="' 
                    + interface_link + path + 
                    '" method="post" width="80%">' +
                    '<input type="text" name="name" placeholder="Nome do Grupo" style="font-size: 30px"/><br/>' +
                    '<label>Permissões de leitura </label><br/>' +
                    '<input type="text" name="read_perm" placeholder="email1;email2;..." style="font-size: 30px"/><br/>' +
                    '<label>Permissões de escrita </label><br/>' +
                    '<input type="text" name="write_perm" placeholder="email1;email2;..." style="font-size: 30px"/>' +
                    '<input type="submit" value="Criar"/>' +
                    '</form>'
                )
    //var download = $('<div><a href="/download/' + f.name + '">Download</a></div>')
    var coisas = $('<div><p>Coisas</p></div>')
    $('#display').empty()
    $('#display').append(form, coisas)
    $('#display').modal()
}

const checkbox_detect = () =>{
    var check_boxes = document.getElementsByClassName("check-box");
    var checked_boxes = [];
    for(let i = 0; i < check_boxes.length; i++){
        if(check_boxes[i].checked)
            checked_boxes.push(i);
    }
    return checked_boxes;
}

const delete_elements = (path) => {
    axios.delete(interface_link + path, 
        {
            data: {l: checkbox_detect()}
        }
    )
        .then(dados => window.location.assign('/root' + path))
        .catch(err => console.log(err));
}

const swap_elements = (path) => {
    var checked_boxes = checkbox_detect();
    if(checked_boxes.length != 2){
        alert("Por favor selecione 2 caixas.");
    }else{
        axios.put(interface_link + path + '?i=' + checked_boxes[0] + '&j=' + checked_boxes[1], 
            {
                i: checked_boxes[0],
                j: checked_boxes[1]
            })
        .then(dados => window.location.assign('/root' + path))
        .catch(err => console.log(err));
    }
}

function w3_open() {
  document.getElementById("mySidebar").style.display = "block";
}

function w3_close() {
  document.getElementById("mySidebar").style.display = "none";
}
