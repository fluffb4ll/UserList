package com.example.P2.controller;

import com.example.P2.model.response.UserDataResponse;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.catalina.User;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.util.ArrayList;
import java.util.List;


@org.springframework.web.bind.annotation.RestController
public class RestController {

    @PostMapping("api/addUser")
    public void addUser(@RequestBody UserDataResponse json) {       // TODO: сделать проверку на пустую строку
        File data = new File("src/main/resources/data.json");
        ObjectMapper mapper = new ObjectMapper();

        try {
            if (mapper.readTree(data).toString().length() != 2) {
                List<UserDataResponse> readData =
                        mapper.readValue(mapper.readTree(data).toString().replace(']', ',') +
                                        String.format("{\"name\":\"%s\",\"age\":%d}]", json.getName(), json.getAge()),
                                new TypeReference<List<UserDataResponse>>(){});
                mapper.writeValue(data, readData);
            } else {
                List<UserDataResponse> readData =
                        mapper.readValue(mapper.readTree(data).toString().replace("]", "") +
                                        String.format("{\"name\":\"%s\",\"age\":%d}]", json.getName(), json.getAge()),
                                new TypeReference<List<UserDataResponse>>(){});
                mapper.writeValue(data, readData);
            }
        }
        catch (IOException e) {
            System.err.println(e);
        }

    }

    @GetMapping("api/getUsers")
    public List<UserDataResponse> getUsers() {
        File data = new File("src/main/resources/data.json");
        ObjectMapper mapper = new ObjectMapper();
        try {
            return mapper.readValue(mapper.readTree(data).toString(), new TypeReference<List<UserDataResponse>>(){});
        }
        catch (Exception e) {
            System.err.println(e);
        }
        return null;
    }

    @DeleteMapping("api/deleteUser")
    public void deleteUsers(@RequestBody String name) {     // TODO: сделать проверку на пустую строку
        String searchName = "";
        for (int i = 1; i < name.length() - 1; i++) {
            searchName += name.charAt(i);
        }

        File data = new File("src/main/resources/data.json");
        ObjectMapper mapper = new ObjectMapper();

        try {
            if (!mapper.readTree(data).toString().isEmpty()) {
                List<UserDataResponse> readData =
                        mapper.readValue(mapper.readTree(data).toString(), new TypeReference<List<UserDataResponse>>(){});
                List<UserDataResponse> newData = new ArrayList<UserDataResponse>(){};

                for (UserDataResponse user : readData) {
                    if (!user.getName().equals(searchName)) {
                        newData.add(user);
                    }
                }

                mapper.writeValue(data, newData);
            }
        }
        catch (Exception e) {
            System.err.println(e);
        }
    }

    @PatchMapping("api/editUser")
    public void editUser(@RequestBody UserDataResponse json) {
        File data = new File("src/main/resources/data.json");
        ObjectMapper mapper = new ObjectMapper();

        try {
            if (!mapper.readTree(data).toString().isEmpty()) {
                List<UserDataResponse> readData =
                        mapper.readValue(mapper.readTree(data).toString(), new TypeReference<List<UserDataResponse>>(){});
                List<UserDataResponse> newData = new ArrayList<UserDataResponse>(){};

                for (UserDataResponse user : readData) {
                    if (!user.getName().equals(json.getName())) {
                        newData.add(user);
                    }
                    else {
                        newData.add(json);
                    }
                }

                mapper.writeValue(data, newData);
            }
        }
        catch (Exception e) {
            System.err.println(e);
        }
    }
}
