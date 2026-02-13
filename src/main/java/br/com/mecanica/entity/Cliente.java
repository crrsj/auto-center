package br.com.mecanica.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "clientes")
@Data
public class Cliente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    private String telefone;
    private String email;
    @OneToMany(mappedBy = "cliente",cascade = CascadeType.ALL)
    private List<Veiculo>veiculos = new ArrayList<>();
    @OneToMany(mappedBy = "cliente",cascade = CascadeType.ALL)
    private List<Servico>servicos = new ArrayList<>();
}
