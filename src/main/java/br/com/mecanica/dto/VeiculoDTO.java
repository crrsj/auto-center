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
import lombok.Data;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Data
public class VeiculoDTO {

    private Long id;
    private Marca marca;
    private String modelo;
    private int anoModelo;
    private String placa;
    private Seguro seguro;
    private Vistoria vistoria;
    private Cliente cliente;
    private List<Servico> servicos = new ArrayList<>();
}
