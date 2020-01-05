var head = list => list[0]

var map = fun => list => {
    var aux_list = [];
    for(let i=0; i < list.length; i++)
        aux_list.push (fun (list[i]));

    return aux_list;
}

var filter = cond => list => {
    var aux_list = [];
    for(let i=0; i < list.length; i++)
        if(cond (list[i]))
            aux_list.push (list[i]);

    return aux_list;
}

var foldr = fun => base => list => {
    var ret = base;
    for(let i = list.length; i>=0; i--)
        ret = fun (list[i]) (ret);
    
    return ret;
}

var curry = fun => a => b => fun (a,b)


