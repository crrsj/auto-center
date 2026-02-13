package br.com.mecanica.entity;

import br.com.mecanica.enums.Marca;
import br.com.mecanica.enums.Seguro;
import br.com.mecanica.enums.Vistoria;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;


@Entity
@Table(name = "veiculos")
@Data
public class Veiculo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Enumerated(EnumType.STRING)
    private Marca marca;
    private String modelo;
    private int anoModelo;
    private String placa;
    @Enumerated(EnumType.STRING)
    private Seguro seguro;
    @Enumerated(EnumType.STRING)
    private Vistoria vistoria;
    @ManyToOne
    @JoinColumn(name = "cliente_id")
    @JsonIgnore
    private  Cliente cliente;
    @OneToMany(mappedBy = "veiculo")
    @JsonIgnore
    private List<Servico>servicos = new ArrayList<>();
}
