//const api_link = 'http://localhost:4877/root'
const interface_link = 'http://localhost:5877/root';
const api_link = 'http://localhost:4877/root';

const add_file = (path) => {
    var form = $('<form class="w3-container" action="' 
                    + api_link + path + 
                    '" method="post" width="80%">' +
                    //TODO remove type have a cascade
                    '<input id="file" type="file" name="file" />' +
                    '<input type="submit" value="Enviar"/>' +
                    '</form>'
                )
    var coisas = $('<div><p>Coisas</p></div>')
    $('#display').empty()
    $('#display').append(form, coisas)
    $('#display').modal()
}
const add = (path,type) => {
    var form = $('<form class="w3-container" action="' 
                    + interface_link + path +"?type="+type +
                    '" method="post" width="100">' +
                    //TODO remove type have a cascade
                    '<textarea  rows = "30" cols="40"  name="text" placeholder="Texto"/>' +
                    '<input id="tags" type="text" name="tags" placeholder="tag1;tag2..."/>' +
                    '<input type="submit" value="Criar"/>' +
                    '</form>'
                )
    $('#display').empty()
    $('#display').append(form) 
    $('#display').modal()
}



var add_to_list = () => {
    document.getElementById("ul").innerHTML += '<input id="text" type="text" name="text" placeholder="Texto"/>'
}
const addList = (path,type) => {

    var add = $('<button onclick="(add_to_list())" > + </button>');
    var form = $('<form class="w3-container" action="'
                    + interface_link + path +"?type=list" +
                    '" method="post" width="100">' +
                    //TODO remove type have a cascade
                    '<input id="text" type="text" name="text" placeholder="Texto"/>' +
                    '<div id="ul"></div>' +
                    '<input id="tags" type="text" name="tags" placeholder="tag1;tag2..."/>' +
                    '<input type="submit" value="Criar"/>' +
                    '</form>'
                );
    $('#display').empty()
    $('#display').append(form,add)
    $('#display').modal()

}

const addFile = (path) => {
    var form = $('<form class="w3-container" action="' 
                    + api_link + path +"?type=file"+ 
                    '" method="post" enctype="multipart/form-data">' +
                    //TODO remove type have a cascade
                    '<input type="file" name="file" />' +
                    '<input id="tags" type="text" name="tags" placeholder="tag1;tag2..."/>' +
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
                        '<a onClick="add(\''+path+'\',\'p\')"> P </a>'+
                        '<a onClick="add(\''+path+'\',\'h1\')"> H1 </a>'+
                        '<a onClick="add(\''+path+'\',\'h2\')"> H2 </a>'+
                        '<a onClick="add(\''+path+'\',\'h3\')"> H3 </a>'+
                        '<a onClick="addList(\''+path+'\')"> List </a>'+
                        '<a onClick="addFile(\''+path+'\')"> Ficheiro </a>'+
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
                    '<input type="text" name="mail" placeholder="Email"/>' +
                    '<input type="text" name="name" placeholder="Nome do Grupo"/>' +
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


