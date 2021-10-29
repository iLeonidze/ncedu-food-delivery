package com.ncedu.fooddelivery.api.v1.controllers;

import com.ncedu.fooddelivery.api.v1.dto.AboutDTO;
import com.ncedu.fooddelivery.api.v1.services.TestDbConnect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AboutController {

    @Autowired
    TestDbConnect testDbConnect;

    @GetMapping("/api/v1/about")
    public AboutDTO about() {
        AboutDTO aboutDTO = new AboutDTO();
        aboutDTO.setDbName(testDbConnect.getDbName());
        return aboutDTO;
    }
}
