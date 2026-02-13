package br.com.mecanica.dto;

import br.com.mecanica.entity.Servico;
import br.com.mecanica.entity.Veiculo;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class ClienteDTO {

    private Long id;
    private String nome;
    private String telefone;
    private String email;
    private List<Veiculo> veiculos = new ArrayList<>();
    private List<Servico>servicos = new ArrayList<>();
}
