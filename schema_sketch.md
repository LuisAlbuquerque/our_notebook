# collection user

[
    {
        id_user
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
        id_user
        id_group
        name
        sub_group:
            [ id_group ]
        read_perm:
            [ id_user ]
        write_perm:
            [ id_user ]
        page:
        [
            {
                key: String
                value: String
            }
        ]
    }
]
