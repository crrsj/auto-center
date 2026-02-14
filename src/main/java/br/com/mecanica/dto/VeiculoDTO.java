package br.com.mecanica.dto;


import br.com.mecanica.entity.Cliente;
import br.com.mecanica.entity.Servico;
import br.com.mecanica.enums.Marca;
import br.com.mecanica.enums.Seguro;
import br.com.mecanica.enums.Vistoria;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Data
public class VeiculoDTO {

    private Long id;
    @NotNull(message = "A marca é obrigatória ")
    private Marca marca;
    @NotBlank(message = "O modelo é obrigatório")
    private String modelo;
    @NotNull(message = "O ano do modelo não pode ser nulo")
    private int anoModelo;
    @NotBlank(message = "A placa é obrigatória")
    private String placa;
    @NotNull(message = "A seguradora é obrigatória")
    private Seguro seguro;
    @NotNull(message = "A vistoria é obrigatória")
    private Vistoria vistoria;
    private Cliente cliente;
    private List<Servico> servicos = new ArrayList<>();
}
