//const api_link = 'http://localhost:4877/root'
const interface_link = 'http://localhost:5877/root'

const add_card = (path) => {
    var form = $('<form class="w3-container" action="' 
                    + interface_link + path + 
                    '" method="post" width="80%">' +
                    //TODO remove type have a cascade
                    '<input type="text" name="type" placeholder="Type"/>' +
                    '<input type="text" name="text" placeholder="Texto"/>' +
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
