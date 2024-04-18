addUserBt.addEventListener("click", () => {
    addUser();
});

findByNameCB.addEventListener("change", () => {
    if(findByNameCB.checked){
        let el = document.createElement("input");
        el.type = "text";
        el.placeholder = "Имя";
        el.id = "findByNameT";

        document.getElementsByClassName("findByName")[0].appendChild(el);
    }
    else {
        document.getElementsByClassName("findByName")[0].removeChild(document.getElementById("findByNameT"));
    };
});

findByAgeCB.addEventListener("change", () => {
    if(findByAgeCB.checked){
        let el = document.createElement("input");
        el.type = "number";
        el.placeholder = "Возраст";
        el.id = "findByAgeT";

        document.getElementsByClassName("findByAge")[0].appendChild(el);
    }
    else {
        document.getElementsByClassName("findByAge")[0].removeChild(document.getElementById("findByAgeT"));
    };
});

sortFieldCB.addEventListener("change", () => {
    if(sortFieldCB.checked){
        let field = document.createElement("input");
        field.type = "text";
        field.placeholder = "Поле (name/age)";
        field.id = "sortFieldT";

        let order = document.createElement("input");
        order.type = "checkbox";
        order.id = "sortOrderCB";

        let label = document.createElement("label");
        label.htmlFor = "sortOrder";
        label.innerText = "Порядок (asc/desc)";
        label.id = "sortOrderL";

        document.getElementsByClassName("sort")[0].appendChild(field);
        document.getElementsByClassName("sort")[0].appendChild(order);
        document.getElementsByClassName("sort")[0].appendChild(label);
    }

    else {
        document.getElementsByClassName("sort")[0].removeChild(document.getElementById("sortFieldT"));
        document.getElementsByClassName("sort")[0].removeChild(document.getElementById("sortOrderCB"));
        document.getElementsByClassName("sort")[0].removeChild(document.getElementById("sortOrderL"));
    };
});

getUsersBt.addEventListener("click", () => {
    getUserList();
});

deleteUserBt.addEventListener("click", () => {
    deleteUser();
})

editUserBt.addEventListener("click", () => {
    editUser();
});

function printUserList(element) {
    let el = document.createElement("tr");
    let td1 = document.createElement("td");
    let td2 = document.createElement("td");

    td1.innerText = element.name;
    td2.innerText = element.age;

    el.appendChild(td1);
    el.appendChild(td2);
    el.classList.add("user");

    document.getElementById("userList").appendChild(el);
};

function isEmpty(str) {
    if (!str || str.length == 0) {
        return true;
    };
    return false;
};

