const addGroup = (path) => {
    var form = $('<form class="w3-container" action="http://localhost:3000/root' 
                    + path + 
                    '" method="post" width="80%">' +
                    '<input type="text" name="group_name" placeholder="Nome do Grupo"/>' +
                    '<input type="submit" value="Criar"/>' +
                    '</form>'
                )
    //var download = $('<div><a href="/download/' + f.name + '">Download</a></div>')
    var coisas = $('<div><p>Coisas</p></div>')
    $("#display").empty()
    $('#display').append(form, coisas)
    $('#display').modal()
}
