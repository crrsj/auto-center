package br.com.mecanica.dto;

import br.com.mecanica.entity.Cliente;
import br.com.mecanica.entity.Veiculo;
import br.com.mecanica.enums.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Random;


@Data
public class ServicoDTO {
    private Long id;
    private Integer ordemServico ;
    private LocalDate dataEntrada;
    private TipoServico tipoServico;
    private String descricao;
    private StatusServico statusServico;
    private LocalDate dataSaida;
    private BigDecimal valor;
    private StatusPagamento statusPagamento;
    private Cliente cliente;
    private Veiculo veiculo;
}