function getUserList() {
    fetch("api/getUsers", {
        method: "GET"
    })
    .then((response) => {
        return response.json();
    })
    .then((data) => {
            console.log(data);

            // чистим таблицу
            let users = document.getElementsByClassName("user");
            while(users.length > 0) {
                    users[0].parentNode.removeChild(users[0]);
            };

            let newData = new Array();

            // сортируем список
            if (document.getElementById("sortFieldCB").checked && document.getElementById("sortFieldT").value != "") {
                switch (document.getElementById("sortFieldT").value) {
                    case "name":
                        switch (document.getElementById("sortOrderCB").checked) {
                            case true:
                                data.sort((a, b) => {
                                    const nameA = a.name.toUpperCase();
                                    const nameB = b.name.toUpperCase();

                                    if (nameA < nameB) {
                                        return -1;
                                    };

                                    return 0;
                                });
                                break;

                            case false:
                                data.sort((a, b) => {
                                    const nameA = a.name.toUpperCase();
                                    const nameB = b.name.toUpperCase();

                                    if (nameA > nameB) {
                                        return -1;
                                    };

                                    return 0;
                                });
                            break;
                        }
                        break;

                    case "age":
                        switch (document.getElementById("sortOrderCB").checked) {
                            case true:
                                data.sort(function(a, b) {return a.age - b.age});
                                break;

                            case false:
                                data.sort(function(a, b) {return b.age - a.age});
                                break;
                        }
                        break;
                }
            };

            // ищем по имени
            if (document.getElementById("findByNameCB").checked && document.getElementById("findByNameT").value != "") {
                const name = document.getElementById("findByNameT").value;
                let foundValues = new Array();

                data.forEach((element) => {
                    if(element.name == name) {
                        foundValues.push(element);
                    };
                });

                newData.push(foundValues)
            };

            // ищем по возрасту
            if (document.getElementById("findByAgeCB").checked && document.getElementById("findByAgeT").value != "") {
                const age = document.getElementById("findByAgeT").value;
                let foundValues = new Array();

                if (newData.length > 0) {
                    newData[0].forEach((element) => {
                        if(element.age == age) {
                            foundValues.push(element);
                        }
                    });
                }
                else {
                    data.forEach((element) => {
                        if(element.age == age) {
                            foundValues.push(element);
                        }
                    });
                };

                newData = new Array();
                newData.push(foundValues)
            };

            // вывод в таблицу изменённых данных
            if (newData.length > 0) {
                if (!isEmpty(document.getElementById("offsetN").value) && document.getElementById("offsetN").value > 0) {
                    var skipUsers = document.getElementById("offsetN").value;
                    var userSkip = true;
                } else {
                    var userSkip = false;
                };

                if (!isEmpty(document.getElementById("limitN").value) && document.getElementById("limitN").value > 0) {
                    var usersNumber = document.getElementById("limitN").value;
                    var userLimit = true;
                } else {
                    var userLimit = false;
                };

                if (!userSkip) {
                    for (const element of newData[0]) {
                        if (userLimit) {
                            printUserList(element);
                            usersNumber--;
                        }
                        else {
                            printUserList(element);
                        };
                        if (userLimit && usersNumber <= 0) {
                            break;
                        };
                    };
                }
                else {
                    for (const element of newData[0]) {
                        if (skipUsers > 0) {
                            skipUsers--;
                        }
                        else if (skipUsers <= 0 && !userLimit) {
                            printUserList(element);
                        }
                        else if (skipUsers <= 0 && userLimit) {
                            printUserList(element);
                            usersNumber--;
                        };
                        if (userLimit && usersNumber == 0) {
                            break;
                        };
                    };
                };

                newData = new Array();
            }
            // вывод в таблицу неизменённых данных
            else {
                if (!isEmpty(document.getElementById("offsetN").value) && document.getElementById("offsetN").value > 0) {
                    var skipUsers = document.getElementById("offsetN").value;
                    var userSkip = true;
                } else {
                    var userSkip = false;
                };

                if (!isEmpty(document.getElementById("limitN").value) && document.getElementById("limitN").value > 0) {
                    var usersNumber = document.getElementById("limitN").value;
                    var userLimit = true;
                } else {
                    var userLimit = false;
                };

                if (!userSkip) {
                    for (const element of data) {
                        if (userLimit) {
                            printUserList(element);
                            usersNumber--;
                        }
                        else {
                            printUserList(element);
                        };
                        if (userLimit && usersNumber <= 0) {
                            break;
                        };
                    };
                } else {
                    for (const element of data) {
                        if (skipUsers > 0) {
                            skipUsers--;
                        }
                        else if (skipUsers <= 0 && !userLimit) {
                            printUserList(element);
                        }
                        else if (skipUsers <= 0 && userLimit) {
                            printUserList(element);
                            usersNumber--;
                        };
                        if (userLimit && usersNumber == 0) {
                            break;
                        };
                    };
                };
            };
    });
    document.getElementById("getUsersBt").innerText = "Обновить список пользователей";
};

function addUser() {
    let userData = {
        name: document.getElementById("userName").value.toString(),
        age: Number(document.getElementById("userAge").value)
    };
    fetch("api/addUser", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    })
    .then(() => {
        getUserList();
    });
};


function deleteUser() {
    let name = document.getElementById("deletionName").value.toString()
    fetch("api/deleteUser", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(name)
    })
    .then(() => {
        getUserList();
    });
};

function editUser() {
    let userData = {
            name: document.getElementById("editName").value.toString(),
            age: Number(document.getElementById("editAge").value)
    };
    fetch("api/editUser", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    })
    .then(() => {
        getUserList();
    });
};