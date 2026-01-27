package com.aquarium.Naquarium.controller;

import com.aquarium.Naquarium.service.AquariumService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
@RequiredArgsConstructor
public class MainController {

    private final AquariumService aquariumService;

    @GetMapping("/")
    public String home(Model model) {
        // DB에서 데이터 가져와서 'model'이라는 상자에 담기
        model.addAttribute("exhibitions", aquariumService.getAllExhibitions());
        model.addAttribute("schedules", aquariumService.getAllSchedules());

        // templates 폴더 안에 있는 "index.html"을 보여줘라
        return "index";
    }
}