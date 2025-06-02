package com.easymeal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
@ComponentScan(basePackages = { "com.easymeal" })
public class BackendApplication {

	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.configure()
				.directory("backend")
				.load(); // Carga el .env automáticamente

		System.setProperty("OPENAI_API_KEY", dotenv.get("OPENAI_API_KEY"));
		System.setProperty("OPENAI_PROJECT_ID", dotenv.get("OPENAI_PROJECT_ID"));

		SpringApplication.run(BackendApplication.class, args);
	}

}
