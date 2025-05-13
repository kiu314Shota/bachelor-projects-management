package com.kiux.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class KiuxApplication {

	public static void main(String[] args) {
		SpringApplication.run(KiuxApplication.class, args);
		System.out.println("Kiux Application started successfully!");
	}

}
