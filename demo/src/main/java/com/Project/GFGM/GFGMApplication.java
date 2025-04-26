package com.Project.GFGM;

import com.Project.GFGM.Model.Recette;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

@SpringBootApplication
@RestController
public class GFGMApplication {

	public static void main(String[] args) {
		SpringApplication.run(GFGMApplication.class, args);
	}

	@GetMapping
	public List<Recette> Hello(){
		return List.of(
				new Recette(1, "Pasticcio", "good food", "url")
		);
	}

}
