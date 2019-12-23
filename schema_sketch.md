# collection user

[
    {
        id
        name
        email
        password (encripted?)
        favourite:
            [ id_group ]
    }
]

# collection group

[
    {
        id_creator
        id
        name
        read_perm:
            [ id ]
        write_perm:
            [ id ]
        page:
        [
            cards_Shema
        ]
    }
]

# card\_Schema
[
    {
        key: String
        value: String
    }
]
