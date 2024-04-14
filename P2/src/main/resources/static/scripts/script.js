addUserBt.addEventListener("click", () => {
    addUser();
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

function getUserList() {
    fetch("api/getUsers", {
        method: "GET"
    })
    .then((response) => {
        return response.json();
    })
    .then((data) => {
            console.log(data);

            let users = document.getElementsByClassName("user");
            while(users.length > 0){
                    users[0].parentNode.removeChild(users[0]);
            };

            data.forEach((element) => {
                let el = document.createElement("tr");
                let td1 = document.createElement("td");
                let td2 = document.createElement("td");

                td1.innerText = element.name;
                td2.innerText = element.age;

                el.appendChild(td1);
                el.appendChild(td2);
                el.classList.add("user");

                document.getElementById("userList").appendChild(el);
            });
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
    console.log(userData);
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