tree = {};
tree.contacts = [
    {
        id: 1,
        name: "Friends",
        type: "Group",
        contacts: [
            {id: 2, name: "Udi", type: "Contact"},
            {id: 3, name: "Tommy", type: "Contact"},
            {
                id: 6,
                name: "Old Friends",
                type: "Group",
                contacts: [
                    {id: 7, name: "Itay", type: "Contact"}
                ]
            }
        ]
    },
    {
        id: 4,
        name: "Family",
        type: "Group",
        contacts: [
            {id: 5, name: "Roni", type: "Contact"}
        ]
    },
    {id: 8, name: "Ori", type: "Contact"}
];


tree.get_object_by_id = function (id, object) {

    for (var i = 0; i < object.length; i++) {
        if (object[i]['id'] == id) {
            return object[i]
        }

    }
};


tree.get_object_by_ids = function (ids) {
    var object = tree.contacts;
    for (var i = 0; i < ids.length; i++) {
        if (i == 0) {
            object = tree.get_object_by_id(ids[i], object)
        }
        else {
            object = tree.get_object_by_id(ids[i], object['contacts'])
        }
    }
    return object
};

tree.create_contacts = function (object, item) {
    var contact = $('<li>');
    var contact_span = $('<p>').text(item['name']).appendTo(contact).attr('id', item['id']);
    if (item['type'] == "Group") {
        contact_span.addClass('group');
        contact_span.bind('click', tree.handleClick)
    }
    contact_span.bind('click', tree.highlight);
    contact.appendTo(object)
};

tree.create_tree = function () {
    var core_groups_ul = $('<ul>').addClass('main');

    tree.contacts.forEach(function (item) {
        tree.create_contacts(core_groups_ul, item)

    });

    $('body').append(core_groups_ul)

};

tree.get_parent_ids = function (target) {
    ids = [parseInt(target.attr('id'))];
    while (target) {
        target = target.closest('ul').siblings('p');
        if (target.length > 0) {
            ids.unshift(parseInt(target.attr('id')))
        }
        else {
            break
        }
    }
    return ids
};

tree.clean_main_groups = function () {
    main_groups = $(".main").children();
    for (var i = 0; i < main_groups.length; i++) {
        $(main_groups[i]).children('ul').remove()
    }
};
tree.highlight = function (e) {

    $('.hilit').toggleClass('hilit');
    $(e.target).addClass('hilit')
};

tree.handleClick = function (e) {

    if ($(e.target).siblings('ul').length == 0) {
        var ids = [];

        ids = tree.get_parent_ids($(e.target));

        if (ids.length == 1) {
            tree.clean_main_groups()
        }

        target_object = tree.get_object_by_ids(ids, tree.contacts);
        new_ul = $('<ul>');
        target_object['contacts'].forEach(function (contact) {
            tree.create_contacts(new_ul, contact)
        });
        $(e.target).closest('li').append(new_ul)
    }
    else {
        $(e.target).siblings('ul').remove()
    }
};

tree.start = function () {
    $(document).ready(function () {
        tree.create_tree()
    })
};

tree.start();