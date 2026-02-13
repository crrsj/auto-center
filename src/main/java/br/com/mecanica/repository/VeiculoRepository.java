package br.com.mecanica.repository;

import br.com.mecanica.entity.Veiculo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VeiculoRepository extends JpaRepository<Veiculo,Long> {
    Optional<Veiculo> findByPlaca(String placa);
}
