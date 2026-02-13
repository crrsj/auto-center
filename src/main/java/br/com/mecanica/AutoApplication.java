package br.com.mecanica;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@OpenAPIDefinition(
		info = @Info(
				title = "API - Gerenciamento de oficina mecânica.",
				version = "1.0",
				description = " Aracaju Auto Center.",
				contact = @Contact()
		)
)
public class AutoApplication {

	public static void main(String[] args) {
		SpringApplication.run(AutoApplication.class, args);
	}

}
