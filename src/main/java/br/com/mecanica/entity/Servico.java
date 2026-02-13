package br.com.mecanica.entity;

import br.com.mecanica.enums.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Random;


@Data
@Entity
@Table(name = "servicos")
public class Servico {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Integer ordemServico;
    private LocalDate dataEntrada;
    @Enumerated(EnumType.STRING)
    private TipoServico tipoServico;
    private String descricao;
    @Enumerated(EnumType.STRING)
    private StatusServico statusServico;
    private LocalDate dataSaida;
    private BigDecimal valor;
    @Enumerated(EnumType.STRING)
    private StatusPagamento statusPagamento;
    @ManyToOne
    @JoinColumn(name = "cliente_id")
    @JsonIgnore
    private Cliente cliente;
    @ManyToOne
    @JoinColumn(name = "veiculo_id")
    private Veiculo veiculo;
}
