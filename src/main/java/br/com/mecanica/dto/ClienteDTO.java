package br.com.mecanica.dto;

import br.com.mecanica.entity.Servico;
import br.com.mecanica.entity.Veiculo;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.ArrayList;
import java.util.List;

@Data
public class ClienteDTO {

    private Long id;
    @NotBlank(message = "não pode estar em branco")
    private String nome;
    @NotBlank(message = "não pode estar em branco")
    private String telefone;
    @Email(message = "formato de email inválido.")
    private String email;
    private List<Veiculo> veiculos = new ArrayList<>();
    private List<Servico>servicos = new ArrayList<>();
}
