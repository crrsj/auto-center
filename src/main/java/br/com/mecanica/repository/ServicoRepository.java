package br.com.mecanica.repository;

import br.com.mecanica.entity.Servico;
import br.com.mecanica.enums.StatusServico;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ServicoRepository extends JpaRepository<Servico,Long> {
    Optional<Servico> findByOrdemServico(Integer ordemServico);

    Optional<Servico> findByStatusServico(StatusServico statusServico);
}
