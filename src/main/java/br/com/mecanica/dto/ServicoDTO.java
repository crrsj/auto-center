package br.com.mecanica.dto;

import br.com.mecanica.entity.Cliente;
import br.com.mecanica.entity.Veiculo;
import br.com.mecanica.enums.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Random;


@Data
public class ServicoDTO {
    private Long id;
    private Integer ordemServico ;
    @NotNull(message = "A data de entrada é obrigatória.")
    private LocalDate dataEntrada;
    @NotNull(message = "O tipo de serviço deve ser informado.")
    private TipoServico tipoServico;
    @NotBlank(message = "A descrição não pode estar em branco.")
    @Size(max = 2000, message = "A descrição é muito longa (máximo 2000 caracteres)")
    private String descricao;
    @NotNull(message = "O status inicial é obrigatório.")
    private StatusServico statusServico;
    private LocalDate dataSaida;
    @NotNull(message = "O valor não pode ser nulo.")
    @DecimalMin(value = "0.0", inclusive = true, message = "O valor não pode ser negativo.")
    private BigDecimal valor;
    @NotNull(message = "O status de pagamento é obrigatório.")
    private StatusPagamento statusPagamento;
    private Cliente cliente;
    private Veiculo veiculo;
}
